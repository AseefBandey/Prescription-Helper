import { GoogleGenerativeAI } from '@google/generative-ai';
import { Medication, DoctorInfo, Prescription } from '../types/index';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ExtractedPrescriptionData {
  medications: Medication[];
  doctorInfo?: DoctorInfo;
  prescriptionDate?: string;
  expiryDate?: string;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
  };
  clinicInfo?: {
    name?: string;
    address?: string;
    phone?: string;
  };
  appointments?: Array<{
    doctorName: string;
    appointmentDate: string;
    appointmentTime?: string;
    reason: string;
    location?: string;
    notes?: string;
  }>;
}

export interface MedicationInfo {
  name: string;
  genericName?: string;
  description: string;
  commonDosages: string[];
  sideEffects: string[];
  interactions: string[];
  precautions: string[];
  category: string;
}

class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Extract text from prescription image using Gemini Vision
   */
  async extractTextFromImage(imageData: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const prompt = `
        Please extract all text from this prescription image. 
        Focus on:
        - Medication names and dosages
        - Doctor information
        - Patient information
        - Prescription date and expiry
        - Instructions and notes
        
        Provide the extracted text in a clear, organized format.
      `;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Parse prescription data from extracted text
   */
  async parsePrescriptionData(extractedText: string): Promise<ExtractedPrescriptionData> {
    try {
      const prompt = `
        Analyze this prescription text and extract structured data. Return a JSON object with the following structure:
        {
          "medications": [
            {
              "name": "medication name (extract exact medicine name)",
              "dosage": "dosage amount and unit",
              "frequency": {
                "type": "daily|weekly|as-needed",
                "timesPerDay": number,
                "daysOfWeek": [0,1,2,3,4,5,6],
                "interval": number,
                "maxPerDay": number
              },
              "duration": "duration string",
              "instructions": "special instructions",
              "isActive": true
            }
          ],
          "doctorInfo": {
            "name": "doctor name",
            "specialty": "specialty",
            "clinic": "clinic name",
            "phone": "phone number",
            "address": "address"
          },
          "prescriptionDate": "YYYY-MM-DD",
          "expiryDate": "YYYY-MM-DD",
          "patientInfo": {
            "name": "patient name",
            "age": "age",
            "gender": "gender"
          },
          "clinicInfo": {
            "name": "clinic name",
            "address": "clinic address",
            "phone": "clinic phone"
          },
          "appointments": [
            {
              "doctorName": "doctor name",
              "appointmentDate": "YYYY-MM-DD",
              "appointmentTime": "HH:mm",
              "reason": "follow-up|check-up|consultation",
              "location": "clinic address",
              "notes": "any additional notes"
            }
          ]
        }

        Prescription text:
        ${extractedText}

        IMPORTANT: 
        1. Extract ALL medicine names mentioned in the prescription
        2. Look for any return visits, follow-up appointments, or "come back" instructions
        3. If appointment dates like "return in 2 weeks" are mentioned, calculate the actual date
        4. Please extract as much information as possible. If some information is not available, omit those fields. Ensure all dates are in YYYY-MM-DD format.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      // Add IDs and default values to medications
      if (parsedData.medications) {
        parsedData.medications = parsedData.medications.map((med: any) => ({
          ...med,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          startDate: parsedData.prescriptionDate || new Date().toISOString().split('T')[0],
          reminderTimes: [],
          sideEffects: [],
          notes: ''
        }));
      }

      return parsedData;
    } catch (error) {
      console.error('Error parsing prescription data:', error);
      throw new Error('Failed to parse prescription data');
    }
  }

  /**
   * Get medication information and recommendations
   */
  async getMedicationInfo(medicationName: string): Promise<MedicationInfo> {
    try {
      const prompt = `
        Provide detailed information about the medication "${medicationName}". 
        Return a JSON object with the following structure:
        {
          "name": "${medicationName}",
          "genericName": "generic name if different",
          "description": "brief description of what this medication treats",
          "commonDosages": ["list of common dosage amounts"],
          "sideEffects": ["list of common side effects"],
          "interactions": ["list of common drug interactions"],
          "precautions": ["list of important precautions"],
          "category": "medication category (e.g., antibiotic, pain reliever, etc.)"
        }

        Provide accurate, general medical information. Include disclaimers about consulting healthcare providers.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text();
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error getting medication info:', error);
      throw new Error('Failed to get medication information');
    }
  }

  /**
   * Generate medication reminders and schedule suggestions
   */
  async generateMedicationSchedule(medications: Medication[]): Promise<string[]> {
    try {
      const prompt = `
        Based on these medications, suggest an optimal daily schedule for taking them:
        ${JSON.stringify(medications, null, 2)}

        Consider:
        - Drug interactions and timing
        - Food requirements
        - Sleep schedule
        - Common daily routines

        Return an array of time suggestions in HH:mm format, with explanations.
        Example: ["08:00 - Morning medications with breakfast", "14:00 - Afternoon dose", "20:00 - Evening medications"]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract time suggestions from the response
      const timePattern = /\d{2}:\d{2}/g;
      const times = text.match(timePattern) || [];
      
      return times;
    } catch (error) {
      console.error('Error generating medication schedule:', error);
      return [];
    }
  }

  /**
   * Check for potential drug interactions
   */
  async checkDrugInteractions(medications: Medication[]): Promise<string[]> {
    try {
      const medicationNames = medications.map(med => med.name).join(', ');
      
      const prompt = `
        Check for potential drug interactions between these medications: ${medicationNames}

        Return an array of interaction warnings. Each warning should be a clear, concise statement.
        If no significant interactions are found, return an empty array.
        Include severity level (mild, moderate, severe) in each warning.

        Example format:
        ["Moderate: Medication A may increase the effects of Medication B - monitor for increased drowsiness"]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response to extract warnings
      const lines = text.split('\n').filter(line => line.trim());
      const warnings = lines.filter(line => 
        line.includes('Mild:') || line.includes('Moderate:') || line.includes('Severe:')
      );
      
      return warnings;
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      return [];
    }
  }

  /**
   * Generate health insights and recommendations
   */
  async generateHealthInsights(prescriptions: Prescription[]): Promise<string[]> {
    try {
      const allMedications = prescriptions.flatMap(p => p.medications || []);
      
      const prompt = `
        Based on this medication history, provide health insights and recommendations:
        ${JSON.stringify(allMedications, null, 2)}

        Focus on:
        - Medication adherence tips
        - Lifestyle recommendations
        - Monitoring suggestions
        - General health advice

        Return an array of actionable insights. Keep each insight concise and helpful.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract insights from the response
      const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      const insights = lines.map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
      
      return insights.slice(0, 10); // Limit to 10 insights
    } catch (error) {
      console.error('Error generating health insights:', error);
      return [];
    }
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!API_KEY;
  }
}

export const geminiService = new GeminiService(); 
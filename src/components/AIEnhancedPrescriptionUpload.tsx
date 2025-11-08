import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { Prescription } from '../types';

interface AIEnhancedPrescriptionUploadProps {
  onUpload: (prescription: Prescription) => void;
  onMedicineExtracted?: (medicines: any[]) => void;
  onAppointmentExtracted?: (appointments: any[]) => void;
  fontSize?: string;
  language?: string;
}

const AIEnhancedPrescriptionUpload: React.FC<AIEnhancedPrescriptionUploadProps> = ({
  onUpload,
  onMedicineExtracted,
  onAppointmentExtracted,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setIsProcessing(true);
    setExtractedText('');

    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file);
      
      // Extract text using Gemini AI
      console.log('🤖 Extracting text from image...');
      const extractedTextResult = await geminiService.extractTextFromImage(base64Data);
      setExtractedText(extractedTextResult);
      console.log('✅ Text extracted:', extractedTextResult);

      // Parse prescription data
      console.log('🤖 Parsing prescription data...');
      const parsedData = await geminiService.parsePrescriptionData(extractedTextResult);
      console.log('✅ Parsed data:', parsedData);

      // Create prescription object
      const prescription: Prescription = {
        id: Date.now().toString(),
        patientName: parsedData.patientInfo?.name || 'Unknown',
        doctorName: parsedData.doctorInfo?.name || 'Unknown',
        date: parsedData.prescriptionDate || new Date().toISOString().split('T')[0],
        medications: parsedData.medications || [],
        imageUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        extractedText: extractedTextResult,
        createdAt: new Date().toISOString(),
      };

      // Call callbacks
      onUpload(prescription);
      
      if (onMedicineExtracted && parsedData.medications) {
        onMedicineExtracted(parsedData.medications);
      }
      
      if (onAppointmentExtracted && parsedData.appointments) {
        onAppointmentExtracted(parsedData.appointments);
      }

      // Success notification
      alert('✅ Done! We extracted everything from your prescription.');
      
    } catch (err) {
      console.error('Error processing prescription:', err);
      setError(err instanceof Error ? err.message : 'Failed to process prescription');
      alert('❌ Error: ' + (err instanceof Error ? err.message : 'Failed to process prescription'));
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-8">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Reading your prescription... 🤖
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This usually takes a few seconds
            </p>
          </div>
        ) : (
          <>
            <div className="text-6xl mb-4">📸</div>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Drop your prescription here
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              or click to pick a file • AI will do the rest ✨
            </p>
            <button
              onClick={handleButtonClick}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Browse Files
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              JPG or PNG • Max 10MB
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Extracted Text Preview */}
      {extractedText && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ✅ Text Extracted Successfully!
          </p>
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-green-200 dark:border-green-700">
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {extractedText}
            </p>
          </div>
        </div>
      )}

      {/* API Key Warning */}
      {!geminiService.isConfigured() && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Warning: Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIEnhancedPrescriptionUpload;


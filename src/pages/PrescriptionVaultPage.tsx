import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Prescription } from '../types';
import AIEnhancedPrescriptionUpload from '../components/AIEnhancedPrescriptionUpload';

const PrescriptionVaultPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Load saved prescriptions from localStorage on component mount
  useEffect(() => {
    const savedPrescriptions = localStorage.getItem('prescriptions');
    if (savedPrescriptions) {
      try {
        setPrescriptions(JSON.parse(savedPrescriptions));
      } catch (error) {
        console.error('Failed to load prescriptions:', error);
      }
    }
  }, []);

  // Save prescriptions to localStorage whenever prescriptions change
  useEffect(() => {
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const handlePrescriptionUpload = (newPrescription: Prescription) => {
    setPrescriptions(prev => [newPrescription, ...prev]);
  };

  const handleMedicineExtracted = (medicines: any[]) => {
    // Save extracted medicines to medicine cabinet
    const savedMedicines = localStorage.getItem('medicines') || '[]';
    try {
      const existingMedicines = JSON.parse(savedMedicines);
      const updatedMedicines = [...existingMedicines, ...medicines];
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      console.log('Medicines added to cabinet:', medicines);
    } catch (error) {
      console.error('Failed to save medicines:', error);
    }
  };

  const handleAppointmentExtracted = (appointments: any[]) => {
    // Save extracted appointments 
    const savedAppointments = localStorage.getItem('appointments') || '[]';
    try {
      const existingAppointments = JSON.parse(savedAppointments);
      const updatedAppointments = [...existingAppointments, ...appointments];
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      console.log('Appointments added:', appointments);
    } catch (error) {
      console.error('Failed to save appointments:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          📄 Prescription Vault
        </h1>

        {/* Upload Component */}
        <AIEnhancedPrescriptionUpload
          onUpload={handlePrescriptionUpload}
          onMedicineExtracted={handleMedicineExtracted}
          onAppointmentExtracted={handleAppointmentExtracted}
          fontSize="normal"
          language="en"
        />

        {/* Prescriptions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescriptions List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Prescriptions ({prescriptions.length})
            </h2>
            
            {prescriptions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  No prescriptions uploaded yet.
                  Upload your first prescription using the form above!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer border-2 transition-colors ${
                      selectedPrescription?.id === prescription.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {prescription.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded: {new Date(prescription.uploadDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {prescription.fileType.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(prescription.size)}
                          </span>
                          {prescription.aiProcessed && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                              🤖 AI Processed ({Math.round((prescription.aiConfidence || 0) * 100)}%)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {prescription.medications && prescription.medications.length > 0 && (
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            {prescription.medications.length} medication{prescription.medications.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prescription Details */}
          <div className="lg:col-span-1">
            {selectedPrescription ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Prescription Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPrescription.name}
                    </p>
                  </div>

                  {selectedPrescription.extractedText && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Extracted Text</label>
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                          {selectedPrescription.extractedText}
                        </pre>
                      </div>
                    </div>
                  )}

                  {selectedPrescription.medications && selectedPrescription.medications.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Medications</label>
                      <div className="mt-1 space-y-2">
                        {selectedPrescription.medications.map((med, index) => (
                          <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="font-medium text-blue-900 dark:text-blue-100">
                              {med.name} - {med.dosage}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              {med.instructions}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">File Type</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPrescription.fileType.toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">File Size</label>
                    <p className="text-gray-900 dark:text-white">
                      {formatFileSize(selectedPrescription.size)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Upload Date</label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedPrescription.uploadDate).toLocaleString()}
                    </p>
                  </div>

                  {selectedPrescription.aiProcessed && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Confidence</label>
                      <p className="text-gray-900 dark:text-white">
                        {Math.round((selectedPrescription.aiConfidence || 0) * 100)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a prescription to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionVaultPage; 
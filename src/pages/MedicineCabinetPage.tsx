import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  expiryDate: string;
  notes: string;
  createdAt: string;
}

const MedicineCabinetPage: React.FC = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineInfo, setMedicineInfo] = useState<any>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    quantity: 0,
    expiryDate: '',
    notes: '',
  });

  // Load medicines from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medicines');
    if (saved) {
      try {
        setMedicines(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load medicines:', error);
      }
    }
  }, []);

  // Save medicines to localStorage
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);

  const handleAddMedicine = () => {
    if (!newMedicine.name.trim()) {
      alert('Please enter medicine name');
      return;
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      ...newMedicine,
      createdAt: new Date().toISOString(),
    };

    setMedicines(prev => [medicine, ...prev]);
    setNewMedicine({ name: '', dosage: '', quantity: 0, expiryDate: '', notes: '' });
    setShowAddForm(false);
    alert('✅ Added to your cabinet!');
  };

  const handleDeleteMedicine = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleGetInfo = async (medicineName: string) => {
    setLoadingInfo(true);
    setMedicineInfo(null);
    try {
      const info = await geminiService.getMedicationInfo(medicineName);
      setMedicineInfo(info);
    } catch (error) {
      console.error('Error getting medicine info:', error);
      alert('Failed to get medicine information');
    } finally {
      setLoadingInfo(false);
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              💊 Your Medicine Cabinet
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="text-xl mr-2">+</span>
            Add Medicine
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Medicines</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{medicines.length}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Expiring Soon</p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
              {medicines.filter(m => isExpiringSoon(m.expiryDate)).length}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-4">
            <p className="text-sm text-red-700 dark:text-red-400">Expired</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-300">
              {medicines.filter(m => isExpired(m.expiryDate)).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Medicine Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Medicine
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Aspirin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newMedicine.notes}
                    onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddMedicine}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Medicine
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Medicines List */}
        <div className="space-y-4">
          {filteredMedicines.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">💊</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'Nothing found' : 'Your cabinet is empty'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery ? 'Try a different search term' : 'Start by adding some medicines you have at home'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Medicine
                </button>
              )}
            </div>
          ) : (
            filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                  isExpired(medicine.expiryDate)
                    ? 'border-l-4 border-red-500'
                    : isExpiringSoon(medicine.expiryDate)
                    ? 'border-l-4 border-yellow-500'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {medicine.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {medicine.dosage && (
                        <p>
                          <span className="font-medium">Dosage:</span> {medicine.dosage}
                        </p>
                      )}
                      {medicine.quantity > 0 && (
                        <p>
                          <span className="font-medium">Quantity:</span> {medicine.quantity}
                        </p>
                      )}
                      {medicine.expiryDate && (
                        <p>
                          <span className="font-medium">Expiry:</span> {new Date(medicine.expiryDate).toLocaleDateString()}
                          {isExpired(medicine.expiryDate) && (
                            <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">Expired!</span>
                          )}
                          {isExpiringSoon(medicine.expiryDate) && !isExpired(medicine.expiryDate) && (
                            <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-semibold">Expiring Soon</span>
                          )}
                        </p>
                      )}
                    </div>
                    {medicine.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="font-medium">Notes:</span> {medicine.notes}
                      </p>
                    )}
                    <button
                      onClick={() => handleGetInfo(medicine.name)}
                      disabled={loadingInfo}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                    >
                      {loadingInfo ? '🤖 Getting info...' : '📚 Get AI Information'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteMedicine(medicine.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete medicine"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Medicine Info Modal */}
        {medicineInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full my-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {medicineInfo.name}
                </h2>
                <button
                  onClick={() => setMedicineInfo(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4 text-sm">
                {medicineInfo.genericName && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Generic Name:</h3>
                    <p className="text-gray-600 dark:text-gray-400">{medicineInfo.genericName}</p>
                  </div>
                )}
                {medicineInfo.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Description:</h3>
                    <p className="text-gray-600 dark:text-gray-400">{medicineInfo.description}</p>
                  </div>
                )}
                {medicineInfo.sideEffects && medicineInfo.sideEffects.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Side Effects:</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      {medicineInfo.sideEffects.map((effect: string, idx: number) => (
                        <li key={idx}>{effect}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {medicineInfo.interactions && medicineInfo.interactions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Drug Interactions:</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      {medicineInfo.interactions.map((interaction: string, idx: number) => (
                        <li key={idx}>{interaction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {medicineInfo.precautions && medicineInfo.precautions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Precautions:</h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      {medicineInfo.precautions.map((precaution: string, idx: number) => (
                        <li key={idx}>{precaution}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => setMedicineInfo(null)}
                className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineCabinetPage;

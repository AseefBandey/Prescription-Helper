import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MedicationSchedule {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions: string;
  taken: { [date: string]: boolean[] };
  createdAt: string;
}

const MedicationSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSchedule, setNewSchedule] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'daily',
    times: [''],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
  });

  // Load schedules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medicationSchedules');
    if (saved) {
      try {
        setSchedules(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load schedules:', error);
      }
    }
  }, []);

  // Save schedules to localStorage
  useEffect(() => {
    localStorage.setItem('medicationSchedules', JSON.stringify(schedules));
  }, [schedules]);

  const handleAddSchedule = () => {
    if (!newSchedule.medicineName.trim()) {
      alert('Please enter medicine name');
      return;
    }

    if (newSchedule.times.some(t => !t)) {
      alert('Please fill all time slots');
      return;
    }

    const schedule: MedicationSchedule = {
      id: Date.now().toString(),
      ...newSchedule,
      taken: {},
      createdAt: new Date().toISOString(),
    };

    setSchedules(prev => [schedule, ...prev]);
    setNewSchedule({
      medicineName: '',
      dosage: '',
      frequency: 'daily',
      times: [''],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: '',
    });
    setShowAddForm(false);
    alert('✅ Schedule created! Don\'t forget to take your meds.');
  };

  const handleMarkAsTaken = (scheduleId: string, timeIndex: number) => {
    setSchedules(prev =>
      prev.map(schedule => {
        if (schedule.id === scheduleId) {
          const taken = { ...schedule.taken };
          if (!taken[selectedDate]) {
            taken[selectedDate] = new Array(schedule.times.length).fill(false);
          }
          taken[selectedDate][timeIndex] = !taken[selectedDate][timeIndex];
          return { ...schedule, taken };
        }
        return schedule;
      })
    );
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  const addTimeSlot = () => {
    setNewSchedule(prev => ({ ...prev, times: [...prev.times, ''] }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setNewSchedule(prev => {
      const times = [...prev.times];
      times[index] = value;
      return { ...prev, times };
    });
  };

  const removeTimeSlot = (index: number) => {
    setNewSchedule(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  };

  const getTodaySchedules = () => {
    return schedules.filter(s => {
      const start = new Date(s.startDate);
      const end = s.endDate ? new Date(s.endDate) : null;
      const today = new Date(selectedDate);
      return today >= start && (!end || today <= end);
    });
  };

  const getCompletionRate = (schedule: MedicationSchedule) => {
    const taken = schedule.taken[selectedDate] || [];
    const completed = taken.filter(Boolean).length;
    const total = schedule.times.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const todaySchedules = getTodaySchedules();

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
              ⏰ Med Schedule
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="text-xl mr-2">+</span>
            Add Schedule
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Schedules</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{schedules.length}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">Active Today</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{todaySchedules.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4">
            <p className="text-sm text-green-700 dark:text-green-400">Completed Today</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {todaySchedules.filter(s => getCompletionRate(s) === 100).length}
            </p>
          </div>
        </div>

        {/* Add Schedule Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full my-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Schedule
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    value={newSchedule.medicineName}
                    onChange={(e) => setNewSchedule({ ...newSchedule, medicineName: e.target.value })}
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
                    value={newSchedule.dosage}
                    onChange={(e) => setNewSchedule({ ...newSchedule, dosage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="as-needed">As Needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Times *
                  </label>
                  {newSchedule.times.map((time, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {newSchedule.times.length > 1 && (
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addTimeSlot}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add another time
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newSchedule.startDate}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newSchedule.endDate}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instructions
                  </label>
                  <textarea
                    value={newSchedule.instructions}
                    onChange={(e) => setNewSchedule({ ...newSchedule, instructions: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="e.g., Take with food"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Schedule
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

        {/* Schedules List */}
        <div className="space-y-4">
          {todaySchedules.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">⏰</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No medication schedules for this date
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Schedule
              </button>
            </div>
          ) : (
            todaySchedules.map((schedule) => {
              const completionRate = getCompletionRate(schedule);
              const taken = schedule.taken[selectedDate] || new Array(schedule.times.length).fill(false);

              return (
                <div
                  key={schedule.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {schedule.medicineName}
                      </h3>
                      {schedule.dosage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.dosage} • {schedule.frequency}
                        </p>
                      )}
                      {schedule.instructions && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          📝 {schedule.instructions}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-3">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {completionRate}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete schedule"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Time Checkboxes */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {schedule.times.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => handleMarkAsTaken(schedule.id, index)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          taken[index]
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{time}</span>
                          <span className="text-xl">{taken[index] ? '✓' : '○'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationSchedulePage;

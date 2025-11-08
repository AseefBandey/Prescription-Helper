import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  location: string;
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [newAppointment, setNewAppointment] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    reason: '',
    location: '',
    notes: '',
    status: 'upcoming' as const,
  });

  // Load appointments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load appointments:', error);
      }
    }
  }, []);

  // Save appointments to localStorage
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleAddAppointment = () => {
    if (!newAppointment.doctorName.trim()) {
      alert('Please enter doctor name');
      return;
    }
    if (!newAppointment.date) {
      alert('Please select appointment date');
      return;
    }
    if (!newAppointment.time) {
      alert('Please select appointment time');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [appointment, ...prev]);
    setNewAppointment({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      reason: '',
      location: '',
      notes: '',
      status: 'upcoming',
    });
    setShowAddForm(false);
    alert('✅ Appointment booked! See you there.');
  };

  const handleUpdateStatus = (id: string, status: 'upcoming' | 'completed' | 'cancelled') => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter(apt => apt.status === filter);
  };

  const sortedAppointments = getFilteredAppointments().sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const upcomingCount = appointments.filter(apt => apt.status === 'upcoming').length;
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;

  const isUpcoming = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return appointmentDate > new Date();
  };

  const getTimeUntil = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = appointmentDate.getTime() - now.getTime();
    
    if (diff < 0) return 'Past';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    return 'Soon';
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
              🩺 Appointments
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <span className="text-xl mr-2">+</span>
            Add Appointment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">Upcoming</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{upcomingCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow p-4">
            <p className="text-sm text-green-700 dark:text-green-400">Completed</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">{completedCount}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === tab
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add Appointment Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full my-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Add New Appointment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={newAppointment.doctorName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Dr. Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={newAppointment.specialty}
                    onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Cardiologist"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Annual checkup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Medical Center, Room 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Bring previous test results..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddAppointment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Appointment
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

        {/* Appointments List */}
        <div className="space-y-4">
          {sortedAppointments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🩺</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'No appointments yet' : `No ${filter} appointments`}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === 'all' ? 'Keep track of your doctor visits here' : `You don't have any ${filter} appointments`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Appointment
                </button>
              )}
            </div>
          ) : (
            sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
                  appointment.status === 'completed'
                    ? 'opacity-75'
                    : appointment.status === 'cancelled'
                    ? 'opacity-50'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-4xl">
                        {appointment.status === 'completed' ? '✅' : appointment.status === 'cancelled' ? '❌' : '📅'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {appointment.doctorName}
                        </h3>
                        {appointment.specialty && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {appointment.specialty}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div>
                        <span className="font-medium">📅 Date:</span>{' '}
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">🕐 Time:</span> {appointment.time}
                        {appointment.status === 'upcoming' && isUpcoming(appointment.date, appointment.time) && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400 font-semibold">
                            {getTimeUntil(appointment.date, appointment.time)}
                          </span>
                        )}
                      </div>
                      {appointment.reason && (
                        <div className="col-span-2">
                          <span className="font-medium">📝 Reason:</span> {appointment.reason}
                        </div>
                      )}
                      {appointment.location && (
                        <div className="col-span-2">
                          <span className="font-medium">📍 Location:</span> {appointment.location}
                        </div>
                      )}
                      {appointment.notes && (
                        <div className="col-span-2">
                          <span className="font-medium">💭 Notes:</span> {appointment.notes}
                        </div>
                      )}
                    </div>

                    {/* Status Buttons */}
                    {appointment.status === 'upcoming' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                        >
                          ✓ Mark Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                          className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete appointment"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;

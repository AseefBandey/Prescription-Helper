import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                💊 Prescription Helper
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, {user?.firstName}!
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Hey {user?.firstName} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's your health stuff. Keep track of everything in one place.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => navigate('/vault')}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow text-left"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Prescription Vault
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Upload & Manage
                    </p>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/cabinet')}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow text-left"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">💊</div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Medicine Cabinet
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Manage Inventory
                    </p>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/schedule')}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow text-left"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Medication Schedule
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Set Reminders
                    </p>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/appointments')}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow text-left"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">🩺</div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Appointments
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Schedule Visits
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-lg font-bold mb-4">Your Health Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">Prescriptions</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">Medicines</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">Schedules</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">Appointments</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 
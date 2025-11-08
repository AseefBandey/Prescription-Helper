import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          👤 Profile Settings
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              User Information
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Joined:</strong> {user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Email Verified:</strong> {user?.isEmailVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Coming soon! This will be where you can update your profile settings and preferences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
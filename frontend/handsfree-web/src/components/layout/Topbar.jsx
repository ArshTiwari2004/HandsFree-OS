import React from 'react';
import { useAuth } from '../../services/auth';
import { useFeedback } from '../../services/feedback';

const Topbar = () => {
  const { user, logout } = useAuth();
  const { showFeedback } = useFeedback();

  const handleLogout = async () => {
    try {
      await logout();
      showFeedback('Successfully logged out', 'success');
    } catch (error) {
      showFeedback('Logout failed', 'error');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-gray-500">
            <span className="material-icons-outlined">menu</span>
          </button>
          <h2 className="text-lg font-medium text-gray-800">Gesture Control Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
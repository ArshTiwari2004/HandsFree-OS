import React from 'react';
import { useAuth } from '../services/auth';
import { useFeedback } from '../services/feedback';
import GestureStatus from '../components/GestureStatus';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

const Home = () => {
  const { user } = useAuth();
  const { showFeedback } = useFeedback();

  const handleQuickAction = (action) => {
    showFeedback(`Action triggered: ${action}`, 'success');
    // Will be replaced with actual Python backend call later
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome, {user?.displayName || user?.email}</h2>
        <p className="text-gray-600">
          HandsFree OS is ready to help you navigate your computer with gestures. 
          Start by training your gestures or use the quick actions below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GestureStatus />
        </div>
        <div>
          <QuickActions onAction={handleQuickAction} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Home;
import React from 'react';
import { useGestureHistory } from '../services/gestureHistory';

const RecentActivity = () => {
  const { history, loading } = useGestureHistory();

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity yet</p>
      ) : (
        <div className="space-y-3">
          {history.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
              <div className={`p-2 rounded-full mr-3 ${getActivityColor(item.type)}`}>
                <span className="material-icons-outlined text-white">{getActivityIcon(item.type)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.action}</p>
                <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getActivityColor = (type) => {
  switch(type) {
    case 'gesture': return 'bg-blue-500';
    case 'command': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getActivityIcon = (type) => {
  switch(type) {
    case 'gesture': return 'gesture';
    case 'command': return 'keyboard';
    case 'error': return 'error';
    default: return 'info';
  }
};

export default RecentActivity;
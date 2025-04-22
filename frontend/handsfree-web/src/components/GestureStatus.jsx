import React from 'react';
import { useGestureSettings } from '../services/gestureSettings';

const GestureStatus = () => {
  const { gestureSettings } = useGestureSettings();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Gesture Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Webcam Access</span>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Connected
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Gesture Service</span>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending Connection
          </span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Configured Gestures</h4>
          <div className="grid grid-cols-2 gap-2">
            {gestureSettings?.gestures?.map((gesture) => (
              <div key={gesture.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="material-icons-outlined text-blue-500">{gesture.icon}</span>
                <span className="text-sm text-gray-700">{gesture.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureStatus;
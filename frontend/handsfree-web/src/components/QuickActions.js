import React from 'react';
import { useGestureSettings } from '../services/gestureSettings';

const QuickActions = ({ onAction }) => {
  const { gestureSettings } = useGestureSettings();
  
  const defaultActions = [
    { id: 'open_browser', name: 'Open Browser', icon: 'public', color: 'bg-blue-100 text-blue-800' },
    { id: 'open_notepad', name: 'Open Notepad', icon: 'notes', color: 'bg-green-100 text-green-800' },
    { id: 'play_pause', name: 'Play/Pause Media', icon: 'play_arrow', color: 'bg-purple-100 text-purple-800' },
    { id: 'volume_up', name: 'Volume Up', icon: 'volume_up', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'volume_down', name: 'Volume Down', icon: 'volume_down', color: 'bg-red-100 text-red-800' },
    { id: 'scroll_up', name: 'Scroll Up', icon: 'arrow_upward', color: 'bg-indigo-100 text-indigo-800' },
  ];

  const actions = gestureSettings?.quickActions || defaultActions;

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all hover:shadow-md ${action.color}`}
          >
            <span className="material-icons-outlined text-2xl mb-1">{action.icon}</span>
            <span className="text-sm font-medium">{action.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:underline">
          Customize Actions
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
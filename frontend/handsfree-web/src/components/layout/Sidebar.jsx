import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../services/auth';

const Sidebar = () => {
  const { user } = useAuth();
  
  const navItems = [
    { path: '/', icon: 'home', label: 'Dashboard' },
    { path: '/training', icon: 'gesture', label: 'Gesture Training' },
    { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">HandsFree OS</h1>
        {user && (
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {user.displayName || user.email}
          </p>
        )}
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                <span className="material-icons-outlined mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
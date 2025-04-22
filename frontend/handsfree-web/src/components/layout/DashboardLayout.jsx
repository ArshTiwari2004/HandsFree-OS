import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FeedbackProvider from '../../services/feedback';

const DashboardLayout = () => {
  return (
    <FeedbackProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </FeedbackProvider>
  );
};

export default DashboardLayout;
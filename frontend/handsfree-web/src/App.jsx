import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/auth';
import { FirebaseAppProvider } from 'reactfire';
import Home from './pages/Home';
import Training from './pages/Training';
// import Analytics from './pages/Analytics';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import { FeedbackProvider } from './services/feedback';
import { GestureSettingsProvider } from './services/gestureSettings';
import { GestureHistoryProvider } from './services/gestureHistory';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ2fZuMn-6O1GKXiJ8-vg17qLpPvOcgO8",
  authDomain: "handsfree-os.firebaseapp.com",
  projectId: "handsfree-os",
  storageBucket: "handsfree-os.firebasestorage.app",
  messagingSenderId: "402930513336",
  appId: "1:402930513336:web:d0773d32f670525a1e8b4d",
  measurementId: "G-M131PNB992"
};

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <AuthProvider>
        <FeedbackProvider>
        <GestureSettingsProvider>
        <GestureHistoryProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<DashboardLayout />}>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/training" element={
                <ProtectedRoute>
                  <Training />
                </ProtectedRoute>
              } />
              {/* <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } /> */}
            </Route>
          </Routes>
        </Router>
        </GestureHistoryProvider>
        </GestureSettingsProvider>
        </FeedbackProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

export default App;
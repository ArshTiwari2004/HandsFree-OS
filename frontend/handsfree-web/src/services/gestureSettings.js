import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './auth';

const GestureSettingsContext = createContext();

export function GestureSettingsProvider({ children }) {
  const { user } = useAuth();
  const [gestureSettings, setGestureSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setGestureSettings(doc.data().gestureSettings || { gestures: [] });
      } else {
        setGestureSettings({ gestures: [] });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <GestureSettingsContext.Provider value={{ gestureSettings, loading }}>
      {children}
    </GestureSettingsContext.Provider>
  );
}

export const useGestureSettings = () => {
  return useContext(GestureSettingsContext);
};
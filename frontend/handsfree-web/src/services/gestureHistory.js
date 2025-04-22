import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from './auth';

const GestureHistoryContext = createContext();

export function GestureHistoryProvider({ children }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'activity'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setHistory(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <GestureHistoryContext.Provider value={{ history, loading }}>
      {children}
    </GestureHistoryContext.Provider>
  );
}

export const useGestureHistory = () => {
  return useContext(GestureHistoryContext);
};
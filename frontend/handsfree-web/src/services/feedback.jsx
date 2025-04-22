import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';

const FeedbackContext = createContext();

export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState(null);
  const [show, setShow] = useState(false);

  const showFeedback = (message, type = 'info') => {
    setFeedback({ message, type });
    setShow(true);
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <FeedbackContext.Provider value={{ showFeedback }}>
      {children}
      {show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 
          ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 
            feedback.type === 'success' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'}`}>
          <div className="flex items-center">
            <span className="material-icons-outlined mr-2">
              {feedback.type === 'error' ? 'error' : 
               feedback.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => {
  return useContext(FeedbackContext);
};
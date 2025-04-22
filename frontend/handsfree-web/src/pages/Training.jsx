import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../services/auth';
import { useFeedback } from '../services/feedback';
import Webcam from 'react-webcam';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

const Training = () => {
  const { user } = useAuth();
  const { showFeedback } = useFeedback();
  const webcamRef = useRef(null);
  const [gestureName, setGestureName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedAction, setSelectedAction] = useState('open_browser');

  const actions = [
    { value: 'open_browser', label: 'Open Browser' },
    { value: 'open_notepad', label: 'Open Notepad' },
    { value: 'play_pause', label: 'Play/Pause Media' },
    { value: 'volume_up', label: 'Volume Up' },
    { value: 'volume_down', label: 'Volume Down' },
    { value: 'scroll_up', label: 'Scroll Up' },
    { value: 'scroll_down', label: 'Scroll Down' },
  ];

  const startRecording = () => {
    if (!gestureName) {
      showFeedback('Please enter a gesture name', 'error');
      return;
    }
    setIsRecording(true);
    setCapturedFrames([]);
    setTrainingProgress(0);
    showFeedback(`Recording gesture: ${gestureName}`, 'info');
  };

  const stopRecording = () => {
    setIsRecording(false);
    showFeedback(`Finished recording ${capturedFrames.length} frames`, 'success');
  };

  const captureFrame = () => {
    if (webcamRef.current && isRecording && capturedFrames.length < 30) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedFrames(prev => [...prev, imageSrc]);
      setTrainingProgress((capturedFrames.length + 1) / 30 * 100);
    }
  };

  const saveGesture = async () => {
    if (capturedFrames.length < 10) {
      showFeedback('Please record at least 10 frames', 'error');
      return;
    }

    try {
      await addDoc(collection(db, 'gestures'), {
        userId: user.uid,
        name: gestureName,
        action: selectedAction,
        frames: capturedFrames,
        createdAt: serverTimestamp(),
      });
      showFeedback('Gesture saved successfully!', 'success');
      setGestureName('');
      setCapturedFrames([]);
    } catch (error) {
      showFeedback('Failed to save gesture', 'error');
      console.error('Error saving gesture:', error);
    }
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(captureFrame, 200);
    }
    return () => clearInterval(interval);
  }, [isRecording, capturedFrames]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Train New Gesture</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gesture Name</label>
              <input
                type="text"
                value={gestureName}
                onChange={(e) => setGestureName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="E.g., Thumbs Up"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {actions.map((action) => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Stop Recording
                </button>
              )}

              {capturedFrames.length > 0 && (
                <button
                  onClick={saveGesture}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Save Gesture
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="border rounded-md overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user' }}
                className="w-full"
              />
            </div>

            {isRecording && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Recording progress</span>
                  <span>{Math.round(trainingProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Perform your gesture in front of the camera. {30 - capturedFrames.length} frames remaining.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {capturedFrames.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Captured Frames</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {capturedFrames.map((frame, index) => (
              <div key={index} className="border rounded overflow-hidden">
                <img src={frame} alt={`Frame ${index + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
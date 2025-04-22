import React, { useEffect, useRef } from 'react';
import { useSocket } from '../services/socket';

const GestureVisualizer = () => {
  const { socket } = useSocket();
  const canvasRef = useRef(null);
  const [landmarks, setLandmarks] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleLandmarks = (data) => {
      setLandmarks(data);
      drawLandmarks(data);
    };

    socket.on('hand_landmarks', handleLandmarks);

    return () => {
      socket.off('hand_landmarks', handleLandmarks);
    };
  }, [socket]);

  const drawLandmarks = (landmarksData) => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarksData) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between landmarks
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    const connections = [
      [0, 1, 2, 3, 4],          // Thumb
      [0, 5, 6, 7, 8],          // Index finger
      [0, 9, 10, 11, 12],       // Middle finger
      [0, 13, 14, 15, 16],      // Ring finger
      [0, 17, 18, 19, 20],      // Pinky
      [5, 9, 13, 17, 0],        // Palm
    ];

    connections.forEach(connection => {
      ctx.beginPath();
      connection.forEach((pointIdx, idx) => {
        const point = landmarksData[pointIdx];
        if (point) {
          const x = point.x * canvas.width;
          const y = point.y * canvas.height;
          if (idx === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    });

    // Draw landmarks
    ctx.fillStyle = '#FF0000';
    landmarksData.forEach(point => {
      if (point) {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full h-auto"
      />
      {landmarks && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          Detected {landmarks.filter(Boolean).length}/21 landmarks
        </div>
      )}
    </div>
  );
};

export default GestureVisualizer;
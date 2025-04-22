import cv2
import mediapipe as mp
import pyautogui
import numpy as np
from pythonosc import udp_client
import socketio
import time
import logging
from utils.config import load_config
from utils.logger import setup_logging
from hand_landmarks.detector import HandDetector
from hand_landmarks.processor import LandmarkProcessor
from actions.mouse import MouseController
from actions.keyboard import KeyboardController
from actions.commands import SystemCommandExecutor

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

class HandsFreeOS:
    def __init__(self):
        self.config = load_config()
        self.running = False
        self.last_gesture_time = 0
        
        # Initialize components
        self.detector = HandDetector()
        self.processor = LandmarkProcessor()
        self.mouse = MouseController()
        self.keyboard = KeyboardController()
        self.command_executor = SystemCommandExecutor()
        
        # Socket.IO server for frontend communication
        self.sio = socketio.Server(cors_allowed_origins='*')
        self.app = socketio.WSGIApp(self.sio)
        
        # OSC client for additional integrations (optional)
        self.osc_client = udp_client.SimpleUDPClient(
            self.config['osc']['host'], 
            self.config['osc']['port'])
        
        self.setup_event_handlers()
    
    def setup_event_handlers(self):
        @self.sio.on('connect')
        def handle_connect(sid, environ):
            logger.info(f"Client connected: {sid}")
            self.sio.emit('status', {'message': 'HandsFree OS connected'})
        
        @self.sio.on('get_gestures')
        def handle_get_gestures(sid):
            # Return configured gestures from database
            pass
        
        @self.sio.on('execute_command')
        def handle_execute_command(sid, command):
            self.execute_command(command)
    
    def execute_command(self, command):
        try:
            if command['type'] == 'mouse':
                self.mouse.execute(command)
            elif command['type'] == 'keyboard':
                self.keyboard.execute(command)
            elif command['type'] == 'system':
                self.command_executor.execute(command)
            
            logger.info(f"Executed command: {command['action']}")
            self.sio.emit('command_executed', command)
        except Exception as e:
            logger.error(f"Command execution failed: {str(e)}")
            self.sio.emit('command_error', {'error': str(e)})
    
    def process_frame(self, frame):
        # Detect hands
        results = self.detector.detect(frame)
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Process landmarks
                processed = self.processor.process(hand_landmarks)
                
                # Send landmarks to frontend
                self.sio.emit('hand_landmarks', processed)
                
                # Recognize gesture
                gesture = self.processor.recognize_gesture(processed)
                
                if gesture and (time.time() - self.last_gesture_time) > 1.0:
                    self.last_gesture_time = time.time()
                    self.execute_command(gesture['command'])
                    self.sio.emit('gesture_detected', gesture)
        
        return results
    
    def start(self):
        self.running = True
        logger.info("Starting HandsFree OS service")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            logger.error("Cannot open webcam")
            return
        
        try:
            while self.running:
                ret, frame = cap.read()
                if not ret:
                    logger.warning("Can't receive frame. Exiting...")
                    break
                
                # Process frame
                results = self.process_frame(frame)
                
                # Display the frame (for debugging)
                if self.config['debug']['show_video']:
                    self.detector.draw_landmarks(frame, results)
                    cv2.imshow('HandsFree OS', frame)
                    if cv2.waitKey(1) == ord('q'):
                        break
                
        except KeyboardInterrupt:
            logger.info("Shutting down gracefully...")
        finally:
            cap.release()
            cv2.destroyAllWindows()
            logger.info("HandsFree OS service stopped")

if __name__ == "__main__":
    hfos = HandsFreeOS()
    hfos.start()
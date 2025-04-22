import numpy as np
import logging
from utils.config import load_config

logger = logging.getLogger(__name__)

class LandmarkProcessor:
    def __init__(self):
        self.config = load_config()
        self.gesture_threshold = self.config['gesture_recognition']['confidence_threshold']
    
    def process(self, landmarks):
        """Convert landmarks to normalized coordinates and extract features"""
        processed = []
        
        # Convert landmarks to relative coordinates
        base_x = landmarks.landmark[0].x
        base_y = landmarks.landmark[0].y
        base_z = landmarks.landmark[0].z
        
        for idx, landmark in enumerate(landmarks.landmark):
            processed.append({
                'id': idx,
                'x': landmark.x - base_x,
                'y': landmark.y - base_y,
                'z': landmark.z - base_z,
                'visibility': landmark.visibility
            })
        
        return processed
    
    def recognize_gesture(self, landmarks):
        """Recognize gesture from processed landmarks"""
        # This is a simplified version - in practice you would:
        # 1. Calculate angles between key points
        # 2. Compare with trained gesture database
        # 3. Return the best match if confidence > threshold
        
        # Example: Detect open palm (all fingers extended)
        extended_fingers = self.count_extended_fingers(landmarks)
        
        if extended_fingers == 5:
            return {
                'name': 'open_palm',
                'confidence': 0.95,
                'command': {
                    'type': 'system',
                    'action': 'show_desktop',
                    'params': {}
                }
            }
        
        # Add more gesture recognition logic here
        return None
    
    def count_extended_fingers(self, landmarks):
        """Count how many fingers are extended"""
        # Simplified finger extension detection
        tip_ids = [4, 8, 12, 16, 20]  # Finger tip landmarks
        extended = 0
        
        # Check thumb (different logic)
        if landmarks[4]['x'] > landmarks[2]['x']:
            extended += 1
        
        # Check other fingers
        for i in range(1, 5):
            if landmarks[tip_ids[i]]['y'] < landmarks[tip_ids[i] - 2]['y']:
                extended += 1
        
        return extended
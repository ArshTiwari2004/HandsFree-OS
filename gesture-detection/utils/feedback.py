import pyttsx3
import logging
from typing import Optional
from utils.config import load_config

logger = logging.getLogger(__name__)

class VoiceFeedback:
    def __init__(self):
        self.config = load_config().get('feedback', {})
        self.engine = None
        self.enabled = self.config.get('voice_feedback', True)
        
        if self.enabled:
            try:
                self.engine = pyttsx3.init()
                self.engine.setProperty('rate', self.config.get('speech_rate', 150))
                self.engine.setProperty('volume', self.config.get('speech_volume', 0.8))
                logger.info("Voice feedback engine initialized")
            except Exception as e:
                logger.error(f"Failed to initialize voice feedback: {str(e)}")
                self.enabled = False
    
    def speak(self, text: str) -> bool:
        if not self.enabled or not self.engine:
            return False
        
        try:
            self.engine.say(text)
            self.engine.runAndWait()
            return True
        except Exception as e:
            logger.error(f"Voice feedback failed: {str(e)}")
            return False
    
    def __del__(self):
        if self.engine:
            self.engine.stop()

class VisualFeedback:
    def __init__(self):
        self.config = load_config().get('feedback', {})
        self.enabled = self.config.get('visual_feedback', True)
    
    def show(self, text: str, duration: Optional[float] = None) -> bool:
        if not self.enabled:
            return False
        
        try:
            if duration is None:
                duration = self.config.get('visual_feedback_duration', 2.0)
            
            # This could be enhanced with a proper GUI notification
            print(f"FEEDBACK: {text}")
            return True
        except Exception as e:
            logger.error(f"Visual feedback failed: {str(e)}")
            return False
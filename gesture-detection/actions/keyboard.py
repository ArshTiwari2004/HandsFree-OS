import pyautogui
import logging
import time
from utils.config import load_config

logger = logging.getLogger(__name__)

class KeyboardController:
    def __init__(self):
        self.config = load_config()['keyboard']
        self.last_press_time = 0
        self.press_delay = self.config['press_delay']
        
        # Prevent key spamming
        self.key_states = {}
    
    def execute(self, command):
        action = command['action']
        params = command.get('params', {})
        
        try:
            if action == 'press':
                self._press(params)
            elif action == 'type':
                self._type(params)
            elif action == 'hotkey':
                self._hotkey(params)
            else:
                logger.warning(f"Unknown keyboard action: {action}")
        except Exception as e:
            logger.error(f"Keyboard action failed: {str(e)}")
            raise
    
    def _press(self, params):
        keys = params.get('keys', [])
        now = time.time()
        
        # Check if any of the keys are in cooldown
        if any(self.key_states.get(key, 0) > now - self.press_delay for key in keys):
            return
            
        if isinstance(keys, str):
            keys = [keys]
        
        for key in keys:
            pyautogui.keyDown(key)
            time.sleep(0.05)
            pyautogui.keyUp(key)
            self.key_states[key] = now
    
    def _type(self, params):
        text = params.get('text', '')
        interval = params.get('interval', 0.1)
        
        pyautogui.typewrite(text, interval=interval)
    
    def _hotkey(self, params):
        keys = params.get('keys', [])
        now = time.time()
        
        # Check if any of the keys are in cooldown
        if any(self.key_states.get(key, 0) > now - self.press_delay for key in keys):
            return
            
        if len(keys) == 0:
            return
            
        pyautogui.hotkey(*keys)
        
        # Update cooldown for all keys
        for key in keys:
            self.key_states[key] = now
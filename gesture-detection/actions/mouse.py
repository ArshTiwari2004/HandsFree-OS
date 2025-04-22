import pyautogui
import logging
import time
from math import sqrt
from utils.config import load_config

logger = logging.getLogger(__name__)

class MouseController:
    def __init__(self):
        self.config = load_config()['mouse']
        self.screen_width, self.screen_height = pyautogui.size()
        self.last_position = None
        self.last_click_time = 0
        self.click_delay = self.config['click_delay']
        
        # Smoothing variables
        self.smoothing_factor = self.config['smoothing_factor']
        self.prev_x = None
        self.prev_y = None
        
        pyautogui.FAILSAFE = False
        pyautogui.PAUSE = 0.01
    
    def execute(self, command):
        action = command['action']
        params = command.get('params', {})
        
        try:
            if action == 'move':
                self._move(params)
            elif action == 'click':
                self._click(params)
            elif action == 'double_click':
                self._double_click(params)
            elif action == 'right_click':
                self._right_click(params)
            elif action == 'drag':
                self._drag(params)
            elif action == 'scroll':
                self._scroll(params)
            else:
                logger.warning(f"Unknown mouse action: {action}")
        except Exception as e:
            logger.error(f"Mouse action failed: {str(e)}")
            raise
    
    def _move(self, params):
        x = params.get('x', 0)
        y = params.get('y', 0)
        relative = params.get('relative', True)
        
        if relative:
            # Convert from normalized coordinates to screen coordinates
            target_x = x * self.screen_width
            target_y = y * self.screen_height
            
            # Apply smoothing
            if self.prev_x is not None and self.prev_y is not None:
                target_x = self.prev_x * (1 - self.smoothing_factor) + target_x * self.smoothing_factor
                target_y = self.prev_y * (1 - self.smoothing_factor) + target_y * self.smoothing_factor
            
            pyautogui.moveTo(target_x, target_y)
            self.prev_x = target_x
            self.prev_y = target_y
        else:
            pyautogui.moveTo(x, y)
    
    def _click(self, params):
        # Prevent click spamming
        if time.time() - self.last_click_time < self.click_delay:
            return
            
        button = params.get('button', 'left')
        x = params.get('x', None)
        y = params.get('y', None)
        
        if x is not None and y is not None:
            self._move({'x': x, 'y': y, 'relative': False})
        
        pyautogui.click(button=button)
        self.last_click_time = time.time()
    
    def _double_click(self, params):
        button = params.get('button', 'left')
        x = params.get('x', None)
        y = params.get('y', None)
        
        if x is not None and y is not None:
            self._move({'x': x, 'y': y, 'relative': False})
        
        pyautogui.doubleClick(button=button)
        self.last_click_time = time.time()
    
    def _right_click(self, params):
        self._click({'button': 'right', **params})
    
    def _drag(self, params):
        x = params.get('x', 0)
        y = params.get('y', 0)
        button = params.get('button', 'left')
        relative = params.get('relative', True)
        
        if relative:
            x = x * self.screen_width
            y = y * self.screen_height
        
        pyautogui.dragTo(x, y, button=button)
    
    def _scroll(self, params):
        clicks = params.get('clicks', 1)
        direction = params.get('direction', 'up')
        
        if direction == 'down':
            clicks = -clicks
        
        pyautogui.scroll(clicks)
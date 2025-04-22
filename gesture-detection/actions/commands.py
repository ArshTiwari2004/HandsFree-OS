import os
import subprocess
import logging
import pyautogui
from utils.config import load_config

logger = logging.getLogger(__name__)

class SystemCommandExecutor:
    def __init__(self):
        self.config = load_config()['system_commands']
        self.app_paths = self.config.get('app_paths', {})
    
    def execute(self, command):
        action = command['action']
        params = command.get('params', {})
        
        try:
            if action == 'open_app':
                self._open_app(params)
            elif action == 'close_app':
                self._close_app(params)
            elif action == 'show_desktop':
                self._show_desktop()
            elif action == 'switch_window':
                self._switch_window(params)
            elif action == 'volume_up':
                self._volume_up(params)
            elif action == 'volume_down':
                self._volume_down(params)
            elif action == 'play_pause':
                self._play_pause()
            elif action == 'next_track':
                self._next_track()
            elif action == 'prev_track':
                self._prev_track()
            else:
                logger.warning(f"Unknown system command: {action}")
        except Exception as e:
            logger.error(f"System command failed: {str(e)}")
            raise
    
    def _open_app(self, params):
        app_name = params.get('app_name', '')
        
        if not app_name:
            return
            
        # Check if we have a specific path for this app
        app_path = self.app_paths.get(app_name.lower(), app_name)
        
        try:
            if os.name == 'nt':  # Windows
                os.startfile(app_path)
            elif os.name == 'posix':  # macOS/Linux
                subprocess.Popen([app_path])
        except Exception as e:
            # Fallback to using the name directly
            pyautogui.hotkey('winleft')
            pyautogui.typewrite(app_name)
            pyautogui.press('enter')
    
    def _close_app(self, params):
        pyautogui.hotkey('alt', 'f4')
    
    def _show_desktop(self):
        pyautogui.hotkey('winleft', 'd')
    
    def _switch_window(self, params):
        direction = params.get('direction', 'next')
        
        if direction == 'next':
            pyautogui.hotkey('alt', 'tab')
        else:
            pyautogui.hotkey('alt', 'shift', 'tab')
    
    def _volume_up(self, params):
        steps = params.get('steps', 1)
        for _ in range(steps):
            pyautogui.press('volumeup')
    
    def _volume_down(self, params):
        steps = params.get('steps', 1)
        for _ in range(steps):
            pyautogui.press('volumedown')
    
    def _play_pause(self):
        pyautogui.press('playpause')
    
    def _next_track(self):
        pyautogui.press('nexttrack')
    
    def _prev_track(self):
        pyautogui.press('prevtrack')
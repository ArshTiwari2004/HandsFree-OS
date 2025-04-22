import os
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

DEFAULT_CONFIG = {
    "debug": {
        "show_video": False,
        "log_level": "INFO"
    },
    "osc": {
        "host": "127.0.0.1",
        "port": 9000
    },
    "mouse": {
        "smoothing_factor": 0.5,
        "click_delay": 0.3,
        "scroll_sensitivity": 1.0
    },
    "keyboard": {
        "press_delay": 0.2,
        "type_interval": 0.1
    },
    "system_commands": {
        "app_paths": {
            "chrome": "/Applications/Google Chrome.app",
            "notepad": "notepad.exe"
        }
    },
    "gesture_recognition": {
        "confidence_threshold": 0.8,
        "min_gesture_duration": 0.5
    }
}

def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration from file or use defaults"""
    if not config_path:
        config_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'config.json'
        )
    
    try:
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
                logger.info(f"Loaded configuration from {config_path}")
                return _merge_configs(DEFAULT_CONFIG, config)
    except Exception as e:
        logger.warning(f"Failed to load config file: {str(e)}. Using defaults.")
    
    logger.info("Using default configuration")
    return DEFAULT_CONFIG

def _merge_configs(default: Dict[str, Any], custom: Dict[str, Any]) -> Dict[str, Any]:
    """Deep merge two configurations"""
    merged = default.copy()
    for key, value in custom.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = _merge_configs(merged[key], value)
        else:
            merged[key] = value
    return merged

def save_config(config: Dict[str, Any], config_path: str = None) -> bool:
    """Save configuration to file"""
    if not config_path:
        config_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            'config.json'
        )
    
    try:
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=4)
        logger.info(f"Configuration saved to {config_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to save configuration: {str(e)}")
        return False
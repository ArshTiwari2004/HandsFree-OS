import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path
from datetime import datetime

def setup_logging():
    """Configure logging system"""
    # Create logs directory if it doesn't exist
    log_dir = Path(__file__).parent.parent.parent / 'logs'
    log_dir.mkdir(exist_ok=True)
    
    # Create a log filename with timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    log_file = log_dir / f'handsfree_{timestamp}.log'
    
    # Main logger configuration
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            RotatingFileHandler(
                log_file,
                maxBytes=5*1024*1024,  # 5MB
                backupCount=3
            ),
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set log level for specific noisy modules
    logging.getLogger('socketio').setLevel(logging.WARNING)
    logging.getLogger('engineio').setLevel(logging.WARNING)
    logging.getLogger('urllib3').setLevel(logging.WARNING)
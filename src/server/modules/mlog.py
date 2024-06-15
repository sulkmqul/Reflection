import sys
from logging import getLogger, StreamHandler, handlers, Formatter
from refconfig import settings

def get_log():
    """
    ログの取得
    """
    return getLogger(settings.LOG_CLASS_NAME)




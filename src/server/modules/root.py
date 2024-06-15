import sys
from logging import getLogger, StreamHandler, handlers, Formatter
from modules import mlog
import db.db_init

#ログ
log = mlog.get_log()

def initialize():
    """
    初期化および終了処理
    """

    #DBの初期化を行う
    db.db_init.init_db()
    
    pass


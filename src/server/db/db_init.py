from db import dbmana, ms_user, rf_list
from modules import mlog

log = mlog.get_log()

#----------------------------------------------------------------------------
def init_db():
    """
    SqliteDBの初期化
    """

    #初期化チェック    
    if dbmana.check_db_initialize() is True:
        log.debug("db file already initialized")
        return

    log.info("initialie database start")
    with dbmana.DbManager() as mana:
        try:            
            cur = mana.begin_transaction()

            #初期テーブルとデータの作成
            ms_user.create_template(cur)
            rf_list.create_template(cur)

            mana.commit()
        except:
            mana.rollback()
            raise Exception("database init failed")       
        
    log.info("initialie database end") 
    pass
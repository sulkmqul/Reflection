from modules import mlog
from modules import util
import functools
import sqlite3
import refconfig
import os
log = mlog.get_log()


#-----------------------------------------------------------------------------------------
def check_db_initialize() -> bool:
    """
    DBの初期化を確認する

    DBファイルの存在をもって初期化済みとみなす
    本来なら中身の主要テーブルの可否までチェックするのが望ましいが・・・
    """
    return os.path.exists(refconfig.settings.DB_SRC)
    

#-----------------------------------------------------------------------------------------
class DbManager:
    """
    DB管理
    """

    def __init__(self) -> None:
        """"
        
        """
        
        pass

    #DB接続
    _cone:sqlite3.Connection = None
    #------------------------------------------------------------------------
    def __enter__(self):
        self.connect()
        return self
    #------------------------------------------------------------------------
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
        pass    
    #------------------------------------------------------------------------
    def connect(self):
        """
        DBへの接続
        """
        if self._cone is not None:
            return

        self._cone = sqlite3.connect(refconfig.settings.DB_SRC, isolation_level="DEFERRED")        
        pass
    #------------------------------------------------------------------------
    def close(self):
        """
        DB接続解除
        """
        if self._cone is None:
            return
        
        self._cone.close()
        self._cone = None
        pass
    #------------------------------------------------------------------------
    def begin_transaction(self) -> sqlite3.Cursor:
        """
        transactionの開始
        """
        cur = self._cone.cursor()
        cur.execute("BEGIN TRANSACTION;")
        return cur
    #------------------------------------------------------------------------
    def commit(self):
        """
        transactionのコミット
        """
        self._cone.commit()
    #------------------------------------------------------------------------
    def rollback(self):
        """
        transactionの巻き戻し
        """
        self._cone.rollback()




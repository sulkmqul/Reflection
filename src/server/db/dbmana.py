from dataclasses import dataclass
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
    ひとまずDBファイルの存在と環境変数によって初期化とみなす
    return:True=初期化済み
    """

    exiret = os.path.exists(refconfig.settings.DB_SRC)
    if exiret is True:
        return True
    
    return False
    

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
    #カーソル
    _cur:sqlite3.Cursor = None
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
        self._cur = None
        pass
    #------------------------------------------------------------------------
    def begin_transaction(self) -> sqlite3.Cursor:
        """
        transactionの開始
        """
        self._cur = self._cone.cursor()
        self._cur.execute("BEGIN TRANSACTION;")        
        return self._cur
    #------------------------------------------------------------------------
    def commit(self):
        """
        transactionのコミット
        """
        self._cone.commit()
        self._cur = None
    #------------------------------------------------------------------------
    def rollback(self):
        """
        transactionの巻き戻し
        """
        self._cone.rollback()
        self._cur = None
    #------------------------------------------------------------------------
    def fetchall(self, sql:str, param:any = ()) -> list[any]:
        """
        一括取得
        sql:実行SQL
        param:パラメータ
        """
        cur = self._cone.cursor()
        cur.execute(sql, param)
        return cur.fetchall()
    #------------------------------------------------------------------------
    def fetchone(self, sql:str, param:any = ()) -> any:
        """
        一つ取得
        sql:実行SQL
        param:パラメータ
        """
        cur = self._cone.cursor()
        cur.execute(sql, param)
        return cur.fetchone()
    #------------------------------------------------------------------------
    def insert(self, sql:str, param:any = ()) -> int:
        """
        データ挿入
        sql:実行SQL
        param:パラメータ
        return:挿入ID
        """
        if self._cur is None:
            raise Exception("transaction function is not called")
        
        cur = self._cur
        cur.execute(sql, param)
        return cur.lastrowid
    #------------------------------------------------------------------------
    def execute(self, sql:str, param:any = ()):
        """
        SQL実行処理
        sql:実行SQL
        param:パラメータ
        """
        if self._cur is None:
            raise Exception("transaction function is not called")
        
        cur = self._cur
        cur.execute(sql, param)
        



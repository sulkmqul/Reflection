from dataclasses import dataclass
import sqlite3
from db.dbmana import DbManager
from db.ms_list_info_columns import MsListInfoColumns
"""
管理リスト追記情報
rf_listテーブルとは1:1の関係で同じIDを利用
カラムはユーザーが自動追記できる
"""


#------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------
def add_columns_list(addlist:list[MsListInfoColumns]):
    """
    カラム追記処理
    addlist:追加するカラム追記情報一式
    """    
    with DbManager() as mana:                
        try:
            cur = mana.begin_transaction()
            for data in addlist:
                add_table_colmns(cur, data)
            mana.commit()
        except:
            mana.rollback()        
    pass
#------------------------------------------------------------------------------------
def add_table_colmns(mana:DbManager, col:MsListInfoColumns):
    """
    カラムの追加処理
    mana:db管理
    col:追加カラム情報
    """    
    sql = f"ALTER TABLE rf_list_info ADD COLUMN {col.column_name} {col.column_type} "
    if col.notnull_flag == 1:
        sql += f" NOT NULL DEFAULT {col.default_value}"
        pass
    
    mana.execute(sql)
    pass

#------------------------------------------------------------------------------------
def create_template(cur:sqlite3.Cursor):
    """
    DBテーブルテンプレートの作成
    """
    
    sql_create = """
CREATE TABLE IF NOT EXISTS rf_list_info ( 
rf_list_id INTEGER NOT NULL PRIMARY KEY
);
"""

    cur.execute(sql_create);

    pass

#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------
def _remove_table_colmns(mana:DbManager, col:MsListInfoColumns):
    """
    カラムの削除処理(基本的に使用しない)
    cur:カーソル
    col:削除カラム情報
    """
    
    sql = f"ALTER TABLE rf_list_info DROP COLUMN {col.column_name}"
    #実行
    mana.execute(sql)
    pass
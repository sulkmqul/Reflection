from dataclasses import dataclass
import sqlite3
from db.dbmana import DbManager, BaseReflectionTable

"""
管理リスト
"""
@dataclass
class RfList(BaseReflectionTable):
    """
    ファイル情報
    """
    #ID
    rf_list_id: int = 0
    filename: str = ""
    #追記情報
    info = {}
    pass

# class


#------------------------------------------------------------------------------------
def create_template(cur:sqlite3.Cursor):
    """
    DBテーブルテンプレートの作成
    """
    
    sql_create = """
CREATE TABLE IF NOT EXISTS rf_list ( 
rf_list_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
filename TEXT NOT NULL,
path_location TEXT NOT NULL,

delete_flag INTEGER NOT NULL  DEFAULT 0,
create_user_id INTEGER NOT NULL,
create_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
update_user_id INTEGER NOT NULL,
updated_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
"""

    sql_trigger = """
CREATE TRIGGER IF NOT EXISTS trigger_rf_list_updated_date AFTER UPDATE ON rf_list
BEGIN
    UPDATE rf_list SET updated_date = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;
"""

    cur.execute(sql_create)
    cur.execute(sql_trigger)

    pass
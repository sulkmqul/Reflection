from dataclasses import dataclass, field
import sqlite3
from db.dbmana import DbManager
from db import ms_list_info_columns
from db.ms_list_info_columns import MsListInfoColumns, MsListInfoColumnsEdit
from typing import Dict
from pydantic import BaseModel, Field

@dataclass
class RfListView:
    #ID
    rf_list_id: int = 0
    #ファイル名
    filename: str = ""
    #関連ID
    related_rf_list_id:int = None

    #追記情報{dispname:value}
    info:Dict[str, any] = field(default_factory=dict)

    update_user_name:str = ""    
    update_date:str = ""
    pass

@dataclass
class RfListDataEdit(RfListView):
    #パス情報
    path_location: str = ""
    pass



#------------------------------------------------------------------------------------

#------------------------------------------------------------------------------------
def insert_record(mana:DbManager, data:RfListDataEdit, userid:int) -> int:
    """
    挿入
    mana:DB管理
    data:挿入物
    userid:挿入者
    """

    sql = """
INSERT INTO rf_list (
filename,
path_location,
related_rf_list_id,

delete_flag,
create_user_id,
update_user_id
) VALUES (
?, ?, ?,
?, ?, ?
);
"""


    uid = mana.insert(sql, (data.filename, data.path_location, data.related_rf_list_id,
                      0, userid, userid))
    return uid

    pass


#------------------------------------------------------------------------------------
def update_record(mana:DbManager, data:RfListDataEdit, userid:int):
    """
    更新
    mana:DB管理
    data:更新データ
    userid:更新ユーザー
    """

    sql = """
UPDATE rf_list SET 
filename = ?,
path_location = ?,
related_rf_list_id = ?,

update_user_id = ?
WHERE 
rf_list_id = ?
"""
    mana.update(sql, (data.filename, data.path_location, data.related_rf_list_id,
                        userid, data.rf_list_id))
    pass


#------------------------------------------------------------------------------------
def delete_record(mana:DbManager, data:RfListDataEdit, userid:int):
    """
    削除
    mana:DB管理
    data:削除データ
    userid:削除ユーザー
    """

    sql = """
UPDATE rf_list SET 
delete_flag = ?,
update_user_id = ?
WHERE 
rf_list_id = ?
"""
    mana.update(sql, (1, userid, data.rf_list_id))
    pass

#------------------------------------------------------------------------------------
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
related_rf_list_id INTEGER DEFAULT NULL,

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

#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
def _create_info_sql(clist:list[MsListInfoColumns]) -> str:
    
    data = ["rf_list_info." + data.column_name for data in clist]
    return ", ".join(data)


from dataclasses import dataclass
import sqlite3
from db.dbmana import DbManager, BaseReflectionTable

@dataclass
class MsListInfoColumns(BaseReflectionTable):
    ms_list_info_columns_id: int = -1
    column_name: str = ""
    column_type: str = ""
    notnull_flag: int = 0
    default_value: str = ""
    sort_order: int = 0
    visible_flag: int = 0

    def check_db_id(self)-> bool:
        """
        IDが有効か否かを調べる
        return: True=有効 False=無効
        """
        if self.ms_list_info_columns_id <= 0:
            return False
        return True
    
    
    pass
#------------------------------------------------------------------------------------
def getrecords() -> list[MsListInfoColumns]:
    """
    全体取得
    """
    sql = """
SELECT 
ms_list_info_columns.ms_list_info_columns_id,
ms_list_info_columns.column_name,
ms_list_info_columns.column_type,
ms_list_info_columns.notnull_flag,
ms_list_info_columns.default_value,
ms_list_info_columns.sort_order,
ms_list_info_columns.visible_flag
FROM 
ms_list_info_columns
WHERE
ms_list_info_columns.delete_flag = 0
ORDER BY
ms_list_info_columns.sort_order
"""
    with DbManager() as mana:
        collist = mana.fetchall(sql)
        ans = [MsListInfoColumns(ms_list_info_columns_id=data[0], 
                                 column_name=data[1],
                                 column_type=data[2],
                                 notnull_flag=data[3],
                                 default_value=data[4],
                                 sort_order=data[5],
                                 visible_flag=data[6]
                                 ) for data in collist]

        return ans
    
    pass
#------------------------------------------------------------------------------------
def getrecords_visibled() -> list[MsListInfoColumns]:
    """
    表示物一覧取得
    """
    sql = """
SELECT 
ms_list_info_columns.ms_list_info_columns_id,
ms_list_info_columns.column_name,
ms_list_info_columns.column_type,
ms_list_info_columns.notnull_flag,
ms_list_info_columns.default_value,
ms_list_info_columns.sort_order,
ms_list_info_columns.visible_flag
FROM 
ms_list_info_columns
WHERE
ms_list_info_columns.delete_flag = 0 AND 
ms_list_info_columns.visible_flag = 1
ORDER BY
ms_list_info_columns.sort_order
"""
    pass

#------------------------------------------------------------------------------------
def insert_record(dbmana:DbManager, data:MsListInfoColumns, ms_user_id:int) -> int:
    """
    レコード挿入
    dbmana:Db接続
    data:挿入情報
    ms_user_id:挿入ユーザー
    """

    sql = """
INSERT INTO ms_list_info_columns
(
column_name,
column_type,
notnull_flag,
default_value,
sort_order,
visible_flag,
delete_flag,
create_user_id,
update_user_id
) VALUES (
?,
?,
?,
?,
?,
?,
?,
?,
?
);
"""
    return dbmana.insert(sql, (data.column_name, data.column_type, data.notnull_flag, data.default_value, data.sort_order, data.visible_flag,
                        0, ms_user_id, ms_user_id))

#------------------------------------------------------------------------------------
def update_record(dbmana:DbManager, data:MsListInfoColumns, ms_user_id:int) -> int:
    """
    レコード更新
    dbmana:Db接続
    data:挿入情報
    ms_user_id:更新ユーザー
    """

    sql = """
UPDATE ms_list_info_columns SET
column_name = ?,
column_type = ?,
notnull_flag = ?,
default_value = ?,
sort_order = ?,
visible_flag = ?,
delete_flag = ?,
update_user_id = ?
WHERE
ms_list_info_columns_id = ?
;
"""
    return dbmana.execute(sql, (data.column_name, data.column_type, data.notnull_flag, data.default_value, data.sort_order, data.visible_flag,
                        0, ms_user_id, data.ms_list_info_columns_id))
#------------------------------------------------------------------------------------
def delete_record(dbmana:DbManager, data:MsListInfoColumns, ms_user_id:int) -> int:
    """
    レコード削除
    dbmana:Db接続
    data:挿入情報
    ms_user_id:更新ユーザー
    """

    sql = """
UPDATE ms_list_info_columns SET
delete_flag = ?,
update_user_id = ?
WHERE
ms_list_info_columns_id = ?
;
"""
    return dbmana.execute(sql, (1, ms_user_id, data.ms_list_info_columns_id))

#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
def create_template(cur:sqlite3.Cursor):
    """
    ms_list_info_columnsのDBテンプレートの作成
    """

    sql_create = """
CREATE TABLE IF NOT EXISTS ms_list_info_columns ( 
ms_list_info_columns_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
column_name TEXT NOT NULL,
column_type TEXT NOT NULL,
notnull_flag INTEGER NOT NULL,
default_value TEXT NOT NULL,
sort_order INTEGER NOT NULL DEFAULT 1,
visible_flag INTEGER NOT NULL DEFAULT 1,

delete_flag INTEGER NOT NULL  DEFAULT 0,
create_user_id INTEGER NOT NULL,
create_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
update_user_id INTEGER NOT NULL,
updated_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
"""

    sql_trigger = """
CREATE TRIGGER IF NOT EXISTS trigger_ms_list_info_columns_updated_date AFTER UPDATE ON ms_list_info_columns
BEGIN
    UPDATE ms_list_info_columns SET updated_date = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;
"""

    # 実行
    cur.execute(sql_create);
    cur.execute(sql_trigger);

    pass

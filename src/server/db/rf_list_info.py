from dataclasses import dataclass
import sqlite3
from db.dbmana import DbManager
from db.ms_list_info_columns import MsListInfoColumns, MsListInfoColumnsEdit

"""
管理リスト追記情報
rf_listテーブルとは1:1の関係で同じIDを利用
カラムはユーザーが自動追記できる
"""


#------------------------------------------------------------------------------------
def insert_record(mana:DbManager, rf_list_id:int, data:dict, colist:list[MsListInfoColumnsEdit], userid:int) -> int:
    """
    挿入
    mana:DB管理
    rf_list_id:親ID
    data:挿入物
    userid:挿入者
    """

    sql = _create_insert_sql(colist=colist)    
    val = [data.get(co.display_name) for co in colist]
    print(sql, (rf_list_id, *val))
    id = mana.insert(sql, (rf_list_id, *val))    
    return id
#------------------------------------------------------------------------------------
def update_record(mana:DbManager, rf_list_id:int, data:dict, colist:list[MsListInfoColumnsEdit], userid:int):
    """
    更新
    mana:DB管理
    rf_list_id:親ID
    data:更新物
    userid:更新者
    """

    sql = _create_update_sql(colist=colist)

    val = [data.get(co.display_name) for co in colist]

    mana.execute(sql, (*val, rf_list_id))
    
    pass

#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
# カラム管理
#------------------------------------------------------------------------------------
def add_columns_list(addlist:list[MsListInfoColumnsEdit]):
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
def add_table_colmns(mana:DbManager, col:MsListInfoColumnsEdit):
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
def _remove_table_colmns(mana:DbManager, col:MsListInfoColumnsEdit):
    """
    カラムの削除処理(基本的に使用しない)
    cur:カーソル
    col:削除カラム情報
    """
    
    sql = f"ALTER TABLE rf_list_info DROP COLUMN {col.column_name}"
    #実行
    mana.execute(sql)
    pass

#------------------------------------------------------------------------------------
def _create_insert_sql(colist:list[MsListInfoColumnsEdit]) -> str:
    """
    挿入SQLの作成
    """

    cnamelist = [x.column_name for x in colist]
    inlist = ["?" for x in colist]    

    sql = f"""
INSERT INTO rf_list_info (
rf_list_id,
{", ".join(cnamelist)}
) VALUES (
?,
{",".join(inlist)}
);
"""
    return sql

#------------------------------------------------------------------------------------
def _create_update_sql(colist:list[MsListInfoColumnsEdit]) -> str:
    """
    更新SQLの作成
    """

    cnamelist = [f"{x.column_name} = ?" for x in colist]
     

    sql = f"""
UPDATE rf_list_info SET 
{", ".join(cnamelist)}
WHERE
rf_list_id = ?
"""
    return sql
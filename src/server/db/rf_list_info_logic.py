from db.dbmana import DbManager
from db.ms_list_info_columns import MsListInfoColumns
from db import rf_list_info, ms_list_info_columns
import sqlite3


def insert_update(dlist: list[MsListInfoColumns], user_id: int):
    """
    追加情報リスト挿入更新処理
    dlist:更新対象一式
    user_id:挿入更新者
    """
    with DbManager() as mana:
        try:
            mana.begin_transaction()

            for data in dlist:
                #print("data", data)
                if data.check_db_id() == False:
                    #挿入
                    _insert(mana, data, user_id)
                else:
                    #更新
                    _update(mana, data, user_id)
                    pass
                
                pass
            mana.commit()
            pass
        except Exception as ex:
            mana.rollback()
            raise Exception("list info update exception", ex)
            pass

        pass
    pass

def delete_col_info(dlist: list[MsListInfoColumns], user_id: int):
    """
    削除処理
    dlist:削除対象一式
    user_id:挿入更新者
    """
    with DbManager() as mana:
        try:
            mana.begin_transaction()

            for data in dlist:
                ms_list_info_columns.delete_record(mana, data, user_id)                
                pass
            mana.commit()
            pass
        except Exception as ex:
            mana.rollback()
            raise Exception("list info delete exception", ex)
            pass

        pass
    pass
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
def _insert(mana:DbManager, data:MsListInfoColumns, user_id: int) -> int:
    """
    挿入処理
    mana:DB管理
    data:挿入データ
    user_id:挿入者
    return:挿入ID
    """
    #MsListInfoColumnsへの挿入
    id = ms_list_info_columns.insert_record(mana, data, user_id)

    #list_infoテーブルへのカラム追加
    rf_list_info.add_table_colmns(mana, data)

    print("InsertID", id)
    return id

#------------------------------------------------------------------------------------
def _update(mana:DbManager, data:MsListInfoColumns, user_id:int):
    """
    更新処理
    mana:DB管理
    data:挿入データ
    user_id:更新者
    """
    if data.check_db_id() == False:
        return

    ms_list_info_columns.update_record(mana, data, user_id)
    pass


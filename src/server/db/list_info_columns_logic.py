from db.dbmana import DbManager
from db.ms_list_info_columns import MsListInfoColumns, MsListInfoColumnsEdit
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

    #カラム名の取得
    newcolname = _craete_new_colname(mana, data)
    
    insertdata = MsListInfoColumnsEdit(column_name=newcolname,
                                       display_name=data.display_name,
                                       column_type=data.column_type,
                                       sort_order=data.sort_order,
                                       default_value=data.default_value,
                                       visible_flag=data.visible_flag)
    
        
    #MsListInfoColumnsへの挿入
    id = ms_list_info_columns.insert_record(mana, insertdata, user_id)

    #list_infoテーブルへのカラム追加
    rf_list_info.add_table_colmns(mana, insertdata)

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



def _craete_new_colname(mana:DbManager, data:MsListInfoColumns) -> str:
    """
    新しいカラム名を取得する
    """

    #新しい値を取得
    no = ms_list_info_columns.get_max_pk(mana) + 1

    ans = "colname_{:08}".format(no)   
    return ans
from dataclasses import dataclass, field
from db import rf_list, rf_list_info, ms_list_info_columns
from db.dbmana import DbManager
from typing import List

@dataclass
class ManageData:
    colist: List[ms_list_info_columns.MsListInfoColumns] = field(default=list)
    datalist: List[rf_list.RfListView] = field(default=list)

#------------------------------------------------------------------------------------
def get_list(mana:DbManager) -> ManageData:
    """
    一覧取得
    """

    # 表示カラム情報取得
    colist = ms_list_info_columns.getrecords_visibled(mana)
    anslist = _getlist(mana, colist)    

    for col in colist:
        delattr(col, "column_name")

    ans = ManageData(colist=colist, datalist=anslist)
    return ans



#------------------------------------------------------------------------------------
def insert_record(mana:DbManager, data:rf_list.RfListView, path_location:str, userid:int) -> int:
    """
    挿入
    """
    
    colist = ms_list_info_columns.getrecords_visibled(mana)

    rid = rf_list.insert_record(mana, data, path_location, userid)
    rf_list_info.insert_record(mana, rid, data.info, colist, userid)

    return rid
#------------------------------------------------------------------------------------
def update_record(mana:DbManager, data:rf_list.RfListView, userid:int):
    """
    更新
    """
    
    colist = ms_list_info_columns.getrecords_visibled(mana)

    rf_list.update_record(mana, data, userid)
    rf_list_info.update_record(mana, data.rf_list_id, data.info, colist, userid)
    pass

#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
def _create_select_sql(colist:list[ms_list_info_columns.MsListInfoColumnsEdit]) -> str:
    """
    SELECT文の作成
    colist:カラム一式
    """

    # 任意selectを生成
    colvec = ["rf_list_info." + x.column_name for x in colist]
    
    # colistが空の時、下のjoinを走らせると上手いことsqlが作れないので、適当な要素を無理やり選択することで回避する。
    # colistが基準であるため、問題はない
    if colvec.__len__() <= 0:
        colvec = ["rf_list.rf_list_id"]


    sql = f"""
SELECT 
rf_list.rf_list_id,
rf_list.filename,
rf_list.file_size,
rf_list.related_rf_list_id,
ms_user.user_name,
rf_list.updated_date,
{", ".join(colvec)}
FROM rf_list 
INNER JOIN rf_list_info ON rf_list.rf_list_id == rf_list_info.rf_list_id
LEFT JOIN ms_user ON rf_list.update_user_id = ms_user.ms_user_id
WHERE
rf_list.delete_flag = 0
ORDER BY 
rf_list.updated_date DESC
"""
    return sql
#------------------------------------------------------------------------------------
def _analyze_fetch_data(data, colist:list[ms_list_info_columns.MsListInfoColumnsEdit]) -> rf_list.RfListView:
    """
    fetchリストの解析
    data:fetchデータ
    colist:カラム一式
    """
    ans = rf_list.RfListView(
        rf_list_id = data[0],
        filename = data[1],
        file_size = data[2],
        related_rf_list_id=data[3],
        update_user_name=data[4],
        update_date=data[5]
    )

    index = 6
    for co in colist:
        ans.info[co.display_name] = data[index]
        index += 1


    return ans
#------------------------------------------------------------------------------------
def _getlist(mana:DbManager, colist:list[ms_list_info_columns.MsListInfoColumnsEdit]) -> list[rf_list.RfListView]:
    """
    filelistで表示する一覧の取得処理
    mana:DB管理
    colist:追記カラム
    """
    
    #SQLの作成と取得
    sql = _create_select_sql(colist)    
    datalist = mana.fetchall(sql)

    #値を解析し、データを作成する    
    anslist =[_analyze_fetch_data(x, colist) for x in datalist]        
    
    return anslist


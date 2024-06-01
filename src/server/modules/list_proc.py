from db.dbmana import DbManager
from db import rf_list_info, rf_list
import os
import datetime
import refconfig

"""
管理リストの処理
"""
#-----------------------------------------------------------------------------------------
def get_select_fullpath(rf_list_id:int) -> tuple[str, str]:
    """
    対象の管理ファイルのフルパスを取得する
    rf_list_id:対象ID
    return:(フルパス, ファイル名)
    """
    with DbManager() as mana:
        data = rf_list.get_record_by_id(mana, rf_list_id)

        fname = data["filename"]
        fpath = data["path_location"]

        fullpath = os.path.join(refconfig.settings.SAVE_ROOT_PATH, fpath)

        return (fullpath, fname)

            

#-----------------------------------------------------------------------------------------
def savefile(ntime:datetime.datetime, srcname:str, fdata:bytes):
    """
    保存
    ntime:基準時間
    srcname:元名
    fdata:保存データ
    """
    #保存パスの作成
    savepath = _create_savepath_full(ntime, srcname)
    dir = os.path.dirname(savepath)
    #フォルダ作成
    fex = os.path.exists(dir)
    if fex == False:
        os.mkdir(dir)
        pass

    # 保存
    with open(savepath, "wb") as fp:
        fp.write(fdata)
        
#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
def _create_savefol_name(ntime:datetime.datetime) -> str:
    """
    保存フォルダ名の作成
    """    
    return ntime.strftime('%Y%m%d');

#-----------------------------------------------------------------------------------------
def _craete_savefile_name(ntime:datetime.datetime, srcname:str) -> str:
    """
    保存ファイル名の作成
    ntime:現在時間
    srcname:元ファイル名
    """
    return f"{ntime.strftime('%Y%m%d%H%M%S%f')}_{srcname}"
    
#-----------------------------------------------------------------------------------------
def _create_savepath(ntime:datetime.datetime, srcname:str) -> str:
    """
    保存フォルダパスの作成
    ntime:現在時間
    srcname:元ファイル名
    """
    name = _craete_savefile_name(ntime, srcname)
    fpath = _create_savefol_name(ntime)
    return os.path.join(fpath, name)


#-----------------------------------------------------------------------------------------
def _create_savepath_full(ntime:datetime.datetime, srcname: str) -> str:
    """
    保存ファイルフルパスの作成    
    ntime:現在時間
    srcname:元ファイル名
    return:保存パス    
    """
    fpath = _create_savepath(ntime, srcname)
    
    #保存ファイル名作成、ファイル名のかぶりを抑制するため、日時をつけておく
    return os.path.join(refconfig.settings.SAVE_ROOT_PATH, fpath)
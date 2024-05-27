from fastapi import APIRouter, HTTPException, Request, File, Form, UploadFile, Depends
from fastapi.responses import HTMLResponse
from modules import mlog, util, auth
import refconfig;
from db import rf_list, rf_list_info, list_logic
from db.dbmana import DbManager
import json
import os
import datetime

rt = APIRouter(prefix="/api")
log = mlog.get_log()


#-----------------------------------------------------------------------------------------
@rt.get("/get_list")
def get_list(uid=Depends(auth.require_login_auth)):
    """
    管理項目一覧取得
    uid:要求ユーザー
    """
    try:
        with DbManager() as mana:
            dlist = list_logic.get_list(mana)
            return HTMLResponse(content=util.to_json(dlist));
            
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)

    pass

#-----------------------------------------------------------------------------------------
@rt.post("/insert_manage_data")
def insert_manage_data(file: list[UploadFile], data:str = Form(), uid=Depends(auth.require_login_auth)):
    """
    管理リストへ追加
    file:管理ファイル
    data:データ項目
    """    
    
    try:
        #データ取得
        jdata = json.loads(data)
        refview = rf_list.RfListView(*jdata)
        refview.info = jdata["info"]
        print(refview, file[0].size)

        #保存ファイル名作成、ファイル名のかぶりを抑制するため、日時をつけておく
        savename = os.path.join(refconfig.settings.SAVE_ROOT_PATH, f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')}_{refview.filename}")   
        print("保存パス", savename)
        

        with DbManager() as mana:
            pass
            #dlist = list_logic.get_list(mana)
            #return HTMLResponse(content=util.to_json(dlist));
            return HTMLResponse(content=util.to_json(1))
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)

    pass


#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
@rt.post("/refupload")
async def refupload(file: list[UploadFile], data:str = Form()):

    fpath = refconfig.settings.create_save_filepath(file.filename)

    # 
    for file_data in file:
        fdata = await file_data.read()
        
        # パスの作成        
        fpath = refconfig.settings.create_save_filepath(file_data.filename)
        with open(fpath, "wb") as fp:
            fp.write(fdata)
            pass
        print("savefiles ", fpath)
    
    return HTMLResponse(content=util.to_json(1))



    
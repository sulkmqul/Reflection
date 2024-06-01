from fastapi import APIRouter, HTTPException, Request, File, Form, UploadFile, Depends
from fastapi.responses import HTMLResponse, FileResponse
from modules import mlog, util, auth
import refconfig;
from db import rf_list, rf_list_info, list_logic
from db.dbmana import DbManager
import json
from modules import list_proc
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
async def insert_manage_data(file: list[UploadFile], data:str = Form(), uid=Depends(auth.require_login_auth)):
    """
    管理リストへ追加
    file:管理ファイル
    data:データ項目
    """    
    
    try:
        #データ取得
        jdata = json.loads(data)
        refview = rf_list.RfListView(filename=jdata["filename"], related_rf_list_id=jdata["related_rf_list_id"])
        refview.info = jdata["info"]
        
        
        #ファイル情報取得
        fdata = await file[0].read()

        #基準時刻の取得
        ntime = datetime.datetime.now()
        #保存名の作成
        savepath = list_proc._create_savepath(ntime, refview.filename)
                
                
        with DbManager() as mana:
            try:
                
                mana.begin_transaction()

                #DBinsert
                list_logic.insert_record(mana, refview, savepath, uid)

                #ファイル保存
                list_proc.savefile(ntime, refview.filename, fdata)

                mana.commit()
                
                pass
            except Exception as ex:
                mana.rollback()
                raise ex
        
        return HTMLResponse(content=util.to_json(1))
        
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)

    pass
#-----------------------------------------------------------------------------------------
@rt.post("/update_manage_data")
def update_manage_data(data:str = Form(), uid=Depends(auth.require_login_auth)):

    try:

        #データ取得
        jdata = json.loads(data)
        refview = rf_list.RfListView(rf_list_id=jdata["rf_list_id"], filename=jdata["filename"], related_rf_list_id=jdata["related_rf_list_id"])
        refview.info = jdata["info"]

        print("update_madage_data", refview)

        with DbManager() as mana:
            try:
                mana.begin_transaction()
                list_logic.update_record(mana, refview, uid)                
                mana.commit()
            except Exception as uex:
                mana.rollback()
                raise uex

        return util.create_reflect_response(0)        
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass
#-----------------------------------------------------------------------------------------
@rt.post("/delete_manage_data")
def delete_manage_data(data:str = Form(), uid=Depends(auth.require_login_auth)):

    try:
        #データ取得
        jdata = json.loads(data)
        refview = rf_list.RfListView(rf_list_id=jdata["rf_list_id"], filename=jdata["filename"], related_rf_list_id=jdata["related_rf_list_id"])
        refview.info = jdata["info"]
        
        print("delete_manage_data", refview)

        with DbManager() as mana:
            try:
                mana.begin_transaction()                
                rf_list.delete_record(mana, refview, uid)
                mana.commit()
            except Exception as uex:
                mana.rollback()
                raise uex

        return util.create_reflect_response(0)        
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass


#-----------------------------------------------------------------------------------------
@rt.get("/download_manage_file")
def download_manage_file(rid:int, uid=Depends(auth.require_login_auth)):
    """
    管理ファイルの取得
    rid:rf_list_id
    uid:要求ユーザー
    """
    try:
        
        fullpath, fname = list_proc.get_select_fullpath(rid)
        return FileResponse(path = fullpath, filename=fname)
            
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass
#-----------------------------------------------------------------------------------------
@rt.get("/download_manage_file_link")
def download_manage_file_link(rid:int, token:str):
    """
    管理ファイルの取得、リンク取得版
    リンクで取得するのでtoken認証を引数で行う
    rid:rf_list_id
    token:認証トークン
    """
    try:

        #token解析
        uid = 1
        if refconfig.settings.AUTH_DEBUG is False:
            uid = auth.decode_authtoken(token)            
        
        fullpath, fname = list_proc.get_select_fullpath(rid)
        return FileResponse(path = fullpath, filename=fname)
            
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass
#-----------------------------------------------------------------------------------------
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



    
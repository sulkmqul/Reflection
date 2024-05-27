from fastapi import APIRouter, HTTPException, Request, File, Form, UploadFile, Depends, Body
from fastapi.responses import HTMLResponse
from modules import mlog, util, auth
import refconfig;
from db import list_info_columns_logic, ms_user, rf_list, rf_list_info, ms_list_info_columns, dbmana

"""
管理者のみが権限を有するAPI群
"""

rt = APIRouter(prefix="/admin")
log = mlog.get_log()

#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
#ユーザー管理
#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
@rt.get("/get_user_list")
def get_user_list(uid=Depends(auth.require_admin_auth)):
    """
    ユーザー一覧取得
    """
    try:
        ulist = ms_user.get_user_list()

        return HTMLResponse(content=util.to_json(ulist));
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass

#-----------------------------------------------------------------------------------------
@rt.get("/check_login_id")
def check_login_id(login_id, uid=Depends(auth.require_admin_auth)):
    """
    ログインIDが有効か否かをチェックする
    """
    try:
        ret = ms_user.check_login_id(login_id)    

        f = 0
        if ret is True:
            f = 1
        return util.create_reflect_response(f)
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass

#-----------------------------------------------------------------------------------------
@rt.post("/insert_user")
def insert_user(user:ms_user.MsUserEdit, uid=Depends(auth.require_admin_auth)):
    """
    ユーザーの挿入
    """
    try:
        with dbmana.DbManager() as mana:
            try:
                mana.begin_transaction()
                insert_id = ms_user.insert_user(mana, user, uid)            
                mana.commit()
            except Exception as uex:
                mana.rollback()
                raise uex

        return util.create_reflect_response(insert_id)
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass
#-----------------------------------------------------------------------------------------
@rt.post("/update_user")
def update_user(user:ms_user.MsUser, uid=Depends(auth.require_admin_auth)):
    """
    ユーザーの更新
    """
    try:
        with dbmana.DbManager() as mana:
            try:                
                mana.begin_transaction()
                ms_user.update_user(mana, user, uid)            
                mana.commit()
            except Exception as uex:
                mana.rollback()
                raise uex

        return util.create_reflect_response(0)
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass 
#-----------------------------------------------------------------------------------------
@rt.post("/delete_user")
def delete_user(userlist:list[ms_user.MsUser], uid=Depends(auth.require_admin_auth)):
    """
    ユーザーの削除
    """
    try:
        with dbmana.DbManager() as mana:
            try:
                mana.begin_transaction()
                for user in userlist:
                    ms_user.delete_user(mana, user, uid)
                mana.commit()
            except Exception as uex:
                mana.rollback()
                raise uex

        return util.create_reflect_response(0)
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass 
#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
#ms_list_info_col関係
#-----------------------------------------------------------------------------------------
#-----------------------------------------------------------------------------------------
@rt.get("/get_info_col_list")
def get_info_col_list(uid=Depends(auth.require_admin_auth)):
    """
    管理テーブル情報の取得
    """
    try:
        dlist = ms_list_info_columns.getrecords()        

        return HTMLResponse(content=util.to_json(dlist));
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass
#-----------------------------------------------------------------------------------------
@rt.post("/commit_info_col")
def commit_info_col(infolist:list[ms_list_info_columns.MsListInfoColumns], uid=Depends(auth.require_admin_auth)):
    """
    管理テーブル情報の追加削除
    """    
    try:
        list_info_columns_logic.insert_update(infolist, uid)
        return util.create_reflect_response(0)
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass
#-----------------------------------------------------------------------------------------
@rt.post("/delete_info_col")
def delete_info_col(infolist:list[ms_list_info_columns.MsListInfoColumns], uid=Depends(auth.require_admin_auth)):
    """
    管理テーブル情報の追加削除
    """    
    try:
        list_info_columns_logic.delete_col_info(infolist, uid)
        return util.create_reflect_response(0)
        pass
    except Exception as ex:
        log.error(ex)
        raise HTTPException(500)
    pass



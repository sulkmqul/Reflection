from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse
from modules import mlog
from modules import util, auth
from db import ms_user
from dataclasses import dataclass
rt = APIRouter(prefix="/auth")
log = mlog.get_log()


@dataclass
class RefLoginResponse:
    user:ms_user.MsUser
    auth_token: str = ""

#----------------------------------------------------------------------------------------------------
@rt.get("/login")
def login(login_id:str, login_password:str):
    """
    ログイン処理
    login_id:入力ログインID
    login_password:入力ログインパスワード
    """    
    try:
        # ユーザーの取得
        user = ms_user.get_login_user(login_id=login_id, login_password=login_password)
        if user is None:
            log.debug(f"no users. {login_id} {login_password}")
            return None
        
        # token発行
        token = auth.create_authtoken(user.ms_user_id)

        #レスポンス作成
        data = RefLoginResponse(user=user, auth_token=token)                        
        resp = util.to_json(data)
        
        return HTMLResponse(content=resp)
    
    except Exception as e:
        log.error(e)
        raise HTTPException(500)



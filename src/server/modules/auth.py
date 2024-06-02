from fastapi import Header, Request, HTTPException
import datetime
import refconfig
import jwt
from db import ms_user


#---------------------------------------------------------------------------
def require_login_auth(req:Request) -> int:
    """
    認証要求
    req:httpリクエスト
    return:認証ユーザーID
    """
    
    # debugの時は指定ユーザーIDを返却する
    if refconfig.settings.AUTH_DEBUG is True:
        return 1

    try:
        token = req.headers[refconfig.settings.AUTH_TOKEN_HEADER_NAME]
        n = decode_authtoken(token)
    except:
        raise HTTPException(401, "Unauthorizaed")
    
    return n
#---------------------------------------------------------------------------
def require_admin_auth(req:Request) -> int:
    """
    管理者権限要求
    req:httpリクエスト
    return:認証ユーザーID
    """
    
    # debugの時は指定ユーザーIDを返却する
    if refconfig.settings.AUTH_DEBUG is True:
        return 1

    try:
        # ログインIDの取得
        token = req.headers[refconfig.settings.AUTH_TOKEN_HEADER_NAME]
        n = decode_authtoken(token)
        
        #権限制御
        user = ms_user.get_user_by_id(n)
        if user.admin_flag == 0:
            raise Exception("not admin user")

    except Exception as ex:        
        raise HTTPException(401, "Unauthorizaed")
    
    return n
#---------------------------------------------------------------------------
def create_authtoken(user_id) -> str:
    """
    認証tokenの作成
    user_id:ユーザーID
    return:作成token
    """
    exp = datetime.datetime.now() + datetime.timedelta(hours=refconfig.settings.AUTH_VALID_HOUR)
    atoken = jwt.encode({"user_id":user_id, "exp":exp}, refconfig.settings.AUTH_SECRET_KEY, algorithm=refconfig.settings.AUTH_ALGORITHM)    
    return atoken

#---------------------------------------------------------------------------
def decode_authtoken(token:str) -> int:
    """
    認証tokenの解読
    token:解析token文字列
    return:ユーザーID
    """
    dec = jwt.decode(token, refconfig.settings.AUTH_SECRET_KEY, algorithms=refconfig.settings.AUTH_ALGORITHM)

    return dec["user_id"]


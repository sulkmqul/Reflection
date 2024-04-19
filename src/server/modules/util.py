from fastapi import Header, Request, HTTPException
import decimal
import json
import base64
import datetime
import refconfig
import jwt
import dataclasses
#------------------------------------------------------------------------------------
def to_json(data):
    """
    jsonへserializeする
    """
    res = json.dumps(data, default=_json_custom_converter)
    return res
    

#------------------------------------------------------------------------------------
def _json_custom_converter(data):
    """
    jsonに変換できない型を変換する
    """
    # decimal
    if isinstance(data, decimal.Decimal):        
        return float(data)
    
    # byte配列
    if isinstance(data, bytes):        
        # base64変換した文字列を返却
        return base64.b64encode(data).decode()
    
    
    if dataclasses.is_dataclass(data):
        return dataclasses.asdict(data)
    
    



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
        token = req.headers["reflect-token"]
        n = decode_authtoken(token)
    except:
        raise HTTPException(401, "Unauthorizaed")
    
    return n
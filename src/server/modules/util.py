import decimal
import json
import base64
import dataclasses
import fastapi.responses

#------------------------------------------------------------------------------------
def create_reflect_response(code = 0, message = "") -> fastapi.responses.HTMLResponse:
    """
    デフォルトレスポンスの作成
    """
    data = {"code":code, "message":message}
    return fastapi.responses.HTMLResponse(content=to_json(data));


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
    
    




from fastapi import APIRouter, HTTPException, Request, File, UploadFile, Depends
from fastapi.responses import HTMLResponse
from modules import mlog, util
import refconfig;

rt = APIRouter(prefix="/api")
log = mlog.get_log()


"""
@rt.get("/test")
def test():    
    return HTMLResponse(content=util.to_json("I am Test"))


@rt.get("/testapi")
def test_api(uid:int = Depends(util.require_login_auth)):
    return HTMLResponse(content=util.to_json("I am Auth"))
"""

async def save(file:UploadFile):
    import shutil, asyncio
    fpath = refconfig.settings.create_save_filepath(file.filename)    
    with open(fpath, "wb") as fp:
        shutil.copyfileobj(file.file, fp)
        pass
    file.close()

    print("savefiles ", fpath)
    pass


@rt.post("/refupload")
async def refupload(file:UploadFile):
    import asyncio
    #await save(file=file)
    await asyncio.create_task(save(file))
    """
    print("refupload", file.filename, file.size)
    fpath = refconfig.settings.create_save_filepath(file.filename)

    # 読込
    fdata = await file.read()    
    
    #以下の処理はブロッキングしちゃうので失敗。非同期保存しないとだめ    
    # パスの作成        
    fpath = refconfig.settings.create_save_filepath(file.filename)
    with open(fpath, "wb") as fp:
        fp.write(fdata)
        pass
    print("savefiles ", fpath)
    """



    return HTMLResponse(content=util.to_json(336))




    
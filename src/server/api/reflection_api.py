from fastapi import APIRouter, HTTPException, Request, File, UploadFile, Depends
from fastapi.responses import HTMLResponse
from modules import mlog, util

rt = APIRouter(prefix="/api")
log = mlog.get_log()


@rt.get("/test")
def test():
    return HTMLResponse(content="I am TEST")


@rt.get("/testapi")
def test_api(uid:int = Depends(util.require_login_auth)):
    return HTMLResponse(content=f"I am Best Auth:{uid}")




@rt.post("/upload")
async def upload(file:UploadFile):
    # 読込
    fdata = await file.read()
    pass
    
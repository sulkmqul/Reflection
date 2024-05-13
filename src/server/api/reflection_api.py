from fastapi import APIRouter, HTTPException, Request, File, Form, UploadFile, Depends
from fastapi.responses import HTMLResponse
from modules import mlog, util, auth
import refconfig;
from db import rf_list, rf_list_info

rt = APIRouter(prefix="/api")
log = mlog.get_log()


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



    
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
import db.dbmana
from modules import root, mlog
import refconfig
import api.reflection_api
import api.reflection_auth
import api.reflection_admin
import string


log = mlog.get_log()

@asynccontextmanager
async def lifespan_proc(app:FastAPI):
    """
    初期化処理
    """
    root.initialize()
    log.info("*****************************************************************************************")
    log.info("INIT SUCCESS")
    log.info("*****************************************************************************************")
    yield
    
    """
    終了処理
    """
    log.info("*****************************************************************************************")
    log.info("RELEASE SUCCESS")
    log.info("*****************************************************************************************")
    pass

# FAST APIの初期化
app = FastAPI(lifespan=lifespan_proc)
app.include_router(api.reflection_api.rt)
app.include_router(api.reflection_auth.rt)
app.include_router(api.reflection_admin.rt)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=refconfig.settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods="GET,POST,PUT",
    allow_headers=["reflect-token"]
)

@app.get("/test")
def test():
    log.info("TEST LOG")
    return "TEST"


def _TEST_TEST():
    from db import rf_list, rf_list_info, ms_list_info_columns, list_logic, list_info_columns_logic
    with db.dbmana.DbManager() as mana:
        #sql = list_logic._create_select_sql(ms_list_info_columns.getrecords_visibled(mana))
        data = rf_list.RfListDataEdit(
            delete_flag=0,
            filename="test_insert.txt",
            path_location="/test/fds",
        )
        data.info = {
            "TEST int":853,
            "test real":12.54,
            "test てきすと":"i am folling",
        }
        mana.begin_transaction()
        try:
            rid = list_logic.insert_record(mana, data, 1)
            print("INSERT OK", rid)
            mana.commit()
            #list = list_logic.get_list(mana)            
            
            
        except Exception as ex:
            mana.rollback()
            print("EXCEPTION", ex)
            pass
        pass
    pass



if __name__ == "__main__":  

    #_TEST_TEST()
    
    #uvicorn.run("main:app", host="0.0.0.0", port=8000, log_config="log_config.yaml", workers=4)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_config="log_config.yaml")
    


    pass
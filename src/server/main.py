from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
from modules import root, mlog
import refconfig
import api.reflection_api
import api.reflection_auth


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

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=refconfig.settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods="GET,POST,PUT",
)

@app.get("/test")
def test():
    log.info("TEST LOG")
    return "TEST"





if __name__ == "__main__":  
    uvicorn.run(app, host="0.0.0.0", port=8000, log_config="log_config.yaml")
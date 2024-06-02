
class Settings:
    """
    設定ファイルクラス 
    """

    # CORS許可場所
    CORS_ORIGINS= "http://localhost:4200"

    # DBファイルの場所(フルパスで書くこと)
    DB_SRC = "F:/作業領域/P/Reflection/working/refl.db"

    # ファイル保存パス(フルパスで書くこと)
    SAVE_ROOT_PATH = "F:/作業領域/P/Reflection/working/"

    ####################################################################################
    # 認証
    # Trueで認証を回避する
    AUTH_DEBUG = False
    # 認証tokenの有効時間
    AUTH_VALID_HOUR = 1
    # jwtの使用アルゴリズム
    AUTH_ALGORITHM="HS256"
    # 秘密鍵
    AUTH_SECRET_KEY="reflection_4n35uqio5mdth6uai"
    # ヘッダー名
    AUTH_TOKEN_HEADER_NAME = "reflect-token"
    ####################################################################################
    # ログクラス名 - log_configの名前とそろえること
    LOG_CLASS_NAME="API"

    pass


class SettingsEx(Settings):
    
    def create_save_filepath(self, filename) -> str:
        return self.SAVE_ROOT_PATH + filename;
    
settings = SettingsEx()
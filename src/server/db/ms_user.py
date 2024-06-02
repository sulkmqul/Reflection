from dataclasses import dataclass
import sqlite3
from db.dbmana import DbManager

@dataclass
class MsUser:
    ms_user_id: int = 0
    user_name: str = ""
    admin_flag: int = 0
    pass


@dataclass
class MsUserEdit(MsUser):
    login_id:str = ""
    login_password:str = ""
    pass

#------------------------------------------------------------------------------------
def get_user_by_id(ms_user_id) -> MsUser:
    """"
    対象ユーザーの取得
    ms_user_id:ユーザーID
    return:ms_user
    """
    sql = """
SELECT
ms_user.ms_user_id,
ms_user.user_name,
ms_user.admin_flag
FROM 
ms_user 
WHERE
ms_user.ms_user_id = ? AND
ms_user.delete_flag = 0
"""

    with DbManager() as mana:        
        user = mana.fetchone(sql, (ms_user_id, ))
        pass
    
    if user is None:
        return None
    
    ans = MsUser(user[0], user[1], user[2])
    
    return ans

#------------------------------------------------------------------------------------
def get_login_user(login_id, login_password) -> MsUser:
    """"
    ログインユーザーの取得
    login_id:ログインID
    login_password:パスワード
    return:ms_user
    """
    sql = """
SELECT
ms_user.ms_user_id,
ms_user.user_name,
ms_user.admin_flag
FROM 
ms_user
WHERE
ms_user.login_id = ? AND
ms_user.login_password = ? AND
ms_user.delete_flag = 0
"""
    with DbManager() as mana:        
        user = mana.fetchone(sql, (login_id, login_password))
        pass
    
    if user is None:
        return None
    
    ans = MsUser(user[0], user[1], user[2])
    
    return ans


#------------------------------------------------------------------------------------
def get_user_list() -> list[MsUser]:
    """"
    ユーザー一覧の取得
    """
    sql = """
SELECT
ms_user.ms_user_id,
ms_user.user_name,
ms_user.admin_flag
FROM 
ms_user
WHERE
ms_user.delete_flag = 0
ORDER BY
ms_user.ms_user_id
"""
    with DbManager() as mana:        
        dlist = mana.fetchall(sql)
        anslist = [MsUser(*data) for data in dlist]
        pass
    
    return anslist

#------------------------------------------------------------------------------------
def check_login_id(login_id: str) -> bool:
    """
    対象のログインIDが有効か否かを調べる
    login_id:チェックするログインID
    return:true=問題なし
    """
    sql = """
SELECT
ms_user.ms_user_id
FROM 
ms_user
WHERE
ms_user.login_id = ?
"""
    with DbManager() as mana:        
        user = mana.fetchone(sql, (login_id,))
        pass
    
    #被りが無ければよい
    if user is None:
        return True
    
    return False

#------------------------------------------------------------------------------------
def insert_user(mana:DbManager, data:MsUserEdit, user_id:int) -> int:
    """
    ユーザーの作成
    mana:DB管理
    data:挿入情報
    user_id:挿入者
    return:挿入ID
    """

    sql = """
INSERT INTO ms_user (
user_name,
login_id,
login_password,
admin_flag,

delete_flag,
create_user_id,
update_user_id
) VALUES 
(
?, ?, ?, ?,
?, ?, ?
);
"""
    uid = mana.insert(sql, (data.user_name, data.login_id, data.login_password, data.admin_flag,
                      0, user_id, user_id))
    return uid

#------------------------------------------------------------------------------------
def update_user(mana:DbManager, data:MsUser, user_id:int):
    """
    ユーザーの作成
    mana:DB管理
    data:更新情報
    user_id:更新者
    """

    sql = """
UPDATE ms_user SET
user_name = ?,
admin_flag = ?,
update_user_id = ?
WHERE
ms_user_id = ?

"""
    mana.execute(sql, (data.user_name, data.admin_flag,
                      user_id, data.ms_user_id))
    pass


#------------------------------------------------------------------------------------
def update_login_password(mana:DbManager, ms_user_id:int, login_password:str, user_id:int):
    """
    パスワードの更新
    mana:DB管理
    ms_user_id:更新対象
    login_password:更新パスワード
    user_id:更新者
    """

    sql = """
UPDATE ms_user SET
login_password = ?,
update_user_id = ?
WHERE
ms_user_id = ?
"""
    mana.execute(sql, (login_password, user_id, ms_user_id))


#------------------------------------------------------------------------------------
def delete_user(mana:DbManager, user:MsUser, user_id:int):
    """
    パスワードの更新
    mana:DB管理
    user:削除ユーザー
    user_id:更新者
    """

    sql = """
UPDATE ms_user SET
delete_flag = 1,
update_user_id = ?
WHERE
ms_user_id = ?
"""
    mana.execute(sql, (user_id, user.ms_user_id))
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
def create_template(cur:sqlite3.Cursor):
    """
    ms_userのDBテンプレートの作成
    """

    sql_create = """
CREATE TABLE IF NOT EXISTS ms_user ( 
ms_user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_name TEXT,
login_id TEXT,
login_password TEXT,
admin_flag INTEGER NOT NULL DEFAULT 0,

delete_flag INTEGER NOT NULL  DEFAULT 0,
create_user_id INTEGER NOT NULL,
create_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
update_user_id INTEGER NOT NULL,
updated_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
"""

    sql_trigger = """
CREATE TRIGGER IF NOT EXISTS trigger_ms_user_updated_date AFTER UPDATE ON ms_user
BEGIN
    UPDATE ms_user SET updated_date = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;
"""
    sql_insert = """
INSERT INTO ms_user (user_name, login_id, login_password, create_user_id, update_user_id, admin_flag) VALUES ('administrator', 'admin', '#reflection', 0, 0, 1);
"""

    # 実行
    cur.execute(sql_create);
    cur.execute(sql_trigger);
    cur.execute(sql_insert);

    pass


#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------
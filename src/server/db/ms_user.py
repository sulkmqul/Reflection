import sqlite3
from db.dbmana import DbManager




#------------------------------------------------------------------------------------
def get_login_user(login_id, login_password):
    """"
    ログインユーザーの取得
    login_id:ログインID
    login_password:パスワード
    return:ms_user
    """
    sql = """
SELECT
ms_user.ms_user_id,
ms_user.user_name
FROM 
ms_user
WHERE
ms_user.login_id = ? AND
ms_user.login_password = ? AND
ms_user.delete_flag = 0
"""
    with DbManager() as mana:
        cur = mana.begin_transaction()
        cur.execute(sql, (login_id, login_password))
        user = cur.fetchone()
        pass
    
    if user is None:
        return None
    
    ans = {"ms_user_id":user[0], "user_name":user[1]}
    
    return ans



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

delete_flag INTEGER NOT NULL  DEFAULT 0,
create_user_id INTEGER NOT NULL,
create_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
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
INSERT INTO ms_user (user_name, login_id, login_password, create_user_id) VALUES ('administrator', 'admin', '#reflection', 0);
"""

    # 実行
    cur.execute(sql_create);
    cur.execute(sql_trigger);
    cur.execute(sql_insert);

    pass

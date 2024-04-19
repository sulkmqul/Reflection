import sqlite3

def create_template(cur:sqlite3.Cursor):
    sql_create = """
CREATE TABLE IF NOT EXISTS rf_list ( 
rf_list_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
filename TEXT,
path_location TEXT,

delete_flag INTEGER NOT NULL  DEFAULT 0,
create_user_id INTEGER NOT NULL,
create_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
updated_date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
"""

    sql_trigger = """
CREATE TRIGGER IF NOT EXISTS trigger_rf_list_updated_date AFTER UPDATE ON rf_list
BEGIN
    UPDATE rf_list SET updated_date = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;
"""

    cur.execute(sql_create);
    cur.execute(sql_trigger);

    pass
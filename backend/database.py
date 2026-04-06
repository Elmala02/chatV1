import pg8000.native
import os
import ssl
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    db_user = os.environ.get("DB_USER")
    db_password = os.environ.get("DB_PASSWORD")
    db_host = os.environ.get("DB_HOST")
    db_port = int(os.environ.get("DB_PORT", 5432))
    db_name = os.environ.get("DB_NAME")

    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    return pg8000.native.Connection(
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        database=db_name,
        ssl_context=ssl_context,
        timeout=10000
    )

def execute_query(query, **kwargs):
    conn = get_db_connection()
    try:
        res = conn.run(query, **kwargs)
        cols = [col['name'] for col in conn.columns] if conn.columns else []
        return res, cols
    finally:
        conn.close()

def fetch_all_dicts(query, **kwargs):
    rows, cols = execute_query(query, **kwargs)
    result = []
    for row in rows:
        result.append(dict(zip(cols, row)))
    return result

def fetch_one_dict(query, **kwargs):
    rows = fetch_all_dicts(query, **kwargs)
    if rows:
        return rows[0]
    return None

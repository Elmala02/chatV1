import os
from dotenv import load_dotenv
import pg8000.native
import ssl

# Forzar la ruta del .env para asegurar que lo lea correctamente
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

def test_connection():
    try:
        print("--- Iniciando prueba de conexión RDS ---")
        host = os.environ.get("DB_HOST")
        user = os.environ.get("DB_USER")
        db = os.environ.get("DB_NAME")
        
        print(f"Host: {host}")
        print(f"Usuario: {user}")
        print(f"Base de datos: {db}")
        
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        conn = pg8000.native.Connection(
            user=user,
            password=os.environ.get("DB_PASSWORD"),
            host=host,
            port=int(os.environ.get("DB_PORT", 5432)),
            database=db,
            ssl_context=ssl_context,
            timeout=10 # Timeout corto para no esperar demasiado si falla
        )
        print("✅ ¡CONEXIÓN EXITOSA!")
        
        res = conn.run("SELECT current_database(), current_user, version();")
        print(f"Información del servidor: {res[0]}")
        
        conn.close()
    except Exception as e:
        print("❌ ERROR DE CONEXIÓN:")
        print(str(e))

if __name__ == "__main__":
    test_connection()

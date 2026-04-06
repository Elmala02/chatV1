import pg8000.native
import os
import ssl
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv()

def init_db():
    db_user = os.environ.get("DB_USER")
    db_password = os.environ.get("DB_PASSWORD")
    db_host = os.environ.get("DB_HOST")
    db_port = int(os.environ.get("DB_PORT", 5432))
    db_name = os.environ.get("DB_NAME")

    if not all([db_user, db_password, db_host, db_name]):
        print("Error: Faltan variables de entorno para la conexión de base de datos.")
        return

    try:
        # Contexto SSL requerido por Render
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        # Conectar a la base de datos usando pg8000 con SSL
        print(f"Conectando a Render PostgreSQL host: {db_host}...")
        conexion = pg8000.native.Connection(
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
            database=db_name,
            ssl_context=ssl_context
        )
        
        print("Conexión exitosa. Leyendo archivo SQL...")
        # Leer el contenido del archivo schema.sql
        with open("schema.sql", "r", encoding="utf-8") as file:
            sql_script = file.read()
        
        print("Ejecutando script de inicialización de tablas...")
        # pg8000.native.run does not execute multiple statements easily if they are huge sometimes, but let's see.
        conexion.run(sql_script)
        
        print("¡Base de datos inicializada correctamente con el nuevo esquema!")

    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")
    finally:
        if 'conexion' in locals() and conexion:
            conexion.close()
            print("Conexión cerrada.")

if __name__ == "__main__":
    init_db()

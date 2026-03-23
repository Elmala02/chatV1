import psycopg2
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

def get_connection():
    try:
        # Intentar con DATABASE_URL primero
        db_url = os.environ.get("DATABASE_URL")
        if db_url:
            connection = psycopg2.connect(db_url)
        else:
            # Si no hay DATABASE_URL, usar variables individuales
            connection = psycopg2.connect(
                host=os.environ.get("DB_HOST"),
                port=os.environ.get("DB_PORT"),
                database=os.environ.get("DB_NAME"),
                user=os.environ.get("DB_USER"),
                password=os.environ.get("DB_PASSWORD")
            )
        print("Conexión exitosa a la base de datos.")
        return connection
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

if __name__ == "__main__":
    conn = get_connection()
    if conn:
        conn.close()
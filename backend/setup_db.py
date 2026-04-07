import os
from database import get_db_connection

def reset_db():
    print("Iniciando reinicio de la base de datos (usando pg8000)...")
    
    try:
        conn = get_db_connection()
        
        # Leer el archivo schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r', encoding='utf-8') as f:
            sql_full = f.read()
            
        # Limpiar comentarios y separar las sentencias por punto y coma
        # Nota: pg8000.native prefiere ejecutar sentencias individuales
        queries = sql_full.split(';')
        
        for q in queries:
            clean_q = q.strip()
            if clean_q:
                # Omitimos comentarios de una sola línea al inicio si los hay
                lines = [l for l in clean_q.split('\n') if not l.strip().startswith('--')]
                final_q = '\n'.join(lines).strip()
                if final_q:
                    conn.run(final_q)
        
        print("¡Base de datos reiniciada con éxito usando pg8000!")
        conn.close()
        
    except Exception as e:
        print(f"Error durante el reinicio: {e}")

if __name__ == "__main__":
    confirm = input("¿Estás seguro de que quieres BORRAR TODO y reiniciar la BD? (s/n): ")
    if confirm.lower() == 's':
        reset_db()
    else:
        print("Reinicio cancelado.")

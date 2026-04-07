from database import get_db_connection

def apply_indexes():
    print("Aplicando índices de velocidad a la base de datos actual...")
    conn = get_db_connection()
    
    queries = [
        "CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo)",
        "CREATE INDEX IF NOT EXISTS idx_participantes_user ON participantes(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_participantes_sala ON participantes(sala_id)",
        "CREATE INDEX IF NOT EXISTS idx_mensajes_sala_id ON mensajes(sala_id)",
        "CREATE INDEX IF NOT EXISTS idx_mensajes_padre_id ON mensajes(mensaje_padre_id)",
        "CREATE INDEX IF NOT EXISTS idx_mensajes_user_id ON mensajes(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_amistades_user1 ON amistades(user_id_1)",
        "CREATE INDEX IF NOT EXISTS idx_amistades_user2 ON amistades(user_id_2)",
        "CREATE INDEX IF NOT EXISTS idx_mensaje_likes_msg ON mensaje_likes(mensaje_id)",
        "CREATE INDEX IF NOT EXISTS idx_notificaciones_target ON notificaciones(target_user_id)"
    ]
    
    try:
        succ = 0
        for q in queries:
            try:
                conn.run(q)
                succ += 1
            except Exception as e:
                # Si el indice ya existe pg8000 puede lanzar un error, lo omitimos con IF NOT EXISTS pero por si acaso.
                if "already exists" not in str(e).lower():
                    print(f"Advertencia en consulta '{q}': {e}")
        print(f"¡{succ} índices aplicados exitosamente! La base de datos es ahora mucho más rápida.")
    finally:
        conn.close()

if __name__ == "__main__":
    apply_indexes()

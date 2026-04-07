-- Eliminar tablas si existen (DROP en cascada)
DROP TABLE IF EXISTS notificaciones CASCADE;
DROP TABLE IF EXISTS mensaje_likes CASCADE;
DROP TABLE IF EXISTS amistades CASCADE;
DROP TABLE IF EXISTS mensajes CASCADE;
DROP TABLE IF EXISTS participantes CASCADE;
DROP TABLE IF EXISTS salas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    token_auth VARCHAR(255) NULL,
    avatar_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);

-- Crear tabla de salas
CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'privado', -- privado, grupo, blog_global
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de participantes
CREATE TABLE participantes (
    user_id INT,
    sala_id INT,
    notif_pendientes SMALLINT DEFAULT 0,
    ultima_lectura TIMESTAMP DEFAULT NOW(),
    fecha_ingreso TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, sala_id),
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE
);
CREATE INDEX idx_participantes_user ON participantes(user_id);
CREATE INDEX idx_participantes_sala ON participantes(sala_id);

-- Crear tabla de mensajes
CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    user_id INT,
    sala_id INT,
    mensaje_padre_id INT NULL, 
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE,
    FOREIGN KEY (mensaje_padre_id) REFERENCES mensajes(id) ON DELETE CASCADE
);
CREATE INDEX idx_mensajes_sala_id ON mensajes(sala_id);
CREATE INDEX idx_mensajes_padre_id ON mensajes(mensaje_padre_id);
CREATE INDEX idx_mensajes_user_id ON mensajes(user_id);

-- Crear tabla de amistades
CREATE TABLE amistades (
    user_id_1 INT,
    user_id_2 INT,
    estado VARCHAR(20) DEFAULT 'pendiente', 
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id_1, user_id_2),
    FOREIGN KEY (user_id_1) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE INDEX idx_amistades_user1 ON amistades(user_id_1);
CREATE INDEX idx_amistades_user2 ON amistades(user_id_2);

-- Crear tabla de likes de mensajes
CREATE TABLE mensaje_likes (
    user_id INT,
    mensaje_id INT,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, mensaje_id),
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (mensaje_id) REFERENCES mensajes(id) ON DELETE CASCADE
);
CREATE INDEX idx_mensaje_likes_msg ON mensaje_likes(mensaje_id);

-- Crear tabla de notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    target_user_id INT NOT NULL,  
    sender_user_id INT NULL,      
    tipo VARCHAR(50),             
    leido BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (target_user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
CREATE INDEX idx_notificaciones_target ON notificaciones(target_user_id);

-- Crear sala global por defecto
INSERT INTO salas (nombre, tipo) VALUES ('Blog Global', 'blog_global');
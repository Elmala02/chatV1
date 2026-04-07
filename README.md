# ChatHub v1 - Social Blog & Messaging Platform

ChatHub es una plataforma "Social-First" construida con React (Frontend) y Python/Flask (Backend) conectada a PostgreSQL. Ofrece un sistema de autenticación, blog social global en tiempo real, chat privado cifrado estéticamente y sistema de solicitudes de amistad.

---

## 🛠️ Stack Tecnológico

**Frontend:**
- React 19 + Vite 7
- React Router DOM 7
- Context API + Hooks personalizados
- Socket.IO Client (WebSockets Nativos)
- Diseño responsivo "Zest & Hearth" (Glassmorphism & Animaciones GSAP/Framer Motion)

**Backend:**
- Python 3
- Flask + Flask-SocketIO
- PostgreSQL (Gestión pura mediante el driver `pg8000`)
- JWT (JSON Web Tokens) para Autenticación

---

## 🚀 Guía de Instalación Paso a Paso

Sigue estas instrucciones al pie de la letra para levantar todo el proyecto de manera local.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Elmala02/chatV1.git
cd chatV1
git checkout pelu-v1
```

---

### 2. Configuración del Backend (Python & PostgreSQL)

Asegúrate de tener Python 3.10+ y PostgreSQL instalado en tu sistema.

**Paso 2.1: Crear Entorno Virtual (.venv)**
El backend de este proyecto vive en la carpeta `/backend`. Es vital usar un entorno virtual para no chocar con paquetes del sistema.

```bash
cd backend
python3 -m venv .venv
```

**Paso 2.2: Activar el Entorno Virtual**
Dependiendo de tu sistema operativo:
- **En Linux/Mac:**
  ```bash
  source .venv/bin/activate
  ```
- **En Windows:**
  ```cmd
  .venv\Scripts\activate
  ```

**Paso 2.3: Instalar Dependencias del Backend**
Con el entorno virtual activado (`(.venv)` aparecerá en tu terminal):
```bash
pip install -r requirements.txt
```
*(Nota: Esto instalará Flask, Flask-SocketIO, pg8000 para BD, PyJWT, flask-cors, eventlet, etc.)*

**Paso 2.4: Conexion a la Base de Datos (.env)**
Crea un archivo llamado `.env` dentro de la carpeta `backend/` con las credenciales de tu PostgreSQL. Ejemplo:
```env
DB_USER=postges
DB_PASS=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chat_db
JWT_SECRET=escribe_aqui_una_clave_secreta_fuerte
```

**Paso 2.5: Instalar y Optimizar Base de Datos**
(Opcional / Primera vez) Si necesitas reiniciar la base de datos o instalarla desde cero:
```bash
python setup_db.py
python apply_indexes.py
```
*`apply_indexes.py` inyectará índices de velocidad para evitar cuellos de botella por JOINs.*

**Paso 2.6: Encender el Backend**
```bash
python app.py
```
*¡Listo! Tu backend y WebSockets estarán corriendo en `http://localhost:5000`.*

---

### 3. Configuración del Frontend (Node.js & React)

El frontend vive en la carpeta `/` o `/src` (fuera del backend). Abre una **segunda ventana de terminal**.

**Paso 3.1: Instalar Node Modules**
En la raíz del proyecto (`chatV1/`), ejecuta:
```bash
npm install
```
*(Esto descargará Vite, React, Socket.IO Client, Framer Motion, GSAP, etc.)*

**Paso 3.2: Configurar las Variables de Entorno del Frontend**
En la raíz del proyecto, crea un archivo `.env` para apuntar a tu backend local:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Paso 3.3: Encender el Frontend**
```bash
npm run dev
```

**Paso 3.4: ¡A Disfrutar!**
Abre la URL que indique Vite, que normalmente es:
```
http://localhost:5173
```

---

## 🏛️ Estructura del Proyecto

```text
chatV1/
├── backend/                  # Servidor API & WebSockets
│   ├── .venv/                # (Carpeta autogenerada) Entorno Virtual Python
│   ├── app.py                # Lógica principal, rutas y websockets
│   ├── database.py           # Conexión nativa pg8000
│   ├── conection.py          # Soporte de prueba BD externa
│   ├── schema.sql            # Tablas e Índices de BD
│   ├── apply_indexes.py      # Optimizador SQL de velocidad
│   └── setup_db.py           # Script reset de base de datos
├── src/                      # Frontend
│   ├── components/           # Componentes modulares, UI, layouts
│   ├── config/               # Tokens de diseño y props compartidos
│   ├── context/              # AppContext (manejo de estado global JWT y Sockets)
│   ├── hooks/                # Hooks personalizados
│   ├── styles/               # CSS encapsulado por componentes
│   └── main.jsx
├── package.json              # Dependencias React/Node
└── README.md
```

## 🔥 Optimizaciones de Velocidad Incluidas

- **Batch SQL (Zero N+1):** El backend carga posts, comentarios y likes combinando identificadores `IN ()` eliminando el infame "Full Table Scan".
- **Socket WebSockets Nativos:** Eliminamos peticiones 'polling' obligando al navegador a usar Socket.IO con túneles puros bidireccionales de baja latencia.
- **Relaciones Indexadas:** PostgreSQL genera accesos en `O(log N)` a todos los mensajes históricos mediante llaves foráneas (`sala_id`, `user_id`, `mensaje_padre_id`).
- **UI Optimista:** Las interacciones como "Dar Like" modifican el React Context sin bloquearse a la confirmación de base de datos, entregando una sensación fluida y nativa.

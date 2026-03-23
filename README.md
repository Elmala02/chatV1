# Proyecto de Chat v1

Este es el repositorio para el proyecto de chat, desarrollado con React (Frontend) y Python (Backend).

## Estructura del Proyecto

*   `/backend`: Contiene los scripts de Python, conexión a la base de datos y scripts SQL.
*   `/src`: Contiene el código fuente del frontend en React.
*   `package.json`: Configuración del frontend y dependencias.
*   `vite.config.js`: Configuración del servidor de desarrollo Vite.

## Instalaciones Previas Necesarias

### 1. Node.js
Es necesario tener instalado **Node.js** (se recomienda la versión LTS) para gestionar las dependencias del frontend.
*   Descargar e instalar desde: [nodejs.org](https://nodejs.org)

### 2. Python
El backend requiere **Python 3.x**. Se recomienda crear un entorno virtual (`venv`) para evitar conflictos de dependencias.
*   Descargar e instalar desde: [python.org](https://python.org)

### 3. Git
Para gestionar el versionamiento del proyecto.

## Paso a Paso para la Configuración

### Configurar el Frontend
1.  Abrir una terminal en el directorio raíz del proyecto.
2.  Instalar las dependencias de Node.js:
    ```bash
    npm install
    ```
3.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

### Configurar el Backend
1.  Navegar al directorio `/backend`:
    ```bash
    cd backend
    ```
2.  (Opcional pero recomendado) Crear y activar un entorno virtual:
    ```bash
    python -m venv venv
    # En Windows:
    .\venv\Scripts\activate
    # En Linux/macOS:
    source venv/bin/activate
    ```
3.  Instalar las dependencias necesarias:
    ```bash
    pip install -r requirements.txt
    ```

## Base de Datos
El proyecto actualmente utiliza una base de datos PostgreSQL alojada en **Render**. Asegúrate de que el archivo `backend/.env` contenga las credenciales correctas:
*   `DB_HOST`: Host de la base de datos.
*   `DB_PORT`: Puerto (por defecto 5432).
*   `DB_NAME`: Nombre de la base de datos.
*   `DB_USER`: Usuario de la base de datos.
*   `DB_PASSWORD`: Contraseña de acceso.

## Scripts Adicionales
*   `setup_git.ps1`: Script para configurar Git (si es necesario).

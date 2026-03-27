# ChatHub v1

Frontend de una aplicacion social construida con React y Vite. El proyecto combina una landing page, autenticacion local, chat global, blog social, mensajeria privada, descubrimiento de usuarios y notificaciones, todo persistido en `localStorage`.

## Stack

- React 19
- Vite 7
- React Router DOM 7
- Framer Motion
- GSAP
- OGL
- Lucide React
- ESLint 9

## Requisitos

Antes de instalar el proyecto, asegurate de tener:

- Node.js 20 o superior recomendado
- npm 10 o superior recomendado
- Git

Verifica versiones:

```bash
node -v
npm -v
git --version
```

## Instalacion

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd chatV1
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el entorno de desarrollo:

```bash
npm run dev
```

4. Abre la URL que muestra Vite en consola, normalmente:

```text
http://localhost:5173
```

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo con Vite.
- `npm run build`: genera la build de produccion en `dist/`.
- `npm run preview`: sirve localmente la build generada.
- `npm run lint`: ejecuta ESLint sobre el proyecto.

## Dependencias del proyecto

### Dependencias de runtime

Estas se instalan automaticamente con `npm install`:

| Paquete | Version | Uso |
| --- | --- | --- |
| `react` | `^19.2.0` | Base de la interfaz |
| `react-dom` | `^19.2.0` | Renderizado en el navegador |
| `react-router-dom` | `^7.13.0` | Ruteo y proteccion de rutas |
| `framer-motion` | `^12.34.0` | Animaciones |
| `gsap` | `^3.14.2` | Animaciones avanzadas |
| `ogl` | `^1.0.11` | Efectos visuales WebGL |
| `lucide-react` | `^0.563.0` | Iconografia |

### Dependencias de desarrollo

| Paquete | Version | Uso |
| --- | --- | --- |
| `vite` | `^7.3.1` | Bundler y dev server |
| `@vitejs/plugin-react` | `^5.1.1` | Integracion React + Vite |
| `eslint` | `^9.39.1` | Linting |
| `@eslint/js` | `^9.39.1` | Configuracion base de ESLint |
| `eslint-plugin-react-hooks` | `^7.0.1` | Reglas para hooks |
| `eslint-plugin-react-refresh` | `^0.4.24` | Reglas para fast refresh |
| `globals` | `^16.5.0` | Globals para ESLint |
| `@types/react` | `^19.2.7` | Tipos de React |
| `@types/react-dom` | `^19.2.3` | Tipos de React DOM |

## Arquitectura del proyecto

La aplicacion esta organizada como un frontend modular con una separacion clara entre presentacion, estado global, hooks y configuracion.

### Flujo principal

1. `src/main.jsx` monta React, configura `BrowserRouter`, define las rutas y protege las rutas privadas.
2. `AppProvider` en `src/context/AppContext.jsx` centraliza el estado global.
3. Los hooks personalizados encapsulan la logica de autenticacion, chat, navbar, amigos y notificaciones.
4. Los componentes de pagina renderizan la UI usando datos del contexto y hooks.
5. El estado se persiste en `localStorage`, por lo que no depende de un backend en este estado del proyecto.

### Capas

- `context/`: estado global y acceso al contexto.
- `hooks/`: logica reutilizable por dominio.
- `components/pages/`: pantallas principales.
- `components/layout/`: layout global y navbar.
- `components/common/`: piezas UI reutilizables.
- `components/ui/`: componentes visuales y efectos.
- `config/`: constantes, textos, tabs, animaciones y temas.
- `styles/`: estilos globales y por componente.

## Estructura de carpetas

```text
chatV1/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Avatar/
│   │   │   ├── EmptyState/
│   │   │   ├── InputGroup/
│   │   │   ├── MessageBubble/
│   │   │   └── UserCard/
│   │   ├── layout/
│   │   │   └── Navbar/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── ChatBoard/
│   │   │   └── Landing/
│   │   └── ui/
│   │       ├── Balatro/
│   │       ├── ElectricBorder/
│   │       └── TextType/
│   ├── config/
│   ├── context/
│   ├── hooks/
│   ├── images/
│   ├── styles/
│   └── main.jsx
├── eslint.config.js
├── package.json
├── package-lock.json
└── vite.config.js
```

## Modulos principales

### `src/main.jsx`

Punto de entrada de la aplicacion. Define:

- montaje con `createRoot`
- enrutamiento con `BrowserRouter`
- rutas publicas y privadas
- `ProtectedRoute`
- proveedor global `AppProvider`

### `src/context/AppContext.jsx`

Contiene el estado global de la aplicacion:

- tema
- usuario autenticado
- usuarios registrados
- mensajes globales
- notificaciones
- mensajes privados

Tambien expone acciones como:

- `toggleTheme`
- `registerUser`
- `loginUser`
- `logoutUser`
- `addPost`
- `likePost`
- `addComment`
- `sendRequest`
- `acceptRequest`
- `sendPrivateMessage`

### `src/hooks/`

Hooks de dominio:

- `useAuth`: login, registro y logout.
- `useChat`: publicaciones, likes, comentarios y mensajes globales.
- `usePrivateChat`: conversacion privada por amigo.
- `useFriends`: busqueda de usuarios, solicitudes y amistades.
- `useNotifications`: panel y lectura de notificaciones.
- `useNavbar`: estado visual del navbar al hacer scroll.
- `useChatBoard`: manejo de tabs y chat privado seleccionado.

### `src/components/pages/`

Pantallas principales:

- `Landing`: pagina inicial y seccion de caracteristicas.
- `Auth`: login y registro.
- `ChatBoard`: contenedor principal del area privada.

Dentro de `ChatBoard` se dividen los modulos por responsabilidad:

- `GlobalChat`
- `BlogSection`
- `PrivateList`
- `PrivateChat`
- `DiscoverUsers`
- `RequestsList`
- `Sidebar`

## Rutas

| Ruta | Tipo | Descripcion |
| --- | --- | --- |
| `/` | Publica | Landing page |
| `/auth` | Publica | Login y registro |
| `/chat` | Privada | ChatBoard principal |
| `/users` | Privada | ChatBoard abierto en la pestaña de usuarios |

## Persistencia

La aplicacion no depende de un backend en el estado actual. La informacion se guarda en el navegador usando `localStorage`.

Claves usadas:

- `theme`
- `currentUser`
- `users`
- `messages`
- `notifications`
- `privateMessages`

Si necesitas reiniciar el estado local, puedes borrar esas claves desde las herramientas del navegador.

## Estilos

La app combina dos niveles de estilos:

- `src/styles/global.css`: variables globales, tema y estilos base.
- `src/styles/components/**`: estilos por componente.

Ademas, varios componentes importan sus hojas de estilo desde su propio modulo.

## Desarrollo y mantenimiento

### Recomendaciones

- Mantener la logica compleja en hooks o contexto, no en componentes grandes.
- Reutilizar `config/uiConfig.js` para textos, tabs, links e iconos.
- Añadir nuevas pantallas dentro de `components/pages/`.
- Añadir componentes reutilizables a `components/common/` o `components/ui/` segun su naturaleza.

### Flujo recomendado

```bash
npm install
npm run lint
npm run dev
```

### Build de produccion

```bash
npm run build
npm run preview
```

## Problemas comunes

### El proyecto no inicia

Verifica que `node_modules/` exista y que `npm install` haya terminado sin errores.

### Cambios de usuario o mensajes no persisten

Revisa que el navegador permita `localStorage` y que no estes en modo privado restringido.

### ESLint muestra errores viejos en VS Code

Recarga la ventana o reinicia el servidor de ESLint desde el editor.

## Estado actual

- Proyecto frontend listo para desarrollo local.
- Persistencia local con `localStorage`.
- Sin variables de entorno obligatorias en el estado actual.
- Sin backend integrado dentro de este workspace.

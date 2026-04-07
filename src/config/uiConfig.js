import {
    MessageCircle, Sparkles, Lock, Search, Bell,
    Zap, Shield, MessageSquare,
    Home, Users,
} from 'lucide-react';

/**
 * SIDEBAR_TABS: Configuración de la navegación lateral dentro del ChatBoard.
 * @property {string} id - Identificador único de la pestaña (usado en activeTab).
 * @property {LucideIcon} icon - Componente de ícono de Lucide.
 * @property {string} label - Texto a mostrar al usuario.
 * @property {boolean} clearFriend - Si es true, oculta el chat privado actual al cambiar.
 */
export const SIDEBAR_TABS = [
    { id: 'blog', icon: Sparkles, label: 'Blog Social', clearFriend: true },
    { id: 'private', icon: Lock, label: 'Privado', clearFriend: false },
    { id: 'users', icon: Search, label: 'Descubrir', clearFriend: true },
    { id: 'requests', icon: Bell, label: 'Solicitudes', clearFriend: true },
];

/**
 * NAV_LINKS: Enlaces que aparecen en la barra de navegación superior (Navbar).
 * @property {string} to - Ruta definida en React Router.
 * @property {LucideIcon} icon - Ícono asociado.
 * @property {string} label - Nombre legible.
 * @property {boolean} requiresAuth - Si el link solo debe mostrarse a usuarios logueados.
 */
export const NAV_LINKS = [
    { to: '/', icon: Home, label: 'Inicio', requiresAuth: false },
    { to: '/chat', icon: Sparkles, label: 'Social', requiresAuth: true },
];

/**
 * TEXTTYPE_TEXTS: Listas de frases para las animaciones de escritura en diferentes páginas.
 */
export const TEXTTYPE_TEXTS = {
    landing: ['Conversa', 'Comunícate', 'Diviértete'], // Mensajes en la página de inicio
    auth: ['Tu Espacio', 'Tu Comunidad', 'Tu Chat'],   // Mensajes en la página de login/registro
};

/**
 * FEATURE_CARDS: Información mostrada en la sección de características de la Landing.
 */
export const FEATURE_CARDS = [
    {
        icon: Zap,
        title: 'Tiempo Real',
        description: 'Conversaciones instantáneas sin demoras. Conecta de inmediato.',
    },
    {
        icon: Shield,
        title: 'Privacidad',
        description: 'Tus datos están seguros. Tú controlas quién ve qué.',
    },
    {
        icon: MessageSquare,
        title: 'Interactividad',
        description: 'Envía solicitudes, reacciona y vive una experiencia única.',
    },
];

/**
 * MOCKUP_BUBBLES: Contenido estático para el simulador de chat en la Landing Page.
 */
export const MOCKUP_BUBBLES = [
    { side: 'left', text: '¡Hola! 👋 Mira este nuevo post...' },
    { side: 'right', text: '¡Increíble! Me encanta el diseño 🚀' },
    { side: 'left', text: 'Emojis y más integrados 🤩✨' },
];

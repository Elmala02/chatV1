import {
    MessageCircle, Sparkles, Lock, Search, Bell,
    Zap, Shield, MessageSquare,
    Home, Users,
} from 'lucide-react';

/**
 * Configuración de la navegación del sidebar (ChatBoard).
 * Cada tab tiene: id, ícono, label y si limpia el amigo seleccionado.
 */
export const SIDEBAR_TABS = [
    { id: 'chat', icon: MessageCircle, label: 'Chat Global', clearFriend: true },
    { id: 'blog', icon: Sparkles, label: 'Blog Social', clearFriend: true },
    { id: 'private', icon: Lock, label: 'Privado', clearFriend: false },
    { id: 'users', icon: Search, label: 'Descubrir', clearFriend: true },
    { id: 'requests', icon: Bell, label: 'Solicitudes', clearFriend: true },
];

/**
 * Links de navegación principal (Navbar).
 */
export const NAV_LINKS = [
    { to: '/', icon: Home, label: 'Inicio', requiresAuth: false },
    { to: '/chat', icon: MessageSquare, label: 'Chat', requiresAuth: true },
];

/**
 * Textos animados usados en TextType.
 */
export const TEXTTYPE_TEXTS = {
    landing: ['Conversa', 'Comunicate', 'Diviertete'],
    auth: ['Tu Espacio', 'Tu Comunidad', 'Tu Chat'],
};

/**
 * Tarjetas de características para la sección de Landing.
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
 * Burbujas de chat del mockup en Landing.
 */
export const MOCKUP_BUBBLES = [
    { side: 'left', text: '¡Hola! 👋 Mira este nuevo post...' },
    { side: 'right', text: '¡Increíble! Me encanta el diseño 🚀' },
    { side: 'left', text: 'Emojis y más integrados 🤩✨' },
];

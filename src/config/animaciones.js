/**
 * Configuraciones de animación reutilizables (Framer Motion).
 * Centralizar aquí evita repetir los mismos valores en cada componente JSX.
 */

// Variantes de entrada y salida de tabs

export const SLIDE_IN_RIGHT = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

export const SLIDE_IN_LEFT = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const FADE_SCALE_IN = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
};

export const FADE_UP = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
};

export const FADE_SCALE_HERO = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 0.2, duration: 1 },
};

// Animación de apertura/cierre de comentarios
export const EXPAND_HEIGHT = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
};

// ── Configuración de TextType ─────────────────────────────────────────────────
export const TEXTTYPE_BASE = {
    typingSpeed: 75,
    deletingSpeed: 50,
    pauseDuration: 1500,
    showCursor: true,
    cursorCharacter: '_',
    cursorBlinkDuration: 0.5,
};

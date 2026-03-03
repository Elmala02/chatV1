/**
 * Configuraciones de animación reutilizables (Framer Motion).
 * Centralizar aquí evita repetir los mismos valores en cada componente JSX.
 */

// ── Variantes de entrada/salida de tabs ─────────────────────────────────────

/** Desplazamiento desde la derecha (usado para entrar a nuevas secciones) */
export const SLIDE_IN_RIGHT = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

/** Desplazamiento desde la izquierda (usado para transiciones inversas) */
export const SLIDE_IN_LEFT = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

/** Aparece escalando desde el centro (usado para modales y cards) */
export const FADE_SCALE_IN = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
};

/** Aparece subiendo desde abajo (usado para secciones del Hero) */
export const FADE_UP = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
};

/** Efecto de escalado suave para imágenes del Hero */
export const FADE_SCALE_HERO = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 0.2, duration: 1 },
};

/** Animación de acordeón para abrir/cerrar secciones de altura variable (ej. comentarios) */
export const EXPAND_HEIGHT = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
};

// ── Configuración por defecto para el componente TextType ────────────────────────

/** Parámetros base para el efecto de escritura */
export const TEXTTYPE_BASE = {
    typingSpeed: 75,       // Velocidad de escritura
    deletingSpeed: 50,     // Velocidad de borrado
    pauseDuration: 1500,   // Pausa antes de borrar o pasar a la siguiente frase
    showCursor: true,      // Mostrar el cursor (_)
    cursorCharacter: '_',  // El carácter del cursor
    cursorBlinkDuration: 0.5, // Velocidad del parpadeo
};

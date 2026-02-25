/**
 * Configuración de temas para el componente Balatro (fondo animado).
 * Separado del JSX para mantener la vista limpia (patrón MVC).
 */

export const BALATRO_LIGHT = {
    isRotate: true,
    mouseInteraction: true,
    pixelFilter: 2000,
    color1: '#ffffff',
    color2: '#3600b3',
    color3: '#162325',
};

export const BALATRO_DARK = {
    isRotate: false,
    mouseInteraction: true,
    pixelFilter: 2000,
    color1: '#000738',
    spinRotation: -2,
    spinSpeed: 7,
    color2: '#006BB4',
    color3: '#162325',
    contrast: 3.5,
    lighting: 0.4,
    spinAmount: 0.25,
};

/**
 * Devuelve la configuración de Balatro según el tema activo.
 * @param {'light' | 'dark'} theme
 * @returns {object} props para el componente Balatro
 */
export const getBalatraConfig = (theme) =>
    theme === 'light' ? BALATRO_LIGHT : BALATRO_DARK;

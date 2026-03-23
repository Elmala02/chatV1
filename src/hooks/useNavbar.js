import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para la lógica del Navbar.
 * Encapsula el efecto de scroll (shrink on scroll) y la lógica visual del navbar.
 *
 * @returns {Object} Estado del navbar.
 */
export const useNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    /**
     * Detecta si el usuario ha hecho scroll más allá de un umbral
     * para aplicar un estilo visual diferente al navbar.
     */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return {
        scrolled,
    };
};

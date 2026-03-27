import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/useApp';

/**
 * Hook personalizado para la lógica de notificaciones.
 * Encapsula el filtrado, conteo de no leídas, toggle del dropdown
 * y el cierre automático al hacer click fuera.
 *
 * @returns {Object} Estado y handlers de notificaciones.
 */
export const useNotifications = () => {
    const { user, notifications, markNotificationsRead } = useApp();
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    /**
     * Filtra las notificaciones del usuario actual.
     */
    const myNotifications = useMemo(
        () => notifications.filter(n => n.targetId === user?.id),
        [notifications, user?.id]
    );

    /**
     * Conteo de notificaciones no leídas para el badge.
     */
    const unreadCount = useMemo(
        () => myNotifications.filter(n => !n.read).length,
        [myNotifications]
    );

    /**
     * Cierra el dropdown al hacer click fuera del componente.
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Alterna la visibilidad del panel de notificaciones.
     * Al abrir, marca las notificaciones como leídas si hay pendientes.
     */
    const handleToggleNotif = useCallback(() => {
        if (!showNotif && unreadCount > 0) {
            markNotificationsRead();
        }
        setShowNotif(prev => !prev);
    }, [showNotif, unreadCount, markNotificationsRead]);

    /**
     * Cierra el panel de notificaciones manualmente.
     */
    const closeNotifications = useCallback(() => {
        setShowNotif(false);
    }, []);

    return {
        // Estado
        showNotif,
        myNotifications,
        unreadCount,
        notifRef,

        // Handlers
        handleToggleNotif,
        closeNotifications,
    };
};

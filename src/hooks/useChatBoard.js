import { useState, useCallback } from 'react';

/**
 * Hook personalizado para la lógica de navegación del ChatBoard.
 * Encapsula la pestaña activa, el amigo seleccionado y las transiciones de UI.
 *
 * @param {string} initialTab - Pestaña inicial activa ('chat', 'blog', 'private', 'users', 'requests').
 * @returns {Object} Estado y handlers del tablero.
 */
export const useChatBoard = (initialTab = 'chat') => {
    // ── Pestaña activa ──
    const [activeTab, setActiveTab] = useState(initialTab);

    // ── Amigo seleccionado para chat privado ──
    const [selectedFriend, setSelectedFriend] = useState(null);

    /**
     * Cambia la pestaña activa del sidebar.
     * Opcionalmente limpia el amigo seleccionado (para evitar solapamiento visual).
     * @param {string} tab - ID de la pestaña.
     * @param {boolean} clearFriend - Si es true, deselecciona el amigo actual.
     */
    const handleTabChange = useCallback((tab, clearFriend) => {
        setActiveTab(tab);
        if (clearFriend) setSelectedFriend(null);
    }, []);

    /**
     * Selecciona un amigo para iniciar un chat privado.
     * @param {Object} friend - Objeto del amigo seleccionado.
     */
    const selectFriend = useCallback((friend) => {
        setSelectedFriend(friend);
    }, []);

    /**
     * Cierra el chat privado actual y vuelve al listado.
     */
    const clearSelectedFriend = useCallback(() => {
        setSelectedFriend(null);
    }, []);

    return {
        // Estado
        activeTab,
        selectedFriend,

        // Handlers
        handleTabChange,
        selectFriend,
        clearSelectedFriend,
    };
};

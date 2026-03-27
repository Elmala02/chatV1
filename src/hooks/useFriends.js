import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/useApp';

/**
 * Hook personalizado para la lógica de amigos, solicitudes y búsqueda de usuarios.
 * Encapsula el filtrado, búsqueda, envío/aceptación de solicitudes.
 *
 * @returns {Object} Estado y handlers de amigos/solicitudes.
 */
export const useFriends = () => {
    const { user, registeredUsers, sendRequest, acceptRequest } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Usuarios filtrados: excluye al usuario actual y aplica búsqueda.
     */
    const filteredUsers = useMemo(
        () =>
            registeredUsers.filter(
                u =>
                    u.id !== user?.id &&
                    u.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [registeredUsers, user?.id, searchTerm]
    );

    /**
     * Lista de amigos del usuario actual.
     */
    const myFriends = useMemo(
        () => registeredUsers.filter(u => user?.friends?.includes(u.id)),
        [registeredUsers, user?.friends]
    );

    /**
     * Solicitudes de amistad recibidas (excluye a quienes ya son amigos).
     */
    const receivedRequests = useMemo(
        () =>
            registeredUsers.filter(
                u =>
                    user?.requests?.includes(u.id) &&
                    !user?.friends?.includes(u.id)
            ),
        [registeredUsers, user?.requests, user?.friends]
    );

    /**
     * Verifica si un usuario ya es amigo del usuario actual.
     * @param {number|string} userId - ID del usuario a verificar.
     * @returns {boolean}
     */
    const isFriend = useCallback(
        (userId) => user?.friends?.includes(userId) ?? false,
        [user?.friends]
    );

    /**
     * Verifica si ya se envió una solicitud a un usuario.
     * @param {Object} targetUser - Objeto del usuario destino.
     * @returns {boolean}
     */
    const hasSentRequest = useCallback(
        (targetUser) => targetUser?.requests?.includes(user?.id) ?? false,
        [user?.id]
    );

    /**
     * Envía una solicitud de amistad.
     * @param {number|string} targetId - ID del usuario destino.
     */
    const handleSendRequest = useCallback(
        (targetId) => sendRequest(targetId),
        [sendRequest]
    );

    /**
     * Acepta una solicitud de amistad recibida.
     * @param {number|string} requestId - ID del usuario que envió la solicitud.
     */
    const handleAcceptRequest = useCallback(
        (requestId) => acceptRequest(requestId),
        [acceptRequest]
    );

    /**
     * Actualiza el término de búsqueda.
     * @param {string} term - Nuevo término de búsqueda.
     */
    const updateSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    return {
        // Estado
        searchTerm,
        filteredUsers,
        myFriends,
        receivedRequests,

        // Helpers
        isFriend,
        hasSentRequest,

        // Handlers
        updateSearch,
        handleSendRequest,
        handleAcceptRequest,
    };
};

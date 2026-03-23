import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Hook personalizado para la lógica del chat privado.
 * Encapsula el envío de mensajes, auto-scroll y generación de sala.
 *
 * @param {Object} friend - Objeto del amigo con el que se chatea.
 * @returns {Object} Estado y handlers del chat privado.
 */
export const usePrivateChat = (friend) => {
    const { user, privateMessages, sendPrivateMessage } = useApp();
    const [text, setText] = useState('');
    const scrollRef = useRef(null);

    /**
     * Genera un identificador de sala único basado en los IDs de ambos usuarios.
     * Se ordena para garantizar consistencia sin importar quién inicia el chat.
     */
    const room = useMemo(
        () => [user.id, friend.id].sort().join('_'),
        [user.id, friend.id]
    );

    /**
     * Mensajes de la sala actual.
     */
    const messages = useMemo(
        () => privateMessages[room] || [],
        [privateMessages, room]
    );

    /**
     * Auto-scroll al final cuando cambian los mensajes.
     */
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    /**
     * Maneja el envío de un mensaje privado.
     * @param {Event} e - Evento del formulario.
     */
    const handleSend = useCallback((e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendPrivateMessage(friend.id, text);
        setText('');
    }, [text, friend.id, sendPrivateMessage]);

    return {
        // Estado
        text,
        messages,
        scrollRef,

        // Handlers
        setText,
        handleSend,
    };
};

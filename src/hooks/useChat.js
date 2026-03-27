import { useState, useCallback, useMemo } from 'react';
import { useApp } from '../context/useApp';

/**
 * Hook personalizado para la lógica del chat global y blog social.
 * Encapsula la creación de posts, likes, comentarios y el manejo del UI state.
 *
 * @returns {Object} Estado y handlers del chat/blog.
 */
export const useChat = () => {
    const { user, messages, addPost, likePost, addComment } = useApp();

    // ── Estado del mensaje en proceso ──
    const [newMessage, setNewMessage] = useState('');

    // ── Estado de la sección de comentarios (expandido/colapsado) ──
    const [activeComments, setActiveComments] = useState({});

    // ── Estado de los inputs de comentarios por post ──
    const [commentText, setCommentText] = useState({});

    /**
     * Mensajes en orden inverso para el feed del blog (más reciente primero).
     */
    const reversedMessages = useMemo(
        () => [...messages].reverse(),
        [messages]
    );

    /**
     * Maneja el envío de un nuevo post/mensaje global.
     * @param {Event} e - Evento del formulario.
     */
    const handleSendPost = useCallback((e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        addPost(newMessage);
        setNewMessage('');
    }, [newMessage, addPost]);

    /**
     * Maneja el envío de un comentario en un post específico.
     * @param {Event} e - Evento del formulario.
     * @param {number|string} postId - ID del post.
     */
    const handleSendComment = useCallback((e, postId) => {
        e.preventDefault();
        const text = commentText[postId];
        if (!text?.trim()) return;
        addComment(postId, text);
        setCommentText(prev => ({ ...prev, [postId]: '' }));
    }, [commentText, addComment]);

    /**
     * Alterna la visibilidad de los comentarios en un post.
     * @param {number|string} postId - ID del post.
     */
    const toggleComments = useCallback((postId) => {
        setActiveComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    }, []);

    /**
     * Actualiza el texto del input de comentario para un post específico.
     * @param {number|string} postId - ID del post.
     * @param {string} value - Texto del comentario.
     */
    const updateCommentText = useCallback((postId, value) => {
        setCommentText(prev => ({ ...prev, [postId]: value }));
    }, []);

    /**
     * Verifica si el usuario actual ha dado like a un post.
     * @param {Object} post - Objeto del post.
     * @returns {boolean} True si el usuario actual le dio like.
     */
    const isLikedByUser = useCallback((post) => {
        return post.likes?.some(id => String(id) === String(user?.id));
    }, [user?.id]);

    return {
        // Estado
        messages,
        reversedMessages,
        newMessage,
        activeComments,
        commentText,

        // Handlers
        setNewMessage,
        handleSendPost,
        handleSendComment,
        toggleComments,
        updateCommentText,
        likePost,
        isLikedByUser,
    };
};

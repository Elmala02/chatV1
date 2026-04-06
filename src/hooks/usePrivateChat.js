import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../context/useApp';

export const usePrivateChat = (friend) => {
    const { user, privateMessages, sendPrivateMessage, loadPrivateChat } = useApp();
    const [text, setText] = useState('');
    const scrollRef = useRef(null);

    // Cargar historial al montar si está vacío
    useEffect(() => {
        if (friend && friend.id) {
            loadPrivateChat(friend.id);
        }
    }, [friend, loadPrivateChat]);

    const messages = useMemo(
        () => privateMessages[friend.id] || [],
        [privateMessages, friend.id]
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = useCallback((e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendPrivateMessage(friend.id, text);
        setText('');
    }, [text, friend.id, sendPrivateMessage]);

    return {
        text, messages, scrollRef, setText, handleSend,
    };
};

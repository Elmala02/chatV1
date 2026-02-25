import { useState, useEffect } from 'react';

export const usePrivateChat = (user, addNotification) => {
    const [privateMessages, setPrivateMessages] = useState(
        JSON.parse(localStorage.getItem('privateMessages')) || {}
    );

    useEffect(() => {
        localStorage.setItem('privateMessages', JSON.stringify(privateMessages));
    }, [privateMessages]);

    const sendPrivateMessage = (targetId, text) => {
        if (!user) return;
        const room = [user.id, targetId].sort().join('_');
        const newMessage = {
            id: Date.now(),
            senderId: user.id,
            senderName: user.name,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setPrivateMessages(prev => ({
            ...prev,
            [room]: [...(prev[room] || []), newMessage]
        }));

        addNotification(targetId, {
            type: 'message',
            from: user.name,
            message: 'te envió un mensaje privado'
        });
    };

    return { privateMessages, sendPrivateMessage };
};

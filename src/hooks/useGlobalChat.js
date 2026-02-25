import { useState, useEffect } from 'react';

export const useGlobalChat = (user, addNotification) => {
    const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const addPost = (text) => {
        if (!user) return;
        const msg = {
            id: Date.now(),
            sender: user.name,
            senderId: user.id,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            likes: [],
            comments: []
        };
        setMessages(prev => [...prev, msg]);
    };

    const likePost = (postId) => {
        if (!user) return;
        setMessages(prev => prev.map(msg => {
            if (msg.id === postId) {
                const currentLikes = msg.likes || [];
                const isLiked = currentLikes.some(id => String(id) === String(user.id));
                const updatedLikes = isLiked
                    ? currentLikes.filter(id => String(id) !== String(user.id))
                    : [...currentLikes, user.id];

                if (!isLiked && String(msg.senderId) !== String(user.id)) {
                    addNotification(msg.senderId, {
                        type: 'like',
                        from: user.name,
                        message: 'le dio me gusta a tu post'
                    });
                }
                return { ...msg, likes: updatedLikes };
            }
            return msg;
        }));
    };

    const addComment = (postId, commentText) => {
        if (!user) return;
        setMessages(prev => prev.map(msg => {
            if (msg.id === postId) {
                const newComment = {
                    id: Date.now(),
                    userId: user.id,
                    userName: user.name,
                    text: commentText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                if (msg.senderId !== user.id) {
                    addNotification(msg.senderId, {
                        type: 'comment',
                        from: user.name,
                        message: 'comentó tu post'
                    });
                }
                return { ...msg, comments: [...(msg.comments || []), newComment] };
            }
            return msg;
        }));
    };

    return { messages, addPost, likePost, addComment };
};

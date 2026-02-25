import { useState, useEffect } from 'react';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState(
        JSON.parse(localStorage.getItem('notifications')) || []
    );

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (targetId, notification) => {
        const newNotif = {
            id: Date.now(),
            targetId,
            read: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...notification
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationsRead = (userId) => {
        setNotifications(prev => prev.map(n => n.targetId === userId ? { ...n, read: true } : n));
    };

    return { notifications, addNotification, markNotificationsRead };
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Theme State
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Auth State
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);
    const [registeredUsers, setRegisteredUsers] = useState(
        JSON.parse(localStorage.getItem('users')) || []
    );

    // Global Messages (for Blog/Chat)
    const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);

    // Notifications
    const [notifications, setNotifications] = useState(
        JSON.parse(localStorage.getItem('notifications')) || []
    );

    // Private Messages State: { 'userId1_userId2': [msg1, msg2...] }
    const [privateMessages, setPrivateMessages] = useState(
        JSON.parse(localStorage.getItem('privateMessages')) || {}
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(registeredUsers));
        if (user) {
            const updatedCurrentUser = registeredUsers.find(u => u.id === user.id);
            if (updatedCurrentUser) {
                setUser(updatedCurrentUser);
                localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
            }
        }
    }, [registeredUsers]);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('privateMessages', JSON.stringify(privateMessages));
    }, [privateMessages]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const registerUser = (userData) => {
        const newUser = {
            ...userData,
            id: Date.now(),
            requests: [],
            friends: [],
            avatar: userData.name[0].toUpperCase()
        };
        const updatedUsers = [...registeredUsers, newUser];
        setRegisteredUsers(updatedUsers);
        loginUser(userData.email, userData.password);
    };

    const loginUser = (email, password) => {
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

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

    const markNotificationsRead = () => {
        setNotifications(prev => prev.map(n => n.targetId === user?.id ? { ...n, read: true } : n));
    };

    const sendRequest = (targetId) => {
        if (!user) return;
        const updatedUsers = registeredUsers.map(u => {
            if (u.id === targetId) {
                if (!u.requests.includes(user.id)) {
                    addNotification(targetId, {
                        type: 'friend_request',
                        from: user.name,
                        message: 'te ha enviado una solicitud de amistad'
                    });
                    return { ...u, requests: [...u.requests, user.id] };
                }
            }
            return u;
        });
        setRegisteredUsers(updatedUsers);
    };

    const acceptRequest = (requestId) => {
        if (!user) return;
        const updatedUsers = registeredUsers.map(u => {
            if (u.id === user.id) {
                return {
                    ...u,
                    friends: [...u.friends, requestId],
                    requests: u.requests.filter(id => id !== requestId)
                };
            }
            if (u.id === requestId) {
                addNotification(requestId, {
                    type: 'request_accepted',
                    from: user.name,
                    message: 'ha aceptado tu solicitud de amistad'
                });
                return {
                    ...u,
                    friends: [...u.friends, user.id]
                };
            }
            return u;
        });
        setRegisteredUsers(updatedUsers);
    };

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

    return (
        <AppContext.Provider value={{
            theme, toggleTheme,
            user, registeredUsers,
            messages, addPost, likePost, addComment,
            notifications, markNotificationsRead,
            privateMessages, sendPrivateMessage,
            registerUser, loginUser, logoutUser,
            sendRequest, acceptRequest
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);

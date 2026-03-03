import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto global de la aplicación.
 * Maneja el estado de autenticación, mensajes, notificaciones y tema.
 */
const AppContext = createContext();

/**
 * Proveedor del contexto de la aplicación.
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos.
 */
export const AppProvider = ({ children }) => {
    // Estado del Tema: Almacena 'light' o 'dark'. Se inicializa desde localStorage o por defecto 'dark'.
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Estado de Autenticación: Almacena el objeto del usuario actual logueado.
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);

    // Lista de Usuarios Registrados: Mímica de una base de datos local de usuarios.
    const [registeredUsers, setRegisteredUsers] = useState(
        JSON.parse(localStorage.getItem('users')) || []
    );

    // Mensajes Globales: Almacena las publicaciones del blog y del chat global.
    const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);

    // Notificaciones: Almacena eventos como likes, comentarios y solicitudes de amistad.
    const [notifications, setNotifications] = useState(
        JSON.parse(localStorage.getItem('notifications')) || []
    );

    // Estado de Mensajes Privados: Objeto donde las llaves son salas (IDs combinados) y los valores son arrays de mensajes.
    const [privateMessages, setPrivateMessages] = useState(
        JSON.parse(localStorage.getItem('privateMessages')) || {}
    );

    // Efecto para aplicar el tema al documento y guardarlo en localStorage.
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Efecto para persistir usuarios registrados y actualizar los datos del usuario actual si cambian.
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

    // Efecto para persistir mensajes globales.
    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    // Efecto para persistir notificaciones.
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Efecto para persistir mensajes privados.
    useEffect(() => {
        localStorage.setItem('privateMessages', JSON.stringify(privateMessages));
    }, [privateMessages]);

    /**
     * Alterna entre los temas 'light' y 'dark'.
     */
    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    /**
     * Registra un nuevo usuario en el sistema.
     * @param {Object} userData - Datos del usuario (nombre, email, password).
     */
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

    /**
     * Inicia sesión con las credenciales proporcionadas.
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {boolean} True si el login fue exitoso, False en caso contrario.
     */
    const loginUser = (email, password) => {
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    /**
     * Cierra la sesión del usuario actual.
     */
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    /**
     * Añade una notificación a un usuario específico.
     * @param {number|string} targetId - ID del usuario destinatario.
     * @param {Object} notification - Objeto de notificación (tipo, origen, mensaje).
     */
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

    /**
     * Marca todas las notificaciones del usuario actual como leídas.
     */
    const markNotificationsRead = () => {
        setNotifications(prev => prev.map(n => n.targetId === user?.id ? { ...n, read: true } : n));
    };

    /**
     * Envía una solicitud de amistad a otro usuario.
     * @param {number|string} targetId - ID del usuario destinatario.
     */
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

    /**
     * Acepta una solicitud de amistad de un usuario.
     * @param {number|string} requestId - ID del usuario que envió la solicitud.
     */
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

    /**
     * Añade una nueva publicación (post) al muro global.
     * @param {string} text - Contenido del post.
     */
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

    /**
     * Alterna un 'like' en un post específico.
     * @param {number|string} postId - ID del post.
     */
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

    /**
     * Añade un comentario a un post específico.
     * @param {number|string} postId - ID del post.
     * @param {string} commentText - Texto del comentario.
     */
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

    /**
     * Envía un mensaje privado a otro usuario.
     * @param {number|string} targetId - ID del destinatario.
     * @param {string} text - Contenido del mensaje.
     */
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

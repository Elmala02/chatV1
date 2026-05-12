import { useEffect, useState, useCallback } from 'react';
import { AppContext } from './appContext';
import { io } from 'socket.io-client';
import api from '../config/api';

const SOCKET_URL = 'http://opm-env.eba-ywfhqwtf.us-east-1.elasticbeanstalk.com';
let socket;

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [user, setUser] = useState(null);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [privateMessages, setPrivateMessages] = useState({});

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    // --- AUTENTICACIÓN Y CARGA INICIAL ---

    const loadInitialData = async () => {
        try {
            const [usersRes, postsRes, notifRes] = await Promise.all([
                api.get('/users'),
                api.get('/blog/posts'),
                api.get('/notifications')
            ]);
            setRegisteredUsers(usersRes.data);
            setMessages(postsRes.data);
            setNotifications(notifRes.data);
        } catch (_error) {
            console.error("Error cargando datos", _error);
        }
    };

    // Función auxiliar para leer cookies (puede replicarse)
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            api.get('/auth/me').then(res => {
                setUser(res.data.user);
                loadInitialData();
            }).catch(() => {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            });
        }
    }, []);

    // --- SOCKET IO HANDLERS ---

    const setupSocket = useCallback(() => {
        const token = getCookie('token');
        if (!token) return;

        socket = io(SOCKET_URL, {
            extraHeaders: { Authorization: `Bearer ${token}` },
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            socket.emit('identify', { token });
        });

        socket.on('new_post', (post) => {
            setMessages(prev => {
                if (prev.some(p => p.id === post.id)) return prev;
                return [post, ...prev];
            });
        });

        socket.on('new_comment', (data) => {
            setMessages(prev => prev.map(msg => {
                if (String(msg.id) === String(data.postId)) {
                    const exists = (msg.comments || []).some(c => c.id === data.comment.id);
                    if (exists) return msg;
                    return { ...msg, comments: [...(msg.comments || []), data.comment] };
                }
                return msg;
            }));
        });

        socket.on('update_post_likes', (data) => {
            setMessages(prev => prev.map(msg => {
                if (String(msg.id) === String(data.postId)) {
                    // Solo actualizamos de forma "segura" si no es mi propio like
                    // (el mío ya se aplicó instantáneamente de forma optimista)
                    return { ...msg, likes: data.likes };
                }
                return msg;
            }));
        });

        socket.on('notification', (notif) => {
            const newNotif = {
                id: crypto.randomUUID(), read: false, ...notif
            };
            setNotifications(prev => [newNotif, ...prev]);

            if (notif.type === 'friend_request' || notif.type === 'request_accepted') {
                api.get('/auth/me').then(res => setUser(res.data.user));
            }
        });

        socket.on('receive_private_message', (msg) => {
            setPrivateMessages(prev => {
                const isMyMessage = String(msg.senderId) === String(user?.id);
                const chatKey = isMyMessage ? msg.targetId : msg.senderId;

                const existingChat = prev[chatKey] || [];
                if (existingChat.some(m => m.id === msg.id)) return prev;

                return {
                    ...prev,
                    [chatKey]: [...existingChat, msg]
                };
            });
        });

    }, [user?.id]);

    useEffect(() => {
        if (user) setupSocket();
        return () => {
            if (socket) socket.disconnect();
        };
    }, [user, setupSocket]);

    // --- ACCIONES DE AUTENTICACIÓN ---

    const registerUser = async (userData) => {
        const res = await api.post('/auth/register', userData);
        // Expiración de 7 días igual que en el backend
        document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        setUser(res.data.user);
        // Cargar datos en background para no bloquear el flujo de UI inicial
        loadInitialData();
        return true;
    };

    const loginUser = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        setUser(res.data.user);
        // Cargar datos en background para que el redirect a /chat sea instantáneo
        loadInitialData();
        return true;
    };

    const logoutUser = () => {
        setUser(null);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (socket) socket.disconnect();
    };

    // --- ACCIONES SOCIALES Y DE CHAT ---

    const markNotificationsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await api.post('/notifications/read');
        } catch (_err) {
            console.log("No se pudo marcar leido en DB", _err);
        }
    };

    const sendRequest = async (targetId) => {
        try {
            await api.post('/friends/request', { targetId });
        } catch (_err) {
            console.log("Solicitud duplicada o inválida", _err);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await api.post('/friends/accept', { requestId });
            // Refrescar usuario de forma sincrónica para actualizar friends y requests
            const meRes = await api.get('/auth/me');
            setUser(meRes.data.user);
            // También refrescar lista de usuarios para actualizar hasSentRequest
            const usersRes = await api.get('/users');
            setRegisteredUsers(usersRes.data);
        } catch (_err) {
            console.log("No se pudo aceptar la solicitud.", _err);
        }
    };

    const addPost = async (text) => {
        try {
            await api.post('/blog/post', { text });
        } catch (_err) {
            console.log("Error al publicar post", _err);
        }
    };

    const likePost = async (postId) => {
        try {
            setMessages(prev => prev.map(msg => {
                if (String(msg.id) === String(postId)) {
                    const isLiked = (msg.likes || []).some(id => String(id) === String(user.id));
                    const updatedLikes = isLiked
                        ? (msg.likes || []).filter(id => String(id) !== String(user.id))
                        : [...(msg.likes || []), user.id];
                    return { ...msg, likes: updatedLikes };
                }
                return msg;
            }));
            await api.post('/blog/like', { postId });
        } catch (_err) {
            console.log("Error al dar like", _err);
        }
    };

    const addComment = async (postId, commentText) => {
        try {
            await api.post('/blog/comment', { postId, text: commentText });
        } catch (_err) {
            console.log("Error al comentar", _err);
        }
    };

    const loadPrivateChat = async (friendId) => {
        try {
            const res = await api.get(`/chat/private/${friendId}`);
            setPrivateMessages(prev => ({
                ...prev,
                [friendId]: res.data.messages || []
            }));
        } catch (_err) {
            console.log("Error al cargar chat privado", _err);
        }
    };

    const sendPrivateMessage = (targetId, text) => {
        if (!socket) return;
        const token = getCookie('token');

        const tempId = Date.now();
        const newMessage = {
            id: tempId,
            senderId: user.id,
            senderName: user.name,
            text: text,
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        setPrivateMessages(prev => ({
            ...prev,
            [targetId]: [...(prev[targetId] || []), newMessage]
        }));

        socket.emit('send_private_message', { token, friendId: targetId, text });
    };

    return (
        <AppContext.Provider value={{
            theme, toggleTheme,
            user, registeredUsers,
            messages, addPost, likePost, addComment,
            notifications, markNotificationsRead,
            privateMessages, sendPrivateMessage, loadPrivateChat,
            registerUser, loginUser, logoutUser,
            sendRequest, acceptRequest,
            socket, loadInitialData
        }}>
            {children}
        </AppContext.Provider>
    );
};
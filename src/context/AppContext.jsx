import { useEffect, useState, useCallback } from 'react';
import { AppContext } from './appContext';
import { io } from 'socket.io-client';
import api from '../config/api';

const SOCKET_URL = 'http://localhost:5000';
let socket;

export const AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [user, setUser] = useState(null);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [privateMessages, setPrivateMessages] = useState({});
    const [socketConnected, setSocketConnected] = useState(false);

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
        } catch (error) {
            console.error("Error cargando datos", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me').then(res => {
                setUser(res.data.user);
                loadInitialData();
            }).catch(() => {
                localStorage.removeItem('token');
            });
        }
    }, []);

    // --- SOCKET IO HANDLERS ---

    const setupSocket = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Se usa STRICTAMENTE polling para evitar el problema interno de Werkzeug 3.0 con WebSockets nativos 
        // y erradicar el molesto mensaje "Invalid frame header" de la consola.
        socket = io(SOCKET_URL, {
            extraHeaders: { Authorization: `Bearer ${token}` },
            transports: ['polling']  // <-- ESTE ES EL ARREGLO ESTRICTO
        });

        socket.on('connect', () => {
            setSocketConnected(true);
            socket.emit('identify', { token });
        });

        socket.on('disconnect', () => {
             setSocketConnected(false);
        });

        socket.on('new_post', (post) => {
            setMessages(prev => {
                // Evitar duplicados si quien lo mandó ya lo agregó optimisticamente
                if (prev.some(p => p.id === post.id)) return prev;
                return [post, ...prev];
            });
        });

        socket.on('new_comment', (data) => {
            setMessages(prev => prev.map(msg => {
                if (msg.id === data.postId) {
                    const exists = (msg.comments || []).some(c => c.id === data.comment.id);
                    if (exists) return msg;
                    return { ...msg, comments: [...(msg.comments || []), data.comment] };
                }
                return msg;
            }));
        });

        socket.on('notification', (notif) => {
            const newNotif = {
                id: crypto.randomUUID(), read: false, ...notif
            };
            setNotifications(prev => [newNotif, ...prev]);
            
            // Refrescar al usuario si hay temas de amistad
            if (notif.type === 'friend_request' || notif.type === 'request_accepted') {
                api.get('/auth/me').then(res => setUser(res.data.user));
            }
        });

        socket.on('receive_private_message', (msg) => {
            setPrivateMessages(prev => {
                const isMyMessage = msg.senderId === user?.id;
                const chatKey = isMyMessage ? msg.targetId : msg.senderId; // El arreglo de chat corresponde a esa persona
                
                const existingChat = prev[chatKey] || [];
                if (existingChat.some(m => m.id === msg.id)) return prev; // Evitar duplicar
                
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
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        await loadInitialData();
        return true;
    };

    const loginUser = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            await loadInitialData();
            return true;
        } catch (error) {
            return false;
        }
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token');
        if (socket) socket.disconnect();
    };

    // --- ACCIONES SOCIALES Y DE CHAT ---

    const markNotificationsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        try {
            await api.post('/notifications/read');
        } catch(err) {
            console.log("No se pudo marcar leido en DB");
        }
    };

    const sendRequest = async (targetId) => {
        try {
            await api.post('/friends/request', { targetId });
        } catch (err) {
            console.log("Solicitud duplicada o inválida, ignorada visualmente.");
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await api.post('/friends/accept', { requestId });
            api.get('/auth/me').then(res => setUser(res.data.user)); // Refresh usuario
        } catch (err) {
            console.log("No se pudo aceptar la solicitud.", err);
        }
    };

    const addPost = async (text) => {
        try {
            // Actualización optimista veloz para no sentir lag
            const tempId = Date.now();
            const tempPost = {
                id: tempId, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: user.name, senderId: user.id, likes: [], comments: []
            };
            setMessages(prev => [tempPost, ...prev]);

            await api.post('/blog/post', { text });
            // El socket enviará el real y sobreescribiremos o lo dejaremos así
        } catch (err) {
            console.log("Error al publicar post", err);
        }
    };

    const likePost = async (postId) => {
        try {
            // Actualización optimista veloz
            setMessages(prev => prev.map(msg => {
                if (msg.id === postId) {
                    const isLiked = (msg.likes || []).includes(user.id);
                    const updatedLikes = isLiked 
                        ? (msg.likes || []).filter(id => id !== user.id)
                        : [...(msg.likes || []), user.id];
                    return { ...msg, likes: updatedLikes };
                }
                return msg;
            }));

            await api.post('/blog/like', { postId });
        } catch (err) {
            console.log("Error al dar like", err);
        }
    };

    const addComment = async (postId, commentText) => {
        try {
            const res = await api.post('/blog/comment', { postId, text: commentText });
             // La respuesta real o el socket actualiza, pero si queremos optimismo puro lo agregamos:
            // Por consistencia, dejemos que llegue por socket para evitar id conflictos (tarda <200ms igual)
        } catch (err) {
            console.log("Error al comentar", err);
        }
    };

    const loadPrivateChat = async (friendId) => {
        try {
            const res = await api.get(`/chat/private/${friendId}`);
            setPrivateMessages(prev => ({
                ...prev,
                [friendId]: res.data.messages || []
            }));
        } catch (err) {
            console.log("Error al cargar chat privado", err);
        }
    };

    const sendPrivateMessage = (targetId, text) => {
        if (!socket) return;
        const token = localStorage.getItem('token');
        
        // UI Optimistico inmediato
        const tempId = Date.now();
        const newMessage = {
            id: tempId, senderId: user.id, senderName: user.name, text: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

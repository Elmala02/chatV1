import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import { useGlobalChat } from '../hooks/useGlobalChat';
import { usePrivateChat } from '../hooks/usePrivateChat';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const { notifications, addNotification, markNotificationsRead } = useNotifications();
    const {
        user, registeredUsers, registerUser, loginUser, logoutUser, sendRequest, acceptRequest
    } = useAuth(addNotification);
    const { messages, addPost, likePost, addComment } = useGlobalChat(user, addNotification);
    const { privateMessages, sendPrivateMessage } = usePrivateChat(user, addNotification);

    const markNotificationsReadForUser = () => {
        markNotificationsRead(user?.id);
    };

    return (
        <AppContext.Provider value={{
            theme, toggleTheme,
            user, registeredUsers,
            messages, addPost, likePost, addComment,
            notifications, markNotificationsRead: markNotificationsReadForUser,
            privateMessages, sendPrivateMessage,
            registerUser, loginUser, logoutUser,
            sendRequest, acceptRequest
        }}>
            {children}
        </AppContext.Provider>
    );
};

// linea que refresca componentes
export const useApp = () => useContext(AppContext);

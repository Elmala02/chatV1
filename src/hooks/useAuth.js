import { useState, useEffect } from 'react';

export const useAuth = (addNotification) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')) || null);
    const [registeredUsers, setRegisteredUsers] = useState(
        JSON.parse(localStorage.getItem('users')) || []
    );

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(registeredUsers));
        if (user) {
            const updatedCurrentUser = registeredUsers.find(u => u.id === user.id);
            if (updatedCurrentUser) {
                setUser(updatedCurrentUser);
                localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registeredUsers]);

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

        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
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

    return {
        user, registeredUsers, registerUser, loginUser, logoutUser, sendRequest, acceptRequest
    };
};

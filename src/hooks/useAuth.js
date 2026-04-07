import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';

export const useAuth = () => {
    const { loginUser, registerUser, logoutUser, user } = useApp();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateField = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    }, [error]);

    const resetForm = useCallback(() => {
        setFormData({ name: '', email: '', password: '' });
        setError('');
    }, []);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await loginUser(formData.email, formData.password);
            resetForm();
            navigate('/chat');
        } catch (err) {
            // El backend retorna 401 con mensaje, lo mostramos al usuario
            const msg = err?.response?.data?.message;
            setError(msg || 'Credenciales incorrectas');
        } finally {
            setIsLoading(false);
        }
    }, [formData.email, formData.password, loginUser, navigate, resetForm]);

    const handleRegister = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        const { name, email, password } = formData;
        
        if (!name || !email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            await registerUser({ name, email, password });
            resetForm();
            navigate('/chat');
        } catch (err) {
            // El backend retorna 409 si el correo o nickname ya existán
            const msg = err?.response?.data?.message;
            setError(msg || 'El registro falló. El correo o nickname podrían estar en uso.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, registerUser, navigate, resetForm]);

    const handleLogout = useCallback(() => {
        logoutUser();
        navigate('/');
    }, [logoutUser, navigate]);

    return {
        formData, error, isLoading, isAuthenticated: !!user, user,
        updateField, resetForm, handleLogin, handleRegister, handleLogout,
    };
};

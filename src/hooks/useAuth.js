import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/useApp';

/**
 * Hook personalizado para la lógica de autenticación.
 * Encapsula login, registro, validación y navegación post-auth.
 *
 * @returns {Object} Estado y handlers de autenticación.
 */
export const useAuth = () => {
    const { loginUser, registerUser, logoutUser, user } = useApp();
    const navigate = useNavigate();

    // ── Estado del formulario ──
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Actualiza un campo del formulario de forma controlada.
     * @param {string} field - Nombre del campo ('name', 'email', 'password').
     * @param {string} value - Nuevo valor del campo.
     */
    const updateField = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error al empezar a escribir
        if (error) setError('');
    }, [error]);

    /**
     * Resetea todos los campos del formulario y el error.
     */
    const resetForm = useCallback(() => {
        setFormData({ name: '', email: '', password: '' });
        setError('');
    }, []);

    /**
     * Maneja el envío del formulario de login.
     * @param {Event} e - Evento del formulario.
     */
    const handleLogin = useCallback((e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = loginUser(formData.email, formData.password);
            if (success) {
                resetForm();
                navigate('/chat');
            } else {
                setError('Credenciales incorrectas');
            }
        } finally {
            setIsLoading(false);
        }
    }, [formData.email, formData.password, loginUser, navigate, resetForm]);

    /**
     * Maneja el envío del formulario de registro.
     * @param {Event} e - Evento del formulario.
     */
    const handleRegister = useCallback((e) => {
        e.preventDefault();
        setError('');

        const { name, email, password } = formData;
        if (!name || !email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            registerUser({ name, email, password });
            resetForm();
            navigate('/chat');
        } finally {
            setIsLoading(false);
        }
    }, [formData, registerUser, navigate, resetForm]);

    /**
     * Maneja el cierre de sesión y redirige al inicio.
     */
    const handleLogout = useCallback(() => {
        logoutUser();
        navigate('/');
    }, [logoutUser, navigate]);

    return {
        // Estado
        formData,
        error,
        isLoading,
        isAuthenticated: !!user,
        user,

        // Handlers
        updateField,
        resetForm,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};

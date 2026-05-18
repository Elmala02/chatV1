import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://opm-env.eba-ywfhqwtf.us-east-1.elasticbeanstalk.com/api';

const api = axios.create({
    baseURL: API_URL,
});

// Función auxiliar para leer cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Interceptor para inyectar token en headers
api.interceptors.request.use((config) => {
    const token = getCookie('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
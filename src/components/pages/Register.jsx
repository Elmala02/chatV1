import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import '../../styles/components/Register.css';

export default function Register({ onToggleAuth }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { registerUser } = useApp();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }
        registerUser({ name, email, password });
        navigate('/chat');
    };

    return (
        <div className="register-wrapper">
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <User size={20} />
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <Mail size={20} />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <Lock size={20} />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" className="register-submit-btn">
                    Registrarse
                </button>
            </form>

            <p className="toggle-auth">
                ¿Ya tienes cuenta?
                <button onClick={onToggleAuth}>Inicia sesión</button>
            </p>
        </div>
    );
}

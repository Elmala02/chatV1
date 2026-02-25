import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import '../../styles/components/Login.css';

export default function Login({ onToggleAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginUser } = useApp();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const success = loginUser(email, password);
        if (success) {
            navigate('/chat');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-form" onSubmit={handleSubmit}>
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

                <button type="submit" className="login-submit-btn">
                    Iniciar Sesión
                </button>
            </form>

            <p className="toggle-auth">
                ¿No tienes cuenta?
                <button onClick={onToggleAuth}>Regístrate</button>
            </p>
        </div>
    );
}

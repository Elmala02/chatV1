import { useAuth } from '../../hooks';
import { Mail, Lock } from 'lucide-react';
import '../../styles/components/Login.css';

/**
 * Componente de inicio de sesión.
 * Toda la lógica está delegada al hook useAuth.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onToggleAuth - Función para cambiar a la vista de registro.
 */
export default function Login({ onToggleAuth }) {
    const { formData, error, isLoading, updateField, handleLogin } = useAuth();

    return (
        <div className="login-wrapper">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                    <Mail size={20} />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <Lock size={20} />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" className="login-submit-btn" disabled={isLoading}>
                    {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <p className="toggle-auth">
                ¿No tienes cuenta?
                <button onClick={onToggleAuth}>Regístrate</button>
            </p>
        </div>
    );
}

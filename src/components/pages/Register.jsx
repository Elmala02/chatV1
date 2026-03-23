import { useAuth } from '../../hooks';
import { User, Mail, Lock } from 'lucide-react';
import '../../styles/components/Register.css';

/**
 * Componente de registro de usuario.
 * Toda la lógica está delegada al hook useAuth.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onToggleAuth - Función para cambiar a la vista de login.
 */
export default function Register({ onToggleAuth }) {
    const { formData, error, isLoading, updateField, handleRegister } = useAuth();

    return (
        <div className="register-wrapper">
            <form className="register-form" onSubmit={handleRegister}>
                <div className="input-group">
                    <User size={20} />
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                </div>
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

                <button type="submit" className="register-submit-btn" disabled={isLoading}>
                    {isLoading ? 'Cargando...' : 'Registrarse'}
                </button>
            </form>

            <p className="toggle-auth">
                ¿Ya tienes cuenta?
                <button onClick={onToggleAuth}>Inicia sesión</button>
            </p>
        </div>
    );
}

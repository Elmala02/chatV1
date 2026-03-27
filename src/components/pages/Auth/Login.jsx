import { useAuth } from '../../../hooks';
import { Mail, Lock } from 'lucide-react';
import { InputGroup } from '../../common';
import '../../../styles/components/pages/Auth/Login.css';

/**
 * Componente de inicio de sesión.
 * Usa el componente InputGroup reutilizable.
 * @param {Object} props
 * @param {Function} props.onToggleAuth - Función para cambiar a la vista de registro.
 */
export default function Login({ onToggleAuth }) {
  const { formData, error, isLoading, updateField, handleLogin } = useAuth();

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <InputGroup
          icon={Mail}
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          required
        />
        <InputGroup
          icon={Lock}
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          required
        />

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

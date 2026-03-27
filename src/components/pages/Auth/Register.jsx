import { useAuth } from '../../../hooks';
import { User, Mail, Lock } from 'lucide-react';
import { InputGroup } from '../../common';
import '../../../styles/components/pages/Auth/Register.css';

/**
 * Componente de registro de usuario.
 * Usa el componente InputGroup reutilizable.
 * @param {Object} props
 * @param {Function} props.onToggleAuth - Función para cambiar a la vista de login.
 */
export default function Register({ onToggleAuth }) {
  const { formData, error, isLoading, updateField, handleRegister } = useAuth();

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleRegister}>
        <InputGroup
          icon={User}
          type="text"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />
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

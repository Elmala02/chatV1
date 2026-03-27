import Avatar from '../Avatar';
import '../../../styles/components/common/UserCard.css';

/**
 * Tarjeta reutilizable de usuario.
 * Se usa en: lista de amigos, descubrir usuarios, solicitudes.
 * @param {Object} props
 * @param {Object} props.user - Objeto del usuario { id, name, avatar, email }.
 * @param {React.ReactNode} [props.subtitle] - Texto debajo del nombre.
 * @param {React.ReactNode} [props.actions] - Acciones (botones) a la derecha.
 * @param {boolean} [props.clickable=false] - Si la tarjeta es clickeable.
 * @param {Function} [props.onClick] - Callback al hacer click.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export default function UserCard({
  user,
  subtitle,
  actions,
  clickable = false,
  onClick,
  className = '',
}) {
  return (
    <div
      className={`user-card glass ${clickable ? 'user-card--clickable' : ''} ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      <Avatar name={user.name} avatar={user.avatar} size={45} />
      <div className="user-card__info">
        <h4 className="user-card__name">{user.name}</h4>
        {subtitle && <p className="user-card__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="user-card__actions">{actions}</div>}
    </div>
  );
}

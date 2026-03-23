import { useApp } from '../../context/AppContext';
import { useAuth, useNavbar, useNotifications } from '../../hooks';
import { Sun, Moon, LogOut, Bell, Heart, UserPlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import loguito from '../../images/loguito.png';
import '../../styles/components/Navbar.css';
import { NAV_LINKS } from '../../config/uiConfig';

/**
 * Mapa de íconos de notificación por tipo.
 * @param {string} type - Tipo de notificación.
 * @returns {JSX.Element} Ícono correspondiente.
 */
const getNotifIcon = (type) => {
  switch (type) {
    case 'like': return <Heart size={16} className="notif-icon like" />;
    case 'friend_request': return <UserPlus size={16} className="notif-icon req" />;
    default: return <Bell size={16} className="notif-icon" />;
  }
};

/**
 * Componente de la barra de navegación superior.
 * Incluye el logo, links globales, notificaciones, cambio de tema y logout.
 * Toda la lógica está delegada a hooks especializados.
 */
export default function Navbar() {
  const { theme, toggleTheme, user } = useApp();
  const { handleLogout } = useAuth();
  const { scrolled } = useNavbar();
  const {
    showNotif, myNotifications, unreadCount,
    notifRef, handleToggleNotif,
  } = useNotifications();
  const location = useLocation();

  return (
    <nav className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">

        <Link to="/" className="logo">
          <img src={loguito} alt="ChatHub" className="logo-img" />
        </Link>

        <div className="nav-links">
          {NAV_LINKS.filter(link => !link.requiresAuth || user).map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-item ${location.pathname === to ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="hide-mobile">{label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {user && (
            <div className="notif-wrapper" ref={notifRef}>
              <button className="notif-btn" onClick={handleToggleNotif}>
                <Bell size={22} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {showNotif && (
                <div className="notif-dropdown glass">
                  <div className="notif-header">
                    <h4>Notificaciones</h4>
                  </div>
                  <div className="notif-body">
                    {myNotifications.length > 0 ? (
                      myNotifications.map(n => (
                        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                          {getNotifIcon(n.type)}
                          <div className="notif-content">
                            <p><strong>{n.from}</strong> {n.message}</p>
                            <span>{n.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="notif-empty">No tienes notificaciones aún.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="user-profile">
              <div className="user-info-box hide-mobile">
                <span className="username">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="login-btn">Empezar</Link>
          )}
        </div>

      </div>
    </nav>
  );
}
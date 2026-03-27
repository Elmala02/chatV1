import { createElement } from 'react';
import { useApp } from '../../../context/useApp';
import { useAuth, useNavbar, useNotifications } from '../../../hooks';
import { Sun, Moon, LogOut, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import loguito from '../../../images/loguito.png';
import NotificationPanel from './NotificationPanel';
import { NAV_LINKS } from '../../../config/uiConfig';
import '../../../styles/components/layout/Navbar.css';

/**
 * Componente de la barra de navegación superior.
 * Incluye el logo, links globales, notificaciones, cambio de tema y logout.
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
          {NAV_LINKS.filter(link => !link.requiresAuth || user).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-item ${location.pathname === link.to ? 'active' : ''}`}
            >
              {createElement(link.icon, { size: 20 })}
              <span className="hide-mobile">{link.label}</span>
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
              {showNotif && <NotificationPanel notifications={myNotifications} />}
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

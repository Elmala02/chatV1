import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, LogOut, Bell, Heart, UserPlus } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import loguito from '../../images/loguito.png';
import '../../styles/components/Navbar.css';
import { NAV_LINKS } from '../../config/uiConfig';

export default function Navbar() {
  const {
    theme, toggleTheme, user, logoutUser,
    notifications, markNotificationsRead
  } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const myNotifications = notifications.filter(n => n.targetId === user?.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const handleToggleNotif = () => {
    if (!showNotif && unreadCount > 0) markNotificationsRead();
    setShowNotif(!showNotif);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={16} className="notif-icon like" />;
      case 'friend_request': return <UserPlus size={16} className="notif-icon req" />;
      default: return <Bell size={16} className="notif-icon" />;
    }
  };

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
            <Link to="/entrar" className="login-btn">Empezar</Link>
          )}
        </div>

      </div>
    </nav>
  );
}

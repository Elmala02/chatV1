import { Heart, UserPlus, Bell } from 'lucide-react';
import '../../../styles/components/layout/NotificationPanel.css';

/**
 * Mapa de íconos de notificación por tipo.
 */
const getNotifIcon = (type) => {
  switch (type) {
    case 'like': return <Heart size={16} className="notif-icon notif-icon--like" />;
    case 'friend_request': return <UserPlus size={16} className="notif-icon notif-icon--req" />;
    default: return <Bell size={16} className="notif-icon" />;
  }
};

/**
 * Panel desplegable de notificaciones.
 * @param {Object} props
 * @param {Array} props.notifications - Lista de notificaciones del usuario.
 */
export default function NotificationPanel({ notifications }) {
  return (
    <div className="notif-dropdown glass">
      <div className="notif-dropdown__header">
        <h4>Notificaciones</h4>
      </div>
      <div className="notif-dropdown__body">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n.id} className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}>
              {getNotifIcon(n.type)}
              <div className="notif-item__content">
                <p><strong>{n.from}</strong> {n.message}</p>
                <span>{n.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="notif-dropdown__empty">No tienes notificaciones aún.</p>
        )}
      </div>
    </div>
  );
}

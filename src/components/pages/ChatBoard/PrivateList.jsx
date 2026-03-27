import { MessageSquare } from 'lucide-react';
import { UserCard, EmptyState } from '../../common';

/**
 * Sección de Mensajes Privados: muestra la lista de amigos para chatear.
 * @param {Object} props
 * @param {Array} props.friends - Lista de amigos del usuario.
 * @param {Function} props.onSelectFriend - Callback al seleccionar un amigo.
 */
export default function PrivateList({ friends, onSelectFriend }) {
  return (
    <div className="users-section">
      <h3>Mensajes Privados</h3>
      <div className="users-list">
        {friends.length > 0 ? friends.map(f => (
          <UserCard
            key={f.id}
            user={f}
            subtitle="Haz clic para chatear"
            clickable
            onClick={() => onSelectFriend(f)}
            actions={<MessageSquare size={20} style={{ color: 'var(--primary)' }} />}
          />
        )) : (
          <EmptyState message="Aún no tienes amigos. ¡Busca usuarios y envía solicitudes!" />
        )}
      </div>
    </div>
  );
}

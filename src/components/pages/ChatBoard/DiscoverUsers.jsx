import { UserPlus, Check } from 'lucide-react';
import { UserCard, EmptyState } from '../../common';
import '../../../styles/components/pages/ChatBoard/DiscoverUsers.css';

/**
 * Sección de descubrir/buscar usuarios.
 * @param {Object} props
 * @param {string} props.searchTerm - Término de búsqueda actual.
 * @param {Function} props.onSearchChange - Callback al escribir búsqueda.
 * @param {Array} props.users - Usuarios filtrados.
 * @param {Function} props.isFriend - Verifica si un usuario es amigo.
 * @param {Function} props.hasSentRequest - Verifica si ya se envió solicitud.
 * @param {Function} props.onSendRequest - Callback para enviar solicitud.
 */
export default function DiscoverUsers({
  searchTerm,
  onSearchChange,
  users,
  isFriend,
  hasSentRequest,
  onSendRequest,
}) {
  return (
    <div className="discover-section">
      <div className="discover-search">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="discover-list">
        {users.length > 0 ? users.map(u => (
          <UserCard
            key={u.id}
            user={u}
            subtitle={isFriend(u.id) ? 'Amigos ✨' : u.email}
            actions={
              isFriend(u.id) ? (
                <div className="discover-friends-badge"><Check size={16} /></div>
              ) : (
                <button
                  className={`discover-add-btn ${hasSentRequest(u) ? 'sent' : ''}`}
                  onClick={() => onSendRequest(u.id)}
                  disabled={hasSentRequest(u)}
                >
                  {hasSentRequest(u) ? <Check size={18} /> : <UserPlus size={18} />}
                </button>
              )
            }
          />
        )) : (
          <EmptyState message="No se encontraron usuarios." />
        )}
      </div>
    </div>
  );
}

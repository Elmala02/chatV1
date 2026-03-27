import { Check, X } from 'lucide-react';
import { UserCard, EmptyState } from '../../common';
import '../../../styles/components/pages/ChatBoard/RequestsList.css';

/**
 * Sección de solicitudes de amistad recibidas.
 * @param {Object} props
 * @param {Array} props.requests - Solicitudes recibidas.
 * @param {Function} props.onAccept - Callback al aceptar solicitud.
 */
export default function RequestsList({ requests, onAccept }) {
  return (
    <div className="requests-section">
      <h3>Solicitudes Recibidas</h3>
      <div className="requests-list">
        {requests.length > 0 ? requests.map(u => (
          <UserCard
            key={u.id}
            user={u}
            subtitle="Quiere ser tu amigo"
            actions={
              <>
                <button className="requests-accept-btn" onClick={() => onAccept(u.id)}>
                  <Check size={18} /> Aceptar
                </button>
                <button className="requests-decline-btn">
                  <X size={18} />
                </button>
              </>
            }
          />
        )) : (
          <EmptyState message="No tienes solicitudes pendientes." />
        )}
      </div>
    </div>
  );
}

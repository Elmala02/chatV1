import '../../../styles/components/common/EmptyState.css';

/**
 * Componente reutilizable para estados vacíos.
 * Muestra un ícono y un mensaje cuando no hay contenido.
 * @param {Object} props
 * @param {React.ElementType} [props.icon] - Ícono a mostrar.
 * @param {string} props.message - Mensaje descriptivo.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export default function EmptyState({ icon: Icon, message, className = '' }) {
  return (
    <div className={`empty-state ${className}`}>
      {Icon && <Icon size={48} className="empty-state__icon" />}
      <p className="empty-state__message">{message}</p>
    </div>
  );
}

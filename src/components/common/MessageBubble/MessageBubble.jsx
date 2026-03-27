import '../../../styles/components/common/MessageBubble.css';

/**
 * Componente reutilizable de burbuja de mensaje.
 * Se usa tanto en el chat global como en el chat privado.
 * @param {Object} props
 * @param {string} props.text - Contenido del mensaje.
 * @param {string} [props.sender] - Nombre del remitente (chat global).
 * @param {string} props.time - Hora del mensaje.
 * @param {boolean} props.isOwn - Si el mensaje es del usuario actual.
 * @param {'global'|'private'} [props.variant='global'] - Variante visual.
 */
export default function MessageBubble({
  text,
  sender,
  time,
  isOwn,
  variant = 'global',
}) {
  const isPrivate = variant === 'private';

  if (isPrivate) {
    return (
      <div className={`msg-bubble msg-bubble--private ${isOwn ? 'msg-bubble--sent' : 'msg-bubble--received'}`}>
        {text}
        <span className="msg-bubble__time">{time}</span>
      </div>
    );
  }

  return (
    <div className={`msg-bubble msg-bubble--global ${isOwn ? 'msg-bubble--own' : ''}`}>
      <div className="msg-bubble__meta">
        <span className="msg-bubble__sender">{sender}</span>
        <span className="msg-bubble__time">{time}</span>
      </div>
      <div className="msg-bubble__content">{text}</div>
    </div>
  );
}

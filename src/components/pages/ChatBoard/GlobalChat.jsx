import { Send } from 'lucide-react';
import { MessageBubble } from '../../common';
import '../../../styles/components/pages/ChatBoard/GlobalChat.css';

/**
 * Sección de Chat Global del ChatBoard.
 * @param {Object} props
 * @param {Array} props.messages - Lista de mensajes.
 * @param {string} props.newMessage - Texto del nuevo mensaje.
 * @param {Function} props.onNewMessageChange - Callback al escribir.
 * @param {Function} props.onSendPost - Callback al enviar.
 * @param {string|number} props.userId - ID del usuario actual.
 */
export default function GlobalChat({
  messages,
  newMessage,
  onNewMessageChange,
  onSendPost,
  userId,
}) {
  return (
    <div className="global-chat">
      <div className="global-chat__messages">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            time={msg.time}
            isOwn={msg.senderId === userId}
            variant="global"
          />
        ))}
      </div>
      <form className="global-chat__input" onSubmit={onSendPost}>
        <input
          type="text"
          placeholder="Escribe en el chat global..."
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
        />
        <button type="submit"><Send size={20} /></button>
      </form>
    </div>
  );
}

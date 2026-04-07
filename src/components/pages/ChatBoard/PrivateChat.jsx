import { useApp } from '../../../context/useApp';
import { usePrivateChat } from '../../../hooks';
import { Send, ArrowLeft, Shield, MessageSquare } from 'lucide-react';
import { Avatar, MessageBubble, EmptyState } from '../../common';
import '../../../styles/components/pages/ChatBoard/PrivateChat.css';

/**
 * Componente de chat privado entre dos usuarios.
 * Toda la lógica está delegada al hook usePrivateChat.
 * @param {Object} props
 * @param {Object} props.friend - El objeto del usuario con el que se chatea.
 * @param {Function} props.onBack - Función para regresar al listado de chats.
 */
export default function PrivateChat({ friend, onBack }) {
  const { user } = useApp();
  const { text, messages, scrollRef, setText, handleSend } = usePrivateChat(friend);

  return (
    <div className="private-chat">
      <div className="private-chat__header">
        <button className="private-chat__back" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="private-chat__user-info">
          <Avatar name={friend.name} size={45} />
          <div>
            <h4>{friend.name}</h4>
            <div className="private-chat__status">
              <span className="private-chat__status-dot" />
              <small>En línea</small>
            </div>
          </div>
        </div>
        <div className="private-chat__secure">
          <Shield size={18} />
          <small>Cifrado</small>
        </div>
      </div>

      <div className="private-chat__messages" ref={scrollRef}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              time={msg.time}
              isOwn={String(msg.senderId) === String(user.id)}
              variant="private"
            />
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            message={`Inicia una conversación privada con ${friend.name}`}
          />
        )}
      </div>

      <form className="private-chat__input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escribe un mensaje privado..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="private-chat__send">
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

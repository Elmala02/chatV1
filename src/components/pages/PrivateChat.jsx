import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, ArrowLeft, Shield, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../styles/components/PrivateChat.css';

export default function PrivateChat({ friend, onBack }) {
    const { user, privateMessages, sendPrivateMessage } = useApp();
    const [text, setText] = useState('');
    const scrollRef = useRef(null);

    const room = [user.id, friend.id].sort().join('_');
    const roomMessages = privateMessages[room];
    const messages = roomMessages || [];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [roomMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendPrivateMessage(friend.id, text);
        setText('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="private-chat-container"
        >
            <div className="chat-header">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <div className="chat-user-info">
                    <div className="u-avatar">{friend.name[0]}</div>
                    <div>
                        <h4>{friend.name}</h4>
                        <div className="chat-status">
                            <span className="status-dot"></span>
                            <small>En línea</small>
                        </div>
                    </div>
                </div>
                <div className="chat-secure-info">
                    <Shield size={18} />
                    <small>Cifrado</small>
                </div>
            </div>

            <div className="private-messages" ref={scrollRef}>
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-msg ${msg.senderId === user.id ? 'sent' : 'received'}`}
                        >
                            {msg.text}
                            <span>{msg.time}</span>
                        </div>
                    ))
                ) : (
                    <div className="empty-chat">
                        <MessageSquare size={48} className="empty-chat-icon" />
                        <p>Inicia una conversación privada con {friend.name}</p>
                    </div>
                )}
            </div>

            <form className="p-chat-input" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje privado..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="p-send-btn">
                    <Send size={22} />
                </button>
            </form>
        </motion.div>
    );
}

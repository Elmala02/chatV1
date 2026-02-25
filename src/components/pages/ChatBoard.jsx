import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Send, UserPlus, Heart, Check, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import loguito from '../../images/loguito.png';
import Balatro from '../ui/Balatro';
import ElectricBorder from '../ui/ElectricBorder';
import PrivateChat from './PrivateChat';
import '../../styles/components/ChatBoard.css';
import { getBalatraConfig } from '../../config/balatraTheme';
import { SLIDE_IN_RIGHT, EXPAND_HEIGHT } from '../../config/animaciones';
import { SIDEBAR_TABS } from '../../config/uiConfig';

export default function ChatBoard({ initialTab = 'chat' }) {
  const navigate = useNavigate();
  const {
    user, registeredUsers, messages, addPost, likePost, addComment,
    sendRequest, acceptRequest, theme
  } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activeComments, setActiveComments] = useState({});
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSendPost = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    addPost(newMessage);
    setNewMessage('');
  };

  const handleSendComment = (e, postId) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text?.trim()) return;
    addComment(postId, text);
    setCommentText({ ...commentText, [postId]: '' });
  };

  const toggleComments = (postId) =>
    setActiveComments({ ...activeComments, [postId]: !activeComments[postId] });

  const handleTabChange = (tab, clearFriend) => {
    setActiveTab(tab);
    if (clearFriend) setSelectedFriend(null);

    if (tab === 'users') {
      navigate('/usuarios');
    } else {
      navigate('/chat');
    }
  };

  const filteredUsers = registeredUsers.filter(u =>
    u.id !== user.id && u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const myFriends = registeredUsers.filter(u => user.friends?.includes(u.id));
  const receivedRequests = registeredUsers.filter(u =>
    user.requests?.includes(u.id) && !user.friends?.includes(u.id)
  );

  return (
    <div className="board-container">

      {/* Fondo Balatro */}
      <div className="balatro-bg">
        <Balatro {...getBalatraConfig(theme)} />
      </div>

      <ElectricBorder className="glass electric-border-wrapper">
        <div className="board-layout">

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="board-sidebar">
            <div className="sidebar-header">
              <img src={loguito} alt="ChatHub" className="sidebar-logo" />
            </div>
            <div className="sidebar-nav">
              {SIDEBAR_TABS.map(({ id, icon: Icon, label, clearFriend }) => (
                <button
                  key={id}
                  className={activeTab === id ? 'active' : ''}
                  onClick={() => handleTabChange(id, clearFriend)}
                >
                  <Icon size={20} /> {label}
                  {id === 'requests' && receivedRequests.length > 0 && (
                    <span className="sidebar-badge">{receivedRequests.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Contenido principal ───────────────────────────────────── */}
          <div className="board-content">
            <AnimatePresence mode="wait">

              {/* Chat privado con amigo seleccionado */}
              {selectedFriend ? (
                <PrivateChat
                  key="private-chat"
                  friend={selectedFriend}
                  onBack={() => setSelectedFriend(null)}
                />

              ) : activeTab === 'chat' ? (
                <motion.div key="chat" {...SLIDE_IN_RIGHT} className="chat-section">
                  <div className="chat-messages">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`message-item ${msg.senderId === user.id ? 'own' : ''}`}>
                        <div className="message-meta">
                          <span className="sender">{msg.sender}</span>
                          <span className="time">{msg.time}</span>
                        </div>
                        <div className="message-bubble">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                  <form className="chat-input" onSubmit={handleSendPost}>
                    <input
                      type="text"
                      placeholder="Escribe en el chat global..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit"><Send size={20} /></button>
                  </form>
                </motion.div>

              ) : activeTab === 'blog' ? (
                <motion.div key="blog" {...SLIDE_IN_RIGHT} className="blog-section">
                  <div className="blog-composer glass">
                    <h4>¿Qué estás pensando, {user.name}?</h4>
                    <textarea
                      placeholder="Comparte algo con la comunidad..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={handleSendPost} className="post-btn">Publicar</button>
                  </div>
                  <div className="blog-posts">
                    {messages.slice().reverse().map(post => {
                      const isLiked = post.likes?.some(id => String(id) === String(user.id));
                      return (
                        <div key={post.id} className="post-card glass">
                          <div className="post-header">
                            <div className="post-avatar">{post.sender[0]}</div>
                            <div className="post-meta">
                              <h5>{post.sender}</h5>
                              <span>{post.time}</span>
                            </div>
                          </div>
                          <div className="post-content">{post.text}</div>
                          <div className="post-actions">
                            <button
                              className={`action-btn like ${isLiked ? 'active' : ''}`}
                              onClick={() => likePost(post.id)}
                            >
                              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                              <span>{post.likes?.length || 0}</span>
                            </button>
                            <button
                              className={`action-btn ${activeComments[post.id] ? 'active' : ''}`}
                              onClick={() => toggleComments(post.id)}
                            >
                              <MessageSquare size={18} />
                              <span>{post.comments?.length || 0}</span>
                            </button>
                          </div>

                          <AnimatePresence>
                            {activeComments[post.id] && (
                              <motion.div {...EXPAND_HEIGHT} className="post-comments-section">
                                <div className="comments-list">
                                  {post.comments?.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                      <div className="comment-avatar">{comment.userName[0]}</div>
                                      <div className="comment-body">
                                        <div className="comment-header">
                                          <span className="comment-user">{comment.userName}</span>
                                          <span className="comment-time">{comment.time}</span>
                                        </div>
                                        <p>{comment.text}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <form className="comment-input" onSubmit={(e) => handleSendComment(e, post.id)}>
                                  <input
                                    type="text"
                                    placeholder="Escribe un comentario..."
                                    value={commentText[post.id] || ''}
                                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                  />
                                  <button type="submit"><Send size={16} /></button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

              ) : activeTab === 'private' ? (
                <motion.div key="private" {...SLIDE_IN_RIGHT} className="users-section">
                  <h3>Mensajes Privados</h3>
                  <div className="users-list">
                    {myFriends.length > 0 ? myFriends.map(f => (
                      <div
                        key={f.id}
                        className="user-card-mini glass clickable"
                        onClick={() => setSelectedFriend(f)}
                      >
                        <div className="u-avatar">{f.avatar || f.name[0]}</div>
                        <div className="u-info">
                          <h4>{f.name}</h4>
                          <p>Haz clic para chatear</p>
                        </div>
                        <MessageSquare size={20} className="friend-chat-icon" />
                      </div>
                    )) : (
                      <p className="no-users">Aún no tienes amigos. ¡Busca usuarios y envía solicitudes!</p>
                    )}
                  </div>
                </motion.div>

              ) : activeTab === 'users' ? (
                <motion.div key="users" {...SLIDE_IN_RIGHT} className="users-section">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="users-list">
                    {filteredUsers.length > 0 ? filteredUsers.map(u => (
                      <div key={u.id} className="user-card-mini glass">
                        <div className="u-avatar">{u.avatar || u.name[0]}</div>
                        <div className="u-info">
                          <h4>{u.name}</h4>
                          <p>{user.friends?.includes(u.id) ? 'Amigos ✨' : u.email}</p>
                        </div>
                        {user.friends?.includes(u.id) ? (
                          <div className="friends-badge"><Check size={16} /></div>
                        ) : (
                          <button
                            className={`add-btn ${u.requests?.includes(user.id) ? 'sent' : ''}`}
                            onClick={() => sendRequest(u.id)}
                            disabled={u.requests?.includes(user.id)}
                          >
                            {u.requests?.includes(user.id) ? <Check size={18} /> : <UserPlus size={18} />}
                          </button>
                        )}
                      </div>
                    )) : (
                      <p className="no-users">No se encontraron usuarios.</p>
                    )}
                  </div>
                </motion.div>

              ) : (
                <motion.div key="requests" {...SLIDE_IN_RIGHT} className="requests-section">
                  <h3>Solicitudes Recibidas</h3>
                  <div className="requests-list">
                    {receivedRequests.length > 0 ? receivedRequests.map(u => (
                      <div key={u.id} className="request-card glass">
                        <div className="u-avatar">{u.avatar || u.name[0]}</div>
                        <div className="u-info">
                          <h4>{u.name}</h4>
                          <p>Quiere ser tu amigo</p>
                        </div>
                        <div className="request-actions">
                          <button className="accept-btn" onClick={() => acceptRequest(u.id)}>
                            <Check size={18} /> Aceptar
                          </button>
                          <button className="decline-btn"><X size={18} /></button>
                        </div>
                      </div>
                    )) : (
                      <p className="no-users">No tienes solicitudes pendientes.</p>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </ElectricBorder>
    </div>
  );
}
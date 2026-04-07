import { useApp } from '../../../context/useApp';
import { useChat, useFriends, useChatBoard } from '../../../hooks';
import { AnimatePresence } from 'framer-motion';
import loguito from '../../../images/loguito.png';
import Balatro from '../../ui/Balatro';
import ElectricBorder from '../../ui/ElectricBorder';
import PrivateChat from './PrivateChat';
import Sidebar from './Sidebar';
import BlogSection from './BlogSection';
import PrivateList from './PrivateList';
import DiscoverUsers from './DiscoverUsers';
import RequestsList from './RequestsList';
import { getBalatraConfig } from '../../../config/balatraTheme';
import '../../../styles/components/pages/ChatBoard/ChatBoard.css';

/**
 * Componente principal del tablero de chat.
 * Orquesta los sub-componentes delegando toda la lógica a hooks.
 * Cada sección del contenido es un componente independiente y reutilizable.
 *
 * @param {Object} props
 * @param {string} [props.initialTab='chat'] - Pestaña activa inicialmente.
 */
export default function ChatBoard({ initialTab = 'blog' }) {
  const { user, theme } = useApp();

  const {
    reversedMessages, newMessage, activeComments, commentText,
    setNewMessage, handleSendPost, handleSendComment,
    toggleComments, updateCommentText, likePost, isLikedByUser,
  } = useChat();

  const {
    searchTerm, filteredUsers, myFriends, receivedRequests,
    isFriend, hasSentRequest, updateSearch,
    handleSendRequest, handleAcceptRequest,
  } = useFriends();

  const {
    activeTab, selectedFriend,
    handleTabChange, selectFriend, clearSelectedFriend,
  } = useChatBoard(initialTab);

  /** Renderiza el contenido principal según la pestaña activa */
  const renderContent = () => {
    if (selectedFriend) {
      return (
        <PrivateChat
          key="private-chat"
          friend={selectedFriend}
          onBack={clearSelectedFriend}
        />
      );
    }

    switch (activeTab) {

      case 'blog':
        return (
          <BlogSection
            userName={user.name}
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendPost={handleSendPost}
            posts={reversedMessages}
            activeComments={activeComments}
            commentText={commentText}
            onToggleComments={toggleComments}
            onCommentTextChange={updateCommentText}
            onSendComment={handleSendComment}
            onLike={likePost}
            isLikedByUser={isLikedByUser}
          />
        );
      case 'private':
        return (
          <PrivateList
            friends={myFriends}
            onSelectFriend={selectFriend}
          />
        );
      case 'users':
        return (
          <DiscoverUsers
            searchTerm={searchTerm}
            onSearchChange={updateSearch}
            users={filteredUsers}
            isFriend={isFriend}
            hasSentRequest={hasSentRequest}
            onSendRequest={handleSendRequest}
          />
        );
      case 'requests':
        return (
          <RequestsList
            requests={receivedRequests}
            onAccept={handleAcceptRequest}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="board-container">
      <div className="balatro-bg">
        <Balatro {...getBalatraConfig(theme)} />
      </div>

      <ElectricBorder className="glass electric-border-wrapper">
        <div className="board-layout">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            requestCount={receivedRequests.length}
            logo={<img src={loguito} alt="ChatHub" className="board-sidebar__logo" />}
          />

          <div className="board-content">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
}

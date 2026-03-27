import { Send, Heart, MessageSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Avatar } from '../../common';
import '../../../styles/components/pages/ChatBoard/BlogSection.css';

/**
 * Componente de comentario individual dentro de un post.
 */
function CommentItem({ comment }) {
  return (
    <div className="blog-comment">
      <Avatar name={comment.userName} size={28} variant="accent" />
      <div className="blog-comment__body">
        <div className="blog-comment__header">
          <span className="blog-comment__user">{comment.userName}</span>
          <span className="blog-comment__time">{comment.time}</span>
        </div>
        <p>{comment.text}</p>
      </div>
    </div>
  );
}

/**
 * Sección de comentarios de un post con input para nuevo comentario.
 */
function CommentsSection({ postId, comments, commentText, onCommentTextChange, onSendComment }) {
  return (
    <div className="blog-comments-section">
      <div className="blog-comments-list">
        {comments?.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      <form className="blog-comment-input" onSubmit={(e) => onSendComment(e, postId)}>
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={commentText || ''}
          onChange={(e) => onCommentTextChange(postId, e.target.value)}
        />
        <button type="submit"><Send size={16} /></button>
      </form>
    </div>
  );
}

/**
 * Tarjeta individual de post del blog.
 */
function PostCard({ post, isLiked, activeComment, commentText, onLike, onToggleComments, onCommentTextChange, onSendComment }) {
  return (
    <div className="blog-post glass">
      <div className="blog-post__header">
        <Avatar name={post.sender} size={40} variant="secondary" />
        <div className="blog-post__meta">
          <h5>{post.sender}</h5>
          <span>{post.time}</span>
        </div>
      </div>
      <div className="blog-post__content">{post.text}</div>
      <div className="blog-post__actions">
        <button
          className={`blog-action-btn blog-action-btn--like ${isLiked ? 'active' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>
        <button
          className={`blog-action-btn ${activeComment ? 'active' : ''}`}
          onClick={() => onToggleComments(post.id)}
        >
          <MessageSquare size={18} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      <AnimatePresence>
        {activeComment && (
          <CommentsSection
            postId={post.id}
            comments={post.comments}
            commentText={commentText}
            onCommentTextChange={onCommentTextChange}
            onSendComment={onSendComment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Sección del Blog Social del ChatBoard.
 * @param {Object} props
 * @param {string} props.userName - Nombre del usuario actual.
 * @param {string} props.newMessage - Texto del nuevo post.
 * @param {Function} props.onNewMessageChange - Callback al escribir.
 * @param {Function} props.onSendPost - Callback al publicar.
 * @param {Array} props.posts - Posts en orden inverso (más reciente primero).
 * @param {Object} props.activeComments - Mapa de comentarios expandidos por post.
 * @param {Object} props.commentText - Mapa de texto de comentario por post.
 * @param {Function} props.onToggleComments - Toggle de sección de comentarios.
 * @param {Function} props.onCommentTextChange - Actualiza texto de comentario.
 * @param {Function} props.onSendComment - Envía un comentario.
 * @param {Function} props.onLike - Toggle de like en un post.
 * @param {Function} props.isLikedByUser - Verifica si el user actual dio like.
 */
export default function BlogSection({
  userName,
  newMessage,
  onNewMessageChange,
  onSendPost,
  posts,
  activeComments,
  commentText,
  onToggleComments,
  onCommentTextChange,
  onSendComment,
  onLike,
  isLikedByUser,
}) {
  return (
    <div className="blog-section">
      <div className="blog-composer glass">
        <h4>¿Qué estás pensando, {userName}?</h4>
        <textarea
          placeholder="Comparte algo con la comunidad..."
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
        />
        <button onClick={onSendPost} className="blog-composer__btn">Publicar</button>
      </div>
      <div className="blog-posts-list">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            isLiked={isLikedByUser(post)}
            activeComment={activeComments[post.id]}
            commentText={commentText[post.id]}
            onLike={onLike}
            onToggleComments={onToggleComments}
            onCommentTextChange={onCommentTextChange}
            onSendComment={onSendComment}
          />
        ))}
      </div>
    </div>
  );
}

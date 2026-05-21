import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  fetchPostById, 
  fetchCommentsByPostId, 
  createComment, 
  deletePost, 
  getImageUrl, 
  deleteComment, 
  updateComment,
  closePost
} from '../api';
import CommentVoteControl from '../components/CommentVoteControl';
import './Home.css';

/**
 * Single Comment Component
 */
function CommentItem({ comment, currentUser, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = async () => {
    try {
      await onUpdate(comment.id, { ...comment, content: editContent });
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update comment');
    }
  };

  return (
    <div className="comment-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div className="comment-header">
          <strong>User #{comment.userID}</strong>
          <span>{comment.createTime}</span>
        </div>
        
        {isEditing ? (
          <div className="edit-comment-area" style={{ marginTop: '10px' }}>
            <textarea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px' }}
            />
            <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
              <button onClick={handleUpdate} className="nav-btn" style={{ fontSize: '0.8rem', padding: '5px 10px', background: '#4ade80', border: 'none', color: 'white' }}>Save</button>
              <button onClick={() => setIsEditing(false)} className="nav-btn" style={{ fontSize: '0.8rem', padding: '5px 10px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}

        {currentUser && comment.userID == currentUser.id && !isEditing && (
          <div className="comment-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: '#e9e9ff', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
            <button onClick={() => onDelete(comment.id)} style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
          </div>
        )}
      </div>
      
      <CommentVoteControl commentId={comment.id} />
    </div>
  );
}

/**
 * Post Detail Component
 */
function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const loadData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        fetchPostById(id),
        fetchCommentsByPostId(id)
      ]);
      setPost(postData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      console.error('Failed to fetch post or comments:', err);
      setError('Failed to load post details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    try {
      const commentData = {
        content: newComment,
        userID: user.id,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        post: { id: parseInt(id) }
      };
      
      await createComment(commentData);
      setNewComment('');
      loadData(); // Refresh list to show new comment and updated status
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/home');
      } catch (err) {
        setError('Failed to delete post: ' + err.message);
      }
    }
  };

  const handleClosePost = async () => {
    if (window.confirm('Mark this post as Outdated? (No more comments will be allowed)')) {
      try {
        await closePost(id);
        loadData();
      } catch (err) {
        alert('Failed to close post');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await deleteComment(commentId);
        loadData(); // Refresh list
      } catch (err) {
        alert('Failed to delete comment');
      }
    }
  };

  const handleUpdateComment = async (commentId, updatedData) => {
    await updateComment(commentId, updatedData);
    loadData(); // Refresh list
  };

  if (loading) return <div className="status-message">Loading post...</div>;
  if (!post) return <div className="status-message error">Post not found</div>;

  const imageSrc = getImageUrl(post.picturePath);
  const isOutdated = post.status === 'Outdated';

  return (
    <div className="home-container">
      <div className="post-detail-card">
        <Link to="/home" className="back-link">← Back to Feed</Link>
        
        {user && post.userID === user.id && (
          <div className="post-detail-actions" style={{ float: 'right', display: 'flex', gap: '10px' }}>
            <Link to={`/edit-post/${post.id}`} className="edit-btn" style={{ 
              padding: '8px 16px', 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>Edit Post</Link>
            
            {!isOutdated && (
              <button onClick={handleClosePost} className="close-btn" style={{ 
                padding: '8px 16px', 
                background: 'rgba(255, 193, 7, 0.3)', 
                color: '#ffc107', 
                border: '1px solid #ffc107',
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}>Mark Outdated</button>
            )}

            <button onClick={handleDeletePost} className="delete-btn" style={{ 
              padding: '8px 16px', 
              background: 'rgba(239, 68, 68, 0.3)', 
              color: '#fca5a5', 
              border: '1px solid #ef4444',
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}>Delete Post</button>
          </div>
        )}

        <div style={{ clear: 'both' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1>{post.title}</h1>
          <span className={`status-badge ${isOutdated ? 'outdated' : 'active'}`} style={{
            padding: '5px 12px',
            borderRadius: '15px',
            background: isOutdated ? '#ef4444' : '#4ade80',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            {post.status || 'Just Posted'}
          </span>
        </div>

        <div className="post-meta">
          <span>By User #{post.userID}</span> • <span>{post.postDate}</span>
        </div>
        <div className="post-content">
          <p>{post.content}</p>
          {imageSrc && (
            <div className="image-container" style={{ marginTop: '20px', cursor: 'zoom-in' }} onClick={() => setShowLightbox(true)}>
              <img src={imageSrc} alt="Post" className="post-image" style={{ maxWidth: '100%', borderRadius: '12px' }} />
              <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '5px' }}>Click image to enlarge</p>
            </div>
          )}
        </div>
        
        {showLightbox && (
          <div 
            className="lightbox-overlay" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              cursor: 'zoom-out'
            }}
            onClick={() => setShowLightbox(false)}
          >
            <img 
              src={imageSrc} 
              alt="Enlarged" 
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} 
            />
          </div>
        )}
        
        <div className="tags">
          {post.tags && post.tags.map(tag => (
            <span key={tag.id} className="tag">#{tag.description}</span>
          ))}
        </div>

        <hr style={{ opacity: 0.2, margin: '30px 0' }} />

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          {error && <p className="error-message">{error}</p>}
          
          <div className="comment-list">
            {comments.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                currentUser={user}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
              />
            ))}
          </div>

          {user && !isOutdated ? (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
              />
              <button type="submit" className="auth-button">Post Comment</button>
            </form>
          ) : isOutdated ? (
            <div className="status-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', textAlign: 'center' }}>
              Comments are closed for this outdated post.
            </div>
          ) : (
            <div className="status-message" style={{ textAlign: 'center' }}>
              Please <Link to="/login" style={{ color: 'white', fontWeight: 'bold' }}>Login</Link> to join the conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;

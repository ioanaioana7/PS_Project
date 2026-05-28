import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  fetchPostById,
  fetchCommentsByPostId,
  createComment,
  deletePost,
  getImageUrl,
  deleteComment,
  updateComment,
  closePost,
  uploadImage
} from '../api';
import CommentItem from '../components/CommentItem';
import CommentVoteControl from '../components/CommentVoteControl';
import './Home.css';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === true;

  const loadData = async () => {
    try {
      const postData = await fetchPostById(id);
      const commentsData = await fetchCommentsByPostId(id);

      setPost(postData);
      const commentList = commentsData.value ? commentsData.value : (Array.isArray(commentsData) ? commentsData : []);
      setComments(commentList);
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
    if (!newComment.trim() && !selectedFile) return;

    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const commentData = {
        content: newComment,
        picturePath: imageUrl,
        userID: user.id,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        post: { id: parseInt(id) }
      };

      await createComment(commentData);
      setNewComment('');
      setSelectedFile(null);
      loadData();
    } catch (err) {
      console.error('Comment error:', err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
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
    if (window.confirm('Mark this post as Outdated?')) {
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
        loadData();
      } catch (err) {
        alert('Failed to delete comment');
      }
    }
  };

  const handleUpdateComment = async (commentId, updatedData) => {
    await updateComment(commentId, updatedData);
    loadData();
  };

  if (loading) return <div className="status-message">Loading post...</div>;
  if (!post) return <div className="status-message error">Post not found</div>;

  const imageSrc = getImageUrl(post.picturePath);
  const isOutdated = post.status === 'Outdated';

  return (
    <div className="home-container">
      <div className="post-detail-card" style={{ padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'white' }}>
        <Link to="/home" className="back-link" style={{ display: 'inline-block', marginBottom: '20px' }}>← Back to Feed</Link>

        {user && (isAdmin || post.userID === user.id) && (
          <div className="post-detail-actions" style={{ float: 'right', display: 'flex', gap: '10px' }}>
            <Link to={`/edit-post/${post.id}`} className="edit-btn" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Edit Post</Link>

            {!isOutdated && (
              <button onClick={handleClosePost} className="close-btn" style={{ padding: '8px 16px', background: 'rgba(255, 193, 7, 0.3)', color: '#ffc107', border: '1px solid #ffc107', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Mark Outdated</button>
            )}

            <button onClick={handleDeletePost} className="delete-btn" style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Delete Post</button>
          </div>
        )}

        <div style={{ clear: 'both' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1>{post.title}</h1>
          <span className={`status-badge ${isOutdated ? 'outdated' : 'active'}`} style={{ padding: '5px 12px', borderRadius: '15px', background: isOutdated ? '#ef4444' : '#4ade80', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {post.status || 'Just Posted'}
          </span>
        </div>

        <div className="post-meta" style={{ opacity: 0.7, marginBottom: '20px' }}>
          <span>By User #{post.userID}</span> • <span>{post.postDate}</span>
        </div>
        <div className="post-content">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{post.content}</p>
          {imageSrc && (
            <div className="image-container" style={{ marginTop: '20px', cursor: 'zoom-in' }} onClick={() => setShowLightbox(true)}>
              <img src={imageSrc} alt="Post" className="post-image" style={{ maxWidth: '100%', borderRadius: '12px' }} />
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
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

        <div className="tags" style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          {post.tags && post.tags.map(tag => (
            <span key={tag.id} className="tag" style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>#{tag.description}</span>
          ))}
        </div>

        <hr style={{ opacity: 0.2, margin: '30px 0' }} />

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>

          <div className="comment-list" style={{ marginTop: '20px' }}>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={user}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          {user && !isOutdated ? (
            <form onSubmit={handleAddComment} className="comment-form" style={{ marginTop: '30px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="commentPicture" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '5px' }}>Attach Image</label>
                <input type="file" id="commentPicture" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ display: 'none' }} />
                {selectedFile && <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>{selectedFile.name}</span>}
                <button type="submit" className="auth-button" disabled={submitting} style={{ width: 'auto', padding: '8px 20px' }}>
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : isOutdated ? (
            <div className="status-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', textAlign: 'center', marginTop: '20px', padding: '15px', borderRadius: '8px' }}>
              Comments are closed for this outdated post.
            </div>
          ) : (
            <div className="status-message" style={{ textAlign: 'center', marginTop: '20px' }}>
              Please <Link to="/login" style={{ color: 'white', fontWeight: 'bold' }}>Login</Link> to join the conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;

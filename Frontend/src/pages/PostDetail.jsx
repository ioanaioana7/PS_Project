import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostById, fetchCommentsByPostId, createComment } from '../api';
import './Home.css';

/**
 * Post Detail Component
 * Displays a single post with all its content and associated comments.
 */
function PostDetail() {
  // Extract post ID from URL parameters
  const { id } = useParams();
  
  // Component state
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  // Get current user from localStorage for comment attribution
  const user = JSON.parse(localStorage.getItem('user'));

  /**
   * Fetches post data and comments concurrently on component mount or ID change
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          fetchPostById(id),
          fetchCommentsByPostId(id)
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to fetch post or comments:', err);
        setError('Failed to load post details');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  /**
   * Submits a new comment to the Posts microservice
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    try {
      // Prepare comment payload with required entity structure
      const commentData = {
        content: newComment,
        userID: user.id,
        // Format date for backend (yyyy-MM-dd HH:mm:ss)
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        post: { id: parseInt(id) }
      };
      
      const created = await createComment(commentData);
      
      // Update local state to show the new comment immediately
      setComments(prev => [...prev, created]);
      setNewComment('');
      setError('');
    } catch (err) {
      // Catch err to help with debugging
      console.error('Comment submission failed:', err);
      setError('Failed to post comment');
    }
  };

  if (loading) return <div className="status-message">Loading post...</div>;
  if (!post) return <div className="status-message error">Post not found</div>;

  return (
    <div className="home-container">
      <div className="post-detail-card">
        <Link to="/home" className="back-link">← Back to Feed</Link>
        
        {/* Post Content */}
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By User #{post.userID}</span> • <span>{post.postDate}</span>
        </div>
        <div className="post-content">
          <p>{post.content}</p>
          {post.picturePath && <img src={post.picturePath} alt="Post" className="post-image" />}
        </div>
        
        {/* Post Tags */}
        <div className="tags">
          {post.tags && post.tags.map(tag => (
            <span key={tag.id} className="tag">#{tag.description}</span>
          ))}
        </div>

        <hr />

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          {error && <p className="error-message">{error}</p>}
          
          {/* List of comments */}
          <div className="comment-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <strong>User #{comment.userID}</strong>
                  <span>{comment.createTime}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form (only shown if logged in) */}
          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
              />
              <button type="submit" className="auth-button">Post Comment</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;

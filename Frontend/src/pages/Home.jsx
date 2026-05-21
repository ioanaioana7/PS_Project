import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { fetchPosts, deletePost, getImageUrl } from '../api';
import VoteControl from '../components/VoteControl';

/**
 * Home Component
 * Fix: Uses getImageUrl to robustly show post pictures.
 */
function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    fetchPosts()
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Could not load posts.');
        setLoading(false);
      });
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        loadPosts();
      } catch (err) {
        alert('Failed to delete post: ' + err.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-logo">My Blog</div>
        <div className="nav-links">
          <Link to="/create-post" className="nav-btn create-btn" style={{ background: '#4ade80', color: 'white' }}>+ Create Post</Link>
          <Link to="/user" className="nav-btn">My Profile</Link>
          <button onClick={handleLogout} className="nav-btn logout-btn" style={{ background: '#f87171', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <section className="posts-section">
        <h1>Latest Posts</h1>

        {loading && <div className="status-message">Loading posts...</div>}
        {error && <div className="status-message error-message">{error}</div>}
        
        {!loading && !error && posts.length === 0 && (
          <div className="status-message">No posts available.</div>
        )}

        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-content-wrapper">
                <Link to={`/post/${post.id}`} className="post-link">
                  <h2>{post.title || 'Untitled post'}</h2>
                </Link>
                <p>{post.content ? (post.content.substring(0, 100) + '...') : 'No content provided.'}</p>
                
                {post.picturePath && (
                  <div className="post-thumbnail" style={{ margin: '10px 0', borderRadius: '8px', overflow: 'hidden', height: '150px' }}>
                    <img 
                      src={getImageUrl(post.picturePath)} 
                      alt="Post Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="post-meta">
                  <span>Post ID: {post.id}</span>
                  <span>User ID: {post.userID}</span>
                </div>
                {user && post.userID === user.id && (
                  <div className="post-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <Link to={`/edit-post/${post.id}`} className="edit-btn" style={{ 
                      padding: '6px 12px', 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white', 
                      borderRadius: '6px', 
                      textDecoration: 'none',
                      fontSize: '0.85rem'
                    }}>Edit</Link>
                    <button onClick={() => handleDelete(post.id)} className="delete-btn" style={{ 
                      padding: '6px 12px', 
                      background: 'rgba(239, 68, 68, 0.3)', 
                      color: '#fca5a5', 
                      border: '1px solid #ef4444',
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}>Delete</button>
                  </div>
                )}
              </div>
              <VoteControl postId={post.id} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { fetchPosts, deletePost, getImageUrl, closePost } from '../api';
import VoteControl from '../components/VoteControl';

/**
 * Home Component
 * Updated: Admins can manage all posts.
 */
function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [onlyMyPosts, setOnlyMyPosts] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === true;

  useEffect(() => {
    loadPosts();
  }, [searchTitle, searchTag, onlyMyPosts]);

  const loadPosts = () => {
    setLoading(true);
    // Use the /search endpoint if any filters are active
    const params = new URLSearchParams();
    if (searchTitle) params.append('title', searchTitle);
    if (searchTag) params.append('tag', searchTag);
    if (onlyMyPosts && user) params.append('userID', user.id);

    const url = params.toString() ? `http://localhost:8081/post/search?${params.toString()}` : 'http://localhost:8081/post/getPosts';

    fetch(url)
      .then(res => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false)
      })
      .catch((err) => {
        setError('Could not load posts.');
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

  const handleClose = async (postId) => {
    if (window.confirm('Mark this post as Outdated?')) {
      try {
        await closePost(postId);
        loadPosts();
      } catch (err) {
        alert('Failed to close post: ' + err.message);
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
        <div className="nav-logo">{isAdmin ? 'Admin Dashboard' : 'My Blog'}</div>
        <div className="nav-links">
          <Link to="/create-post" className="nav-btn create-btn" style={{ background: '#4ade80', color: 'white' }}>+ Create Post</Link>
          <Link to="/user" className="nav-btn">My Profile</Link>
          <button onClick={handleLogout} className="nav-btn logout-btn" style={{ background: '#f87171', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      {/* Filter Bar */}
      <section className="filter-section" style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search by title..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: 'none' }} />
        <input type="text" placeholder="Filter by tag..." value={searchTag} onChange={(e) => setSearchTag(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: 'none' }} />
        <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input type="checkbox" checked={onlyMyPosts} onChange={(e) => setOnlyMyPosts(e.target.checked)} />
          My Posts
        </label>
      </section>

      <section className="posts-section">
        <h1>{isAdmin ? 'Management: All Posts' : 'Latest Posts'}</h1>

        {loading && <div className="status-message">Loading posts...</div>}
        {error && <div className="status-message error-message">{error}</div>}

        {!loading && !error && posts.length === 0 && (
          <div className="status-message">No posts found.</div>
        )}

        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-content-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Link to={`/post/${post.id}`} className="post-link">
                    <h2>{post.title || 'Untitled post'}</h2>
                  </Link>
                  <span className={`status-badge ${post.status === 'Outdated' ? 'outdated' : 'active'}`} style={{
                    fontSize: '0.7rem',
                    padding: '3px 7px',
                    borderRadius: '10px',
                    background: post.status === 'Outdated' ? '#ef4444' : '#4ade80',
                    color: 'white',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>
                    {post.status || 'Just Posted'}
                  </span>
                </div>

                <p>{post.content ? (post.content.substring(0, 100) + '...') : 'No content provided.'}</p>

                <div className="post-tags" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', margin: '10px 0' }}>
                  {post.tags && post.tags.map(tag => (
                    <span key={tag.id} style={{
                      fontSize: '0.7rem',
                      background: 'rgba(255,255,255,0.15)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>#{tag.description}</span>
                  ))}
                </div>

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

                {user && (isAdmin || post.userID === user.id) && (
                  <div className="post-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link to={`/edit-post/${post.id}`} className="edit-btn" style={{
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.85rem'
                    }}>Edit</Link>

                    {post.status !== 'Outdated' && (
                      <button onClick={() => handleClose(post.id)} className="close-btn" style={{
                        padding: '6px 12px',
                        background: 'rgba(255, 193, 7, 0.3)',
                        color: '#ffc107',
                        border: '1px solid #ffc107',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}>Mark Outdated</button>
                    )}

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

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { fetchPosts } from '../api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts()
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not load posts.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-logo">My Blog</div>
        <div className="nav-links">
          <Link to="/user" className="nav-btn">My Profile</Link>
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn">Register</Link>
        </div>
      </nav>

      <section className="posts-section">
        <h1>Latest Posts</h1>

        {loading && <div className="status-message">Loading posts...</div>}
        {error && <div className="status-message error-message">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="status-message">No posts available.</div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <h2>{post.title || 'Untitled post'}</h2>
                <p>{post.content || 'No content provided.'}</p>
                <div className="post-meta">
                  <span>Post ID: {post.id}</span>
                  <span>User ID: {post.userID}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
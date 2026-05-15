import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { fetchPosts } from '../api';

/**
 * Home Component
 * The landing page that displays a feed of all latest posts.
 */
function Home() {
  // State for storing the list of posts
  const [posts, setPosts] = useState([]);
  // Loading state for UI feedback
  const [loading, setLoading] = useState(true);
  // Error state for API failure feedback
  const [error, setError] = useState('');

  /**
   * Fetches posts from the Posts microservice on component mount
   */
  useEffect(() => {
    fetchPosts()
      .then((data) => {
        // Ensure data is an array before setting state
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
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo">My Blog</div>
        <div className="nav-links">
          <Link to="/user" className="nav-btn">My Profile</Link>
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn">Register</Link>
        </div>
      </nav>

      {/* Main Feed Section */}
      <section className="posts-section">
        <h1>Latest Posts</h1>

        {loading && <div className="status-message">Loading posts...</div>}
        {error && <div className="status-message error-message">{error}</div>}
        
        {/* Empty state message */}
        {!loading && !error && posts.length === 0 && (
          <div className="status-message">No posts available.</div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                {/* Link to the detailed view of the post */}
                <Link to={`/post/${post.id}`} className="post-link">
                  <h2>{post.title || 'Untitled post'}</h2>
                </Link>
                {/* Display a snippet of the content */}
                <p>{post.content ? (post.content.substring(0, 100) + '...') : 'No content provided.'}</p>
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
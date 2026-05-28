import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../api';
import './User.css';

/**
 * User Profile Component
 * Displays the logged-in user's details and manages the session.
 */
function User() {
  const navigate = useNavigate();
  // State for the user object
  const [user, setUser] = useState(null);
  // Loading state while fetching data
  const [loading, setLoading] = useState(true);

  /**
   * Loads user data on mount.
   * Checks localStorage for an existing session and fetches fresh data from the API.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // If no user is found in localStorage, redirect to login
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.id) {
        // Fetch fresh data from the Users microservice to ensure accuracy (e.g., if role changed)
        fetchUserById(parsedUser.id)
          .then((data) => {
            setUser(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Failed to fetch user:', err);
            // Fallback to stored user info if API is unreachable
            setUser(parsedUser);
            setLoading(false);
          });
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error parsing stored user:', err);
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  /**
   * Logs out the user by clearing the local session
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="user-container">
        <div className="status-message">Loading profile...</div>
      </div>
    );
  }

  // Handle case where user fetch failed and no local data was available
  if (!user) {
    return (
      <div className="user-container">
        <div className="status-message error">User not found</div>
        <button type="button" className="logout-button" onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="user-card">
        <h1>My Profile</h1>
        <div className="user-details">
          <div className="detail-row">
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>
          <div className="detail-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="detail-row">
            <span>Phone</span>
            <strong>{user.phone || 'N/A'}</strong>
          </div>
          <div className="detail-row">
            <span>Role</span>
            <strong>{user.role ? 'Admin' : 'User'}</strong>
          </div>
          <div className="detail-row">
            <span>Score</span>
            <strong>{user.score}</strong>
          </div>
          <div className="detail-row">
            <span>User ID</span>
            <strong>{user.id}</strong>
          </div>
        </div>
        <div className="user-actions">
          <Link to="/edit-user" className="user-link" style={{ background: '#667eea', color: 'white' }}>Edit Profile</Link>
          <Link to="/home" className="user-link">Back to Home</Link>
          <button type="button" onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default User;

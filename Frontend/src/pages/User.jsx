import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../api';
import './User.css';

function User() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.id) {
        // Fetch fresh data from API to ensure it's up to date
        fetchUserById(parsedUser.id)
          .then((data) => {
            setUser(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Failed to fetch user:', err);
            // Fallback to stored user if API fails
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
            <span>Role</span>
            <strong>{user.role ? 'Admin' : 'User'}</strong>
          </div>
          <div className="detail-row">
            <span>User ID</span>
            <strong>{user.id}</strong>
          </div>
        </div>
        <div className="user-actions">
          <Link to="/home" className="user-link">Back to Home</Link>
          <button type="button" onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default User;

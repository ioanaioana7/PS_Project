import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './User.css';
import { fetchUserById } from '../api';

function User() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    if (!parsed || typeof parsed !== 'object') {
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    setUser(parsed);

    if (parsed.id) {
      fetchUserById(parsed.id)
        .then((freshUser) => {
          setUser(freshUser);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Could not load profile.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="user-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="user-container">{error}</div>;
  }

  if (!user) {
    return null;
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
            <span>User ID</span>
            <strong>{user.id || 'Unknown'}</strong>
          </div>
          <div className="detail-row">
            <span>Role</span>
            <strong>{user.role ? 'Admin' : 'User'}</strong>
          </div>
        </div>
        <div className="user-actions">
          <Link to="/home" className="user-link">Back to Home</Link>
          <button type="button" onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="user-json">
        <h2>Profile JSON</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}

export default User;

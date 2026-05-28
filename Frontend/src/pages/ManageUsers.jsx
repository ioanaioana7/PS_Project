import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, banUser } from '../api';
import './User.css';

/**
 * ManageUsers Component
 * Allows admins to view all users and toggle their ban status.
 */
function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = currentUser && currentUser.role === true;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    loadUsers();
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (userId, isBanned) => {
    try {
      await banUser(userId, !isBanned);
      loadUsers(); // Refresh list
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  if (loading) return <div className="status-message">Loading users...</div>;

  return (
    <div className="user-container">
      <div className="user-card" style={{ maxWidth: '800px' }}>
        <h1>Manage Users</h1>
        {error && <div className="error-message">{error}</div>}
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.banned ? 'Banned' : 'Active'}</td>
                <td>
                  <button 
                    onClick={() => handleBanToggle(user.id, user.banned)}
                    style={{ background: user.banned ? '#4ade80' : '#f87171', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}
                  >
                    {user.banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate('/home')} className="logout-button" style={{ marginTop: '20px' }}>Back to Home</button>
      </div>
    </div>
  );
}

export default ManageUsers;

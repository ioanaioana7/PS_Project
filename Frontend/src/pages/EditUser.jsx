import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../api';
import './Auth.css';

/**
 * EditUser Component
 * Allows users to update their own profile (Name and Email).
 * Added logging and extra safety to debug "blank page" issue.
 */
function EditUser() {
  console.log('EditUser component rendering');
  const navigate = useNavigate();
  
  // Safely get user from localStorage
  const getStoredUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  };

  const storedUser = getStoredUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    console.log('EditUser useEffect running', { storedUser });
    
    if (!storedUser || !storedUser.id) {
      console.warn('No user session found, redirecting to login');
      navigate('/login');
      return;
    }

    fetchUserById(storedUser.id)
      .then(data => {
        console.log('User data loaded:', data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load user profile:', err);
        setError('Could not load profile data from server.');
        setLoading(false);
      });
  }, [navigate]); // Removed storedUser.id from deps to prevent infinite loops if navigate happens

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      console.log('Submitting user update:', formData);
      const updatedUser = await updateUser(storedUser.id, formData);
      console.log('Update successful:', updatedUser);
      
      // Update local storage so the UI reflects changes immediately
      localStorage.setItem('user', JSON.stringify(updatedUser));
      navigate('/user');
    } catch (err) {
      console.error('Update failed:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // If we are navigating away, return null to show nothing briefly
  if (!storedUser || !storedUser.id) {
    return null;
  }

  if (loading) {
    return (
      <div className="auth-container">
        <div className="status-message" style={{ color: 'white' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Update Profile</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onInput={handleChange}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onInput={handleChange}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button type="submit" className="auth-button" disabled={updating}>
            {updating ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/user')} 
          className="auth-link" 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'block', 
            width: '100%', 
            marginTop: '15px',
            textDecoration: 'underline'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditUser;

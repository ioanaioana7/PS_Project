import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { createUser } from '../api';

/**
 * Register Component
 * Allows new users to create an account by interacting with the Users microservice.
 */
function Register() {
  const navigate = useNavigate();

  // State for registration details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Error message state
  const [error, setError] = useState('');

  /**
   * Syncs input changes with the component state
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Validates and submits user data to the backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Create user on the server (role defaults to false/User)
      const createdUser = await createUser({
        ...formData,
        role: false,
      });

      // Automatically log the user in by storing their data
      localStorage.setItem('user', JSON.stringify(createdUser));

      // Navigate to the user's profile
      navigate('/user');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a password"
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
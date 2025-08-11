import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      // Auto login after successful registration
      localStorage.setItem('token', res.data.token);
      window.location.href = '/branches';
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <h1>ERP System</h1>
              <p>Create Your Account</p>
            </div>
          </div>
          
          <div className="auth-body">
            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                  minLength="3"
                  maxLength="30"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  minLength="8"
                />
                <small className="password-hint">
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account? 
                <button 
                  type="button" 
                  className="toggle-btn"
                  onClick={() => window.location.href = '/'}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/apiConfig';
import '../styles/glassmorphism-login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clean up any media elements before component unmounts or navigation
  useEffect(() => {
    return () => {
      // Cleanup function to pause any playing media
      const mediaElements = document.querySelectorAll('video, audio');
      mediaElements.forEach(element => {
        if (!element.paused) {
          element.pause();
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const cleanupMediaAndNavigate = async () => {
    try {
      // Pause any playing media elements
      const mediaElements = document.querySelectorAll('video, audio');
      const pausePromises = Array.from(mediaElements).map(element => {
        if (!element.paused) {
          return new Promise((resolve) => {
            element.pause();
            // Wait a bit for pause to complete
            setTimeout(resolve, 100);
          });
        }
        return Promise.resolve();
      });

      await Promise.all(pausePromises);
      
      // Add a small delay to ensure media is properly paused
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        navigate('/dashboard');
      }, 150);
      
    } catch (mediaError) {
      console.warn('Media cleanup error:', mediaError);
      // Still navigate even if media cleanup fails
      console.log("Redirecting to dashboard...");
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Starting login process...');
      
      // Use direct fetch with proxy-enabled endpoint
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login successful, received data:', data);

      // Store token in localStorage with the correct key
      localStorage.setItem('snapspace_token', data.token);
      console.log('Token stored in localStorage');
      
      // Verify token was stored
      const storedToken = localStorage.getItem('snapspace_token');
      if (storedToken) {
        console.log('Token verification successful');
        
        // Clean up media and navigate
        await cleanupMediaAndNavigate();
      } else {
        throw new Error('Failed to store token in localStorage');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Enhanced error handling
      let errorMessage = 'Login failed. ';
      
      if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        errorMessage += 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('CORS')) {
        errorMessage += 'Server configuration issue. Please contact support.';
      } else if (err.message.includes('timeout')) {
        errorMessage += 'Request timeout. The server may be slow, please try again.';
      } else {
        errorMessage += err.message || 'Please check your credentials and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Admin Access</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input 
              id="email"
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Enter admin email" 
              className="form-input"
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input 
              id="password"
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Enter password" 
              className="form-input"
              required 
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading && <span className="loading-spinner"></span>}
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

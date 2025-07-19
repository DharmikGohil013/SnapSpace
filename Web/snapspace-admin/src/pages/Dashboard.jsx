import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glassmorphism-login.css';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('snapspace_token');
    
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // No token found, redirect to login
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage and redirect to login
    localStorage.removeItem('snapspace_token');
    navigate('/');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-form">
            <div className="login-title">Loading...</div>
            <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (!isAuthenticated) {
    return null; // This shouldn't render as we redirect, but just in case
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '800px', minHeight: '600px' }}>
        <div className="login-form">
          <h1 className="login-title">Welcome, Agent</h1>
          
          <div className="input-group">
            <div className="input-label">Authentication Status</div>
            <div className="form-input" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              color: 'rgba(27, 94, 32, 0.9)'
            }}>
              ✅ Successfully Authenticated
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">Access Token</div>
            <div className="form-input" style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px',
              wordBreak: 'break-all',
              height: 'auto',
              minHeight: '56px',
              paddingTop: '15px',
              paddingBottom: '15px'
            }}>
              {token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : 'No token found'}
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">Dashboard Features</div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              marginTop: '8px'
            }}>
              <div 
                className="form-input" 
                onClick={() => navigate('/admin/users')}
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                👥 User Management
              </div>
              <div 
                className="form-input" 
                onClick={() => navigate('/admin/tiles')}
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🎯 Tile Management
              </div>
              <div 
                className="form-input" 
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/admin/analytics')}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📊 Analytics
              </div>
              <div 
                className="form-input" 
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/admin/settings')}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ⚙️ Settings
              </div>
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">System Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-input" style={{ fontSize: '14px', textAlign: 'center' }}>
                <strong>Server Status</strong><br />
                🟢 Online
              </div>
              <div className="form-input" style={{ fontSize: '14px', textAlign: 'center' }}>
                <strong>Last Login</strong><br />
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="login-button"
            style={{ 
              marginTop: '24px',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: 'rgba(183, 28, 28, 0.9)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

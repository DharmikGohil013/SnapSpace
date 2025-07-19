import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glassmorphism-login.css';

const TilesList = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [debugResults, setDebugResults] = useState([]);

  const addDebugResult = (endpoint, status, message) => {
    setDebugResults(prev => [...prev, { 
      endpoint, 
      status, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const fetchTiles = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('snapspace_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('Fetching tiles with token:', token.substring(0, 20) + '...');

      // Try proxy endpoint first
      let response;
      try {
        console.log('Attempting GET via proxy...');
        response = await fetch('/api/admin/tiles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Proxy response status:', response.status);
        console.log('Proxy response headers:', Object.fromEntries(response.headers.entries()));
        
        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/json')) {
          console.warn('Proxy returned non-JSON content:', contentType);
          addDebugResult('GET /api/admin/tiles (proxy)', 'warning', `Non-JSON response: ${contentType}`);
        } else {
          addDebugResult('GET /api/admin/tiles (proxy)', response.ok ? 'success' : 'error', 
            `Status: ${response.status} ${response.statusText}`);
        }
        
      } catch (proxyError) {
        console.log('Proxy failed, trying direct:', proxyError.message);
        addDebugResult('GET /api/admin/tiles (proxy)', 'error', `Proxy failed: ${proxyError.message}`);
        
        // Fallback to direct endpoint
        response = await fetch('https://snapspace-ry3k.onrender.com/api/admin/tiles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        addDebugResult('GET /api/admin/tiles (direct)', response.ok ? 'success' : 'error', 
          `Status: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          const textError = await response.text();
          if (textError.includes('<!DOCTYPE html>')) {
            errorMessage = `Server returned HTML error page. Status: ${response.status}`;
          } else {
            errorMessage = textError || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Tiles fetched successfully:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setTiles(data);
      } else if (data.tiles && Array.isArray(data.tiles)) {
        setTiles(data.tiles);
      } else if (data.data && Array.isArray(data.data)) {
        setTiles(data.data);
      } else {
        console.warn('Unexpected response structure:', data);
        setTiles([]);
      }

    } catch (err) {
      console.error('Error fetching tiles:', err);
      
      let errorMessage = 'Failed to fetch tiles. ';
      
      if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        errorMessage += 'Network error. Please check your connection.';
      } else if (err.message.includes('CORS')) {
        errorMessage += 'Server configuration issue. Please contact support.';
      } else if (err.message.includes('token')) {
        errorMessage += 'Authentication error. Please login again.';
        // Clear token and redirect to login
        localStorage.removeItem('snapspace_token');
        setTimeout(() => navigate('/'), 2000);
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTile = async (tileId, tileTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${tileTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('snapspace_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log(`Deleting tile ${tileId}...`);

      // Try proxy endpoint first
      let response;
      try {
        response = await fetch(`/api/admin/tiles/${tileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct:', proxyError.message);
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/admin/tiles/${tileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          const textError = await response.text();
          if (textError.includes('<!DOCTYPE html>')) {
            errorMessage = `Server returned HTML error page. Status: ${response.status}`;
          } else {
            errorMessage = textError || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      console.log(`Tile ${tileId} deleted successfully`);
      
      // Refresh the tiles list
      await fetchTiles();
      
    } catch (err) {
      console.error('Error deleting tile:', err);
      alert(`Failed to delete tile: ${err.message}`);
    }
  };

  const testDirectEndpoints = async () => {
    setDebugResults([]);
    const token = localStorage.getItem('snapspace_token');
    
    addDebugResult('Testing Direct Endpoints', 'info', 'Starting endpoint tests...');
    
    // Test health endpoint
    try {
      const healthResponse = await fetch('https://snapspace-ry3k.onrender.com/api/health');
      addDebugResult('GET /api/health', 'success', `✅ Health OK: ${healthResponse.status}`);
    } catch (error) {
      addDebugResult('GET /api/health', 'error', `❌ Health check failed: ${error.message}`);
    }
    
    // Test tiles endpoint with auth
    if (token) {
      try {
        const tilesResponse = await fetch('https://snapspace-ry3k.onrender.com/api/admin/tiles', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contentType = tilesResponse.headers.get('content-type');
        addDebugResult('GET /api/admin/tiles', tilesResponse.ok ? 'success' : 'error', 
          `Status: ${tilesResponse.status}, Content-Type: ${contentType}`);
      } catch (error) {
        addDebugResult('GET /api/admin/tiles', 'error', `❌ Direct endpoint failed: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ maxWidth: '400px' }}>
          <div className="login-form">
            <div className="login-title">Loading Tiles...</div>
            <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '1400px', minHeight: '600px' }}>
        <div className="login-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 className="login-title" style={{ margin: 0 }}>Tile Management</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 16px',
                  fontSize: '12px',
                  backgroundColor: showDebug ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.2)'
                }}
              >
                🔧 Debug
              </button>
              <button 
                onClick={() => navigate('/admin/create-tile')}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 16px',
                  fontSize: '12px',
                  backgroundColor: 'rgba(76, 175, 80, 0.2)'
                }}
              >
                ➕ Add Tile
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 20px',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
            </div>
          </div>

          {error && <div className="error-message" style={{ marginBottom: '24px' }}>{error}</div>}

          {showDebug && (
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <div className="input-label">Debug Panel</div>
              <div style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <button 
                  onClick={testDirectEndpoints}
                  className="login-button"
                  style={{ 
                    width: 'auto',
                    height: '36px',
                    padding: '0 16px',
                    fontSize: '12px',
                    marginBottom: '12px'
                  }}
                >
                  🧪 Test Endpoints
                </button>
                
                {debugResults.length > 0 && (
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    fontSize: '12px' 
                  }}>
                    {debugResults.map((result, index) => (
                      <div key={index} style={{ 
                        marginBottom: '8px',
                        padding: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        borderLeft: `3px solid ${
                          result.status === 'success' ? '#4caf50' :
                          result.status === 'error' ? '#f44336' : '#2196f3'
                        }`
                      }}>
                        <div style={{ fontWeight: '600', color: 'white' }}>
                          {result.endpoint} - {result.timestamp}
                        </div>
                        <div style={{ 
                          color: result.status === 'success' ? '#4caf50' :
                                 result.status === 'error' ? '#f44336' : '#2196f3'
                        }}>
                          {result.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="input-group">
            <div className="input-label">Tiles ({tiles.length})</div>
            {tiles.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'rgba(255, 255, 255, 0.7)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <h3 style={{ margin: '0 0 8px 0' }}>No tiles found</h3>
                <p style={{ margin: '0 0 16px 0' }}>Start by creating your first tile</p>
                <button 
                  onClick={() => navigate('/admin/create-tile')}
                  className="login-button"
                  style={{ width: 'auto', padding: '0 24px' }}
                >
                  ➕ Create First Tile
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px',
                maxHeight: '500px',
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                {tiles.map((tile) => (
                  <div key={tile._id || tile.id} style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ margin: '0', color: 'white', fontSize: '18px' }}>{tile.title}</h3>
                      <span style={{
                        backgroundColor: tile.inStock ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                        color: tile.inStock ? '#4caf50' : '#f44336',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {tile.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <p style={{ margin: '0 0 12px 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.4' }}>
                      {tile.description}
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', marginBottom: '16px' }}>
                      <div><strong>Price:</strong> ${tile.price}</div>
                      <div><strong>Quantity:</strong> {tile.quantity}</div>
                      {tile.category && <div><strong>Category:</strong> {tile.category}</div>}
                      {tile.dimensions && <div><strong>Dimensions:</strong> {tile.dimensions}</div>}
                      {tile.color && <div><strong>Color:</strong> {tile.color}</div>}
                      {tile.material && <div><strong>Material:</strong> {tile.material}</div>}
                      {tile.finish && <div><strong>Finish:</strong> {tile.finish}</div>}
                      {tile.brand && <div><strong>Brand:</strong> {tile.brand}</div>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleDeleteTile(tile._id || tile.id, tile.title)}
                        className="login-button"
                        style={{ 
                          flex: 1,
                          height: '36px',
                          fontSize: '12px',
                          backgroundColor: 'rgba(244, 67, 54, 0.2)',
                          color: '#f44336'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group" style={{ marginTop: '24px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              lineHeight: '1.5'
            }}>
              <strong>API Endpoint:</strong> GET /api/admin/tiles<br />
              <strong>Features:</strong> View all tiles, Delete tiles, Create new tiles<br />
              <strong>Note:</strong> Uses proxy configuration for CORS handling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TilesList;

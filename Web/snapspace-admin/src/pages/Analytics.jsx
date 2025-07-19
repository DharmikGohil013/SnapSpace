import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glassmorphism-login.css';

const Analytics = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTile, setSelectedTile] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDebug, setShowDebug] = useState(false);
  const [debugResults, setDebugResults] = useState([]);

  // Analytics data states
  const [allTilesAnalytics, setAllTilesAnalytics] = useState([]);
  const [selectedTileAnalytics, setSelectedTileAnalytics] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [topPerformingTiles, setTopPerformingTiles] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const addDebugResult = (endpoint, status, message) => {
    setDebugResults(prev => [...prev, { 
      endpoint, 
      status, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('snapspace_token');
    if (!token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Fetch all tiles analytics
  const fetchAllTilesAnalytics = async () => {
    const token = localStorage.getItem('snapspace_token');
    if (!token) return;

    try {
      addDebugResult('GET /api/analytics/tiles', 'testing', 'Fetching all tiles analytics...');
      
      let response;
      try {
        response = await fetch('/api/analytics/tiles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        addDebugResult('GET /api/analytics/tiles (proxy)', 'error', `Proxy failed: ${proxyError.message}`);
        response = await fetch('https://snapspace-ry3k.onrender.com/api/analytics/tiles', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setAllTilesAnalytics(Array.isArray(data) ? data : data.analytics || []);
        addDebugResult('GET /api/analytics/tiles', 'success', `Fetched ${data.length || 0} tiles analytics`);
      } else {
        addDebugResult('GET /api/analytics/tiles', 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult('GET /api/analytics/tiles', 'error', `Error: ${error.message}`);
      console.error('Error fetching tiles analytics:', error);
    }
  };

  // Fetch top performing tiles
  const fetchTopPerformingTiles = async () => {
    const token = localStorage.getItem('snapspace_token');
    if (!token) return;

    try {
      addDebugResult('GET /api/analytics/top-performing', 'testing', 'Fetching top performing tiles...');
      
      let response;
      try {
        response = await fetch('/api/analytics/top-performing', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        response = await fetch('https://snapspace-ry3k.onrender.com/api/analytics/top-performing', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setTopPerformingTiles(Array.isArray(data) ? data : data.topTiles || []);
        addDebugResult('GET /api/analytics/top-performing', 'success', `Fetched ${data.length || 0} top tiles`);
      } else {
        addDebugResult('GET /api/analytics/top-performing', 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult('GET /api/analytics/top-performing', 'error', `Error: ${error.message}`);
      console.error('Error fetching top performing tiles:', error);
    }
  };

  // Fetch detailed analytics for specific tile
  const fetchTileAnalytics = async (tileId) => {
    const token = localStorage.getItem('snapspace_token');
    if (!token || !tileId) return;

    try {
      addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'testing', 'Fetching tile analytics...');
      
      let response;
      try {
        response = await fetch(`/api/analytics/tiles/${tileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/analytics/tiles/${tileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setSelectedTileAnalytics(data);
        addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'success', 'Tile analytics fetched');
      } else {
        addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'error', `Error: ${error.message}`);
      console.error('Error fetching tile analytics:', error);
    }
  };

  // Fetch trend data for specific tile
  const fetchTrendData = async (tileId) => {
    const token = localStorage.getItem('snapspace_token');
    if (!token || !tileId) return;

    try {
      addDebugResult(`GET /api/analytics/tiles/${tileId}/trends`, 'testing', 'Fetching trend data...');
      
      let response;
      try {
        response = await fetch(`/api/analytics/tiles/${tileId}/trends`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/analytics/tiles/${tileId}/trends`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setTrendData(data);
        addDebugResult(`GET /api/analytics/tiles/${tileId}/trends`, 'success', 'Trend data fetched');
      } else {
        addDebugResult(`GET /api/analytics/tiles/${tileId}/trends`, 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult(`GET /api/analytics/tiles/${tileId}/trends`, 'error', `Error: ${error.message}`);
      console.error('Error fetching trend data:', error);
    }
  };

  // Fetch engagement data for specific tile
  const fetchEngagementData = async (tileId) => {
    const token = localStorage.getItem('snapspace_token');
    if (!token || !tileId) return;

    try {
      addDebugResult(`GET /api/analytics/tiles/${tileId}/engagement`, 'testing', 'Fetching engagement data...');
      
      let response;
      try {
        response = await fetch(`/api/analytics/tiles/${tileId}/engagement`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/analytics/tiles/${tileId}/engagement`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setEngagementData(data);
        addDebugResult(`GET /api/analytics/tiles/${tileId}/engagement`, 'success', 'Engagement data fetched');
      } else {
        addDebugResult(`GET /api/analytics/tiles/${tileId}/engagement`, 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult(`GET /api/analytics/tiles/${tileId}/engagement`, 'error', `Error: ${error.message}`);
      console.error('Error fetching engagement data:', error);
    }
  };

  // Fetch feedback data for specific tile
  const fetchFeedbackData = async (tileId) => {
    const token = localStorage.getItem('snapspace_token');
    if (!token || !tileId) return;

    try {
      addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'testing', 'Fetching feedback data...');
      
      let response;
      try {
        response = await fetch(`/api/analytics/tiles/${tileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/analytics/tiles/${tileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        const data = await response.json();
        setFeedbackData(data.feedback || []);
        addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'success', 'Feedback data fetched');
      } else {
        addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult(`GET /api/analytics/tiles/${tileId}`, 'error', `Error: ${error.message}`);
      console.error('Error fetching feedback data:', error);
    }
  };

  // Delete analytics for specific tile
  const deleteAnalytics = async (tileId) => {
    const token = localStorage.getItem('snapspace_token');
    if (!token || !tileId) return;

    if (!window.confirm('Are you sure you want to delete analytics for this tile?')) {
      return;
    }

    try {
      addDebugResult(`DELETE /api/analytics/tiles/${tileId}`, 'testing', 'Deleting analytics...');
      
      let response;
      try {
        response = await fetch(`/api/analytics/tiles/${tileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/analytics/tiles/${tileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.ok) {
        addDebugResult(`DELETE /api/analytics/tiles/${tileId}`, 'success', 'Analytics deleted');
        // Refresh data
        fetchAllTilesAnalytics();
        fetchTopPerformingTiles();
        if (selectedTile === tileId) {
          setSelectedTile(null);
          setSelectedTileAnalytics(null);
          setTrendData(null);
          setEngagementData(null);
          setFeedbackData([]);
        }
      } else {
        addDebugResult(`DELETE /api/analytics/tiles/${tileId}`, 'error', `Failed: ${response.status}`);
      }
    } catch (error) {
      addDebugResult(`DELETE /api/analytics/tiles/${tileId}`, 'error', `Error: ${error.message}`);
      console.error('Error deleting analytics:', error);
    }
  };

  // Load tile details when selected
  const handleTileSelect = async (tileId) => {
    setSelectedTile(tileId);
    setActiveTab('details');
    await Promise.all([
      fetchTileAnalytics(tileId),
      fetchTrendData(tileId),
      fetchEngagementData(tileId),
      fetchFeedbackData(tileId)
    ]);
  };

  // Sorting logic
  const sortData = (data, sortBy, sortOrder) => {
    return [...data].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };

  // Pagination logic
  const paginate = (data, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Initialize data
  useEffect(() => {
    const initializeAnalytics = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAllTilesAnalytics(),
        fetchTopPerformingTiles()
      ]);
      setIsLoading(false);
    };

    initializeAnalytics();
  }, []);

  // Simple chart component for trends
  const TrendChart = ({ data }) => {
    if (!data || !data.trends || data.trends.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: 'rgba(255, 255, 255, 0.7)' 
        }}>
          No trend data available
        </div>
      );
    }

    const maxValue = Math.max(...data.trends.map(t => t.value));
    
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          height: '200px',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {data.trends.map((trend, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  height: `${(trend.value / maxValue) * 150}px`,
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '10px',
                  width: '100%',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}
                title={`${trend.period}: ${trend.value}`}
              />
              <div style={{ 
                fontSize: '10px', 
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                wordBreak: 'break-all'
              }}>
                {trend.period}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'white',
                fontWeight: '600'
              }}>
                {trend.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ maxWidth: '400px' }}>
          <div className="login-form">
            <div className="login-title">Loading Analytics...</div>
            <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const sortedTiles = sortData(allTilesAnalytics, sortBy, sortOrder);
  const paginatedTiles = paginate(sortedTiles, currentPage, itemsPerPage);
  const totalPages = Math.ceil(sortedTiles.length / itemsPerPage);

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '1600px', minHeight: '700px' }}>
        <div className="login-form">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 className="login-title" style={{ margin: 0 }}>Analytics Dashboard</h1>
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

          {/* Debug Panel */}
          {showDebug && (
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <div className="input-label">Debug Panel</div>
              <div style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
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

          {/* Tab Navigation */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '20px' }}>
              {[
                { key: 'overview', label: '📊 Overview', icon: '📊' },
                { key: 'top-performing', label: '🏆 Top Performing', icon: '🏆' },
                { key: 'details', label: '📈 Tile Details', icon: '📈' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="login-button"
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    fontSize: '14px',
                    backgroundColor: activeTab === tab.key ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    color: activeTab === tab.key ? '#2196f3' : 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? '2px solid #2196f3' : '2px solid transparent'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="input-group">
              <div className="input-label">All Tiles Analytics ({allTilesAnalytics.length})</div>
              
              {/* Sort Controls */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '16px',
                alignItems: 'center'
              }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input"
                  style={{ width: 'auto', minWidth: '120px' }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="views">Sort by Views</option>
                  <option value="likes">Sort by Likes</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="login-button"
                  style={{ 
                    width: 'auto',
                    height: '36px',
                    padding: '0 12px',
                    fontSize: '12px'
                  }}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {allTilesAnalytics.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                  <h3 style={{ margin: '0 0 8px 0' }}>No analytics data found</h3>
                  <p style={{ margin: '0' }}>Analytics data will appear here once tiles receive user interactions</p>
                </div>
              ) : (
                <>
                  {/* Analytics Table */}
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <th style={{ padding: '16px 12px', textAlign: 'left', color: 'white', fontWeight: '600', fontSize: '14px' }}>Tile Name</th>
                          <th style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>Views</th>
                          <th style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>Likes</th>
                          <th style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>Rating</th>
                          <th style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontWeight: '600', fontSize: '14px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTiles.map((tile, index) => (
                          <tr 
                            key={tile._id || tile.id || index} 
                            style={{ 
                              borderBottom: index < paginatedTiles.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                              transition: 'background-color 0.3s ease'
                            }}
                          >
                            <td style={{ padding: '16px 12px', color: 'white', fontSize: '14px' }}>
                              <div style={{ fontWeight: '600' }}>{tile.name || tile.tileName || 'Unknown Tile'}</div>
                              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                ID: {tile._id || tile.id || 'N/A'}
                              </div>
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                              {tile.views || tile.viewCount || 0}
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                              {tile.likes || tile.likeCount || 0}
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center', color: 'white', fontSize: '14px' }}>
                              {tile.rating || tile.averageRating || 'N/A'}
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  onClick={() => handleTileSelect(tile._id || tile.id)}
                                  className="login-button"
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    color: '#2196f3'
                                  }}
                                >
                                  📊 View Details
                                </button>
                                <button
                                  onClick={() => deleteAnalytics(tile._id || tile.id)}
                                  className="login-button"
                                  style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                    color: '#f44336'
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '20px'
                    }}>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="login-button"
                        style={{
                          width: 'auto',
                          padding: '8px 16px',
                          fontSize: '12px',
                          opacity: currentPage === 1 ? 0.5 : 1
                        }}
                      >
                        ← Previous
                      </button>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="login-button"
                        style={{
                          width: 'auto',
                          padding: '8px 16px',
                          fontSize: '12px',
                          opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'top-performing' && (
            <div className="input-group">
              <div className="input-label">Top Performing Tiles</div>
              
              {topPerformingTiles.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                  <h3 style={{ margin: '0 0 8px 0' }}>No top performing data</h3>
                  <p style={{ margin: '0' }}>Top performing tiles will appear here based on user engagement</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  {topPerformingTiles.map((tile, index) => (
                    <div key={tile._id || tile.id || index} style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: index === 0 ? 'rgba(255, 193, 7, 0.3)' : 
                                        index === 1 ? 'rgba(192, 192, 192, 0.3)' :
                                        index === 2 ? 'rgba(205, 127, 50, 0.3)' : 'rgba(76, 175, 80, 0.3)',
                        color: index === 0 ? '#ffc107' : 
                               index === 1 ? '#c0c0c0' :
                               index === 2 ? '#cd7f32' : '#4caf50',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        #{index + 1}
                      </div>

                      <h4 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '18px', paddingRight: '40px' }}>
                        {tile.name || tile.tileName || 'Unknown Tile'}
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '16px' }}>
                        <div><strong>Views:</strong> {tile.views || tile.viewCount || 0}</div>
                        <div><strong>Likes:</strong> {tile.likes || tile.likeCount || 0}</div>
                        <div><strong>Rating:</strong> {tile.rating || tile.averageRating || 'N/A'}</div>
                        <div><strong>Engagement:</strong> {tile.engagementScore || 'N/A'}</div>
                      </div>

                      <button
                        onClick={() => handleTileSelect(tile._id || tile.id)}
                        className="login-button"
                        style={{
                          width: '100%',
                          height: '36px',
                          fontSize: '12px',
                          backgroundColor: 'rgba(33, 150, 243, 0.2)',
                          color: '#2196f3'
                        }}
                      >
                        📊 View Full Analytics
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="input-group">
              <div className="input-label">
                {selectedTile ? `Detailed Analytics - Tile ID: ${selectedTile}` : 'Select a Tile for Detailed Analytics'}
              </div>

              {!selectedTile ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
                  <h3 style={{ margin: '0 0 8px 0' }}>No tile selected</h3>
                  <p style={{ margin: '0' }}>Select a tile from the Overview or Top Performing tabs to view detailed analytics</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                  {/* Tile Analytics Summary */}
                  {selectedTileAnalytics && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <h3 style={{ color: 'white', marginBottom: '16px' }}>📊 Analytics Summary</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)', padding: '16px', borderRadius: '8px' }}>
                          <div style={{ color: '#2196f3', fontSize: '24px', fontWeight: 'bold' }}>
                            {selectedTileAnalytics.views || 0}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Total Views</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', padding: '16px', borderRadius: '8px' }}>
                          <div style={{ color: '#f44336', fontSize: '24px', fontWeight: 'bold' }}>
                            {selectedTileAnalytics.likes || 0}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Total Likes</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255, 193, 7, 0.2)', padding: '16px', borderRadius: '8px' }}>
                          <div style={{ color: '#ffc107', fontSize: '24px', fontWeight: 'bold' }}>
                            {selectedTileAnalytics.rating || 'N/A'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Average Rating</div>
                        </div>
                        <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', padding: '16px', borderRadius: '8px' }}>
                          <div style={{ color: '#4caf50', fontSize: '24px', fontWeight: 'bold' }}>
                            {selectedTileAnalytics.comments || 0}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Comments</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trend Chart */}
                  {trendData && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <h3 style={{ color: 'white', marginBottom: '16px' }}>📈 Weekly Trends</h3>
                      <TrendChart data={trendData} />
                    </div>
                  )}

                  {/* Engagement Data */}
                  {engagementData && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <h3 style={{ color: 'white', marginBottom: '16px' }}>👥 User Engagement Insights</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        <div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Engagement Score:</strong> {engagementData.score || 'N/A'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Active Users:</strong> {engagementData.activeUsers || 0}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Avg. Session Time:</strong> {engagementData.avgSessionTime || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Bounce Rate:</strong> {engagementData.bounceRate || 'N/A'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Return Visitors:</strong> {engagementData.returnVisitors || 0}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Conversion Rate:</strong> {engagementData.conversionRate || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback Section */}
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h3 style={{ color: 'white', marginBottom: '16px' }}>💬 User Feedback</h3>
                    {feedbackData.length === 0 ? (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '20px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        No feedback available for this tile
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {feedbackData.map((feedback, index) => (
                          <div key={index} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            <div 
                              style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                              onClick={() => setExpandedFeedback(prev => ({
                                ...prev,
                                [index]: !prev[index]
                              }))}
                            >
                              <div>
                                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                                  {feedback.userName || `User ${index + 1}`}
                                </span>
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginLeft: '12px' }}>
                                  Rating: {feedback.rating || 'N/A'}/5
                                </span>
                              </div>
                              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {expandedFeedback[index] ? '▼' : '▶'}
                              </span>
                            </div>
                            {expandedFeedback[index] && (
                              <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.4', marginTop: '12px' }}>
                                  {feedback.comment || feedback.feedback || 'No comment provided'}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginTop: '8px' }}>
                                  {feedback.date || feedback.createdAt ? new Date(feedback.date || feedback.createdAt).toLocaleDateString() : 'Date not available'}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      onClick={() => deleteAnalytics(selectedTile)}
                      className="login-button"
                      style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                        backgroundColor: 'rgba(244, 67, 54, 0.2)',
                        color: '#f44336'
                      }}
                    >
                      🗑️ Delete Analytics for This Tile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTile(null);
                        setActiveTab('overview');
                      }}
                      className="login-button"
                      style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      ← Back to Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Info */}
          <div className="input-group" style={{ marginTop: '24px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              lineHeight: '1.5'
            }}>
              <strong>Analytics Dashboard Features:</strong><br />
              • Real-time tile performance metrics with sorting and pagination<br />
              • Top performing tiles ranking based on engagement scores<br />
              • Detailed analytics with trend charts and user engagement insights<br />
              • User feedback management with collapsible sections<br />
              • Analytics deletion capabilities with confirmation dialogs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glassmorphism-login.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugResults, setDebugResults] = useState([]);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('snapspace_token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('snapspace_token');
      console.log('🔍 Fetching users with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('✅ Users data received:', data);
          setUsers(data.users || data || []);
        } else {
          console.error('❌ Response is not JSON, content-type:', contentType);
          const text = await response.text();
          console.error('Response text:', text.substring(0, 200) + '...');
          setError('Server returned non-JSON response. Please check backend configuration.');
        }
      } else if (response.status === 401) {
        console.log('🔒 Unauthorized - redirecting to login');
        localStorage.removeItem('snapspace_token');
        navigate('/');
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.message || `Server error: ${response.status}`);
        } else {
          const text = await response.text();
          console.error('❌ Error response is HTML:', text.substring(0, 200));
          setError(`Server error (${response.status}): Backend returned HTML instead of JSON`);
        }
      }
    } catch (err) {
      console.error('❌ Network error fetching users:', err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to connect to server. Please check if the server is running and CORS is properly configured.');
      } else {
        setError(`Network error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    setDeleteLoading(userId);
    
    try {
      const token = localStorage.getItem('snapspace_token');
      console.log('🗑️ Deleting user:', userId);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('✅ User deleted successfully');
        
        // Try to parse JSON response if available, but don't fail if it's not JSON
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('Delete response data:', data);
        }
        
        // Successfully deleted, refresh the users list
        await fetchUsers();
      } else if (response.status === 401) {
        console.log('🔒 Unauthorized during delete - redirecting to login');
        localStorage.removeItem('snapspace_token');
        navigate('/');
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.message || `Failed to delete user (${response.status})`);
        } else {
          const text = await response.text();
          console.error('❌ Delete error response is HTML:', text.substring(0, 200));
          
          if (response.status === 404) {
            setError('User not found. They may have already been deleted.');
          } else {
            setError(`Delete failed (${response.status}): Backend returned HTML instead of JSON. Please check backend route configuration.`);
          }
        }
      }
    } catch (err) {
      console.error('❌ Network error deleting user:', err);
      
      if (err.name === 'SyntaxError' && err.message.includes('Unexpected token')) {
        setError('Delete failed: Server returned invalid JSON response. Please check backend route configuration.');
      } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to connect to server for delete operation.');
      } else {
        setError(`Delete error: ${err.message}`);
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewUser = (userId) => {
    // Placeholder for view functionality
    console.log('View user:', userId);
    alert(`View functionality for user ${userId} will be implemented soon.`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRole = (role) => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const addDebugResult = (test, status, message) => {
    setDebugResults(prev => [...prev, { 
      test, 
      status, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const testDirectEndpoints = async () => {
    setDebugResults([]);
    const token = localStorage.getItem('snapspace_token');
    
    // Test 1: Direct API call to GET users
    try {
      addDebugResult('GET Users (Direct)', 'testing', 'Testing direct API call...');
      
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        addDebugResult('GET Users (Direct)', 'success', `✅ Success: ${response.status}`);
      } else {
        addDebugResult('GET Users (Direct)', 'error', `❌ Error: ${response.status}`);
      }
    } catch (error) {
      addDebugResult('GET Users (Direct)', 'error', `❌ CORS/Network Error: ${error.message}`);
    }
    
    // Test 2: Proxy API call to GET users
    try {
      addDebugResult('GET Users (Proxy)', 'testing', 'Testing proxy API call...');
      
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          addDebugResult('GET Users (Proxy)', 'success', `✅ Success: Got ${data.users?.length || data.length || 0} users`);
        } else {
          addDebugResult('GET Users (Proxy)', 'warning', `⚠️ Success but non-JSON response: ${contentType}`);
        }
      } else {
        addDebugResult('GET Users (Proxy)', 'error', `❌ Error: ${response.status} (${contentType || 'unknown type'})`);
      }
    } catch (error) {
      addDebugResult('GET Users (Proxy)', 'error', `❌ Network Error: ${error.message}`);
    }
    
    // Test 3: Health check
    try {
      addDebugResult('Health Check', 'testing', 'Testing server health...');
      
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        addDebugResult('Health Check', 'success', `✅ Server healthy: ${response.status}`);
      } else {
        addDebugResult('Health Check', 'warning', `⚠️ Server response: ${response.status}`);
      }
    } catch (error) {
      addDebugResult('Health Check', 'error', `❌ Health check failed: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ maxWidth: '400px' }}>
          <div className="login-form">
            <div className="login-title">Loading Users...</div>
            <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '1200px', minHeight: '600px' }}>
        <div className="login-form">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 className="login-title" style={{ margin: 0 }}>User Management</h1>
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
              ← Back to Dashboard
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {users.length === 0 ? (
            <div className="input-group">
              <div className="form-input" style={{ textAlign: 'center', padding: '40px 20px' }}>
                No users found
              </div>
            </div>
          ) : (
            <div className="input-group">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <th style={{ 
                        padding: '16px 12px', 
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Name</th>
                      <th style={{ 
                        padding: '16px 12px', 
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Email</th>
                      <th style={{ 
                        padding: '16px 12px', 
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Role</th>
                      <th style={{ 
                        padding: '16px 12px', 
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Country</th>
                      <th style={{ 
                        padding: '16px 12px', 
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Created</th>
                      <th style={{ 
                        padding: '16px 12px', 
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id || index} style={{ 
                        borderBottom: index < users.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        transition: 'background-color 0.3s ease'
                      }}>
                        <td style={{ 
                          padding: '16px 12px',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {user.name || user.firstName + ' ' + (user.lastName || '') || 'N/A'}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {user.email || 'N/A'}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {formatRole(user.role)}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {user.address?.country || user.country || 'N/A'}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {formatDate(user.createdAt || user.created)}
                        </td>
                        <td style={{ 
                          padding: '16px 12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleViewUser(user._id)}
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                border: '1px solid rgba(76, 175, 80, 0.4)',
                                borderRadius: '8px',
                                color: 'rgba(27, 94, 32, 0.9)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name || user.email)}
                              disabled={deleteLoading === user._id}
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                border: '1px solid rgba(244, 67, 54, 0.4)',
                                borderRadius: '8px',
                                color: 'rgba(183, 28, 28, 0.9)',
                                cursor: deleteLoading === user._id ? 'not-allowed' : 'pointer',
                                opacity: deleteLoading === user._id ? 0.6 : 1,
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {deleteLoading === user._id ? (
                                <>
                                  <span className="loading-spinner" style={{ 
                                    width: '12px', 
                                    height: '12px',
                                    border: '1px solid rgba(183, 28, 28, 0.3)',
                                    borderLeftColor: 'rgba(183, 28, 28, 0.9)'
                                  }}></span>
                                  Deleting...
                                </>
                              ) : (
                                <>🗑️ Delete</>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="input-group" style={{ marginTop: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ 
                color: 'white', 
                fontSize: '14px',
                opacity: 0.8
              }}>
                Total Users: {users.length}
              </div>
              <button 
                onClick={fetchUsers}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 20px',
                  fontSize: '14px'
                }}
                disabled={isLoading}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

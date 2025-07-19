import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/glassmorphism-login.css';

const TileManagement = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugResults, setDebugResults] = useState([]);

  // Form state for creating/editing tiles
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    company: '',
    stock: '',
    unit: 'pieces',
    length: '',
    width: '',
    sizeUnit: 'cm',
    thickness: '',
    finish: '',
    material: '',
    usage: [],
    isFeatured: false,
    imageUrl: '',
    textureUrl: '',
    likes: {
      count: 0,
      likedBy: []
    }
  });

  const categories = ['ceramic', 'porcelain', 'natural stone', 'mosaic', 'glass', 'metal'];
  const finishes = ['glossy', 'matte', 'textured', 'polished', 'brushed'];
  const materials = ['ceramic', 'porcelain', 'marble', 'granite', 'travertine', 'slate', 'glass', 'metal'];
  const usageOptions = ['bathroom', 'kitchen', 'living room', 'bedroom', 'outdoor', 'commercial'];

  const addDebugResult = (endpoint, status, message) => {
    setDebugResults(prev => [...prev, { 
      endpoint, 
      status, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: '',
      price: '',
      company: '',
      stock: '',
      unit: 'pieces',
      length: '',
      width: '',
      sizeUnit: 'cm',
      thickness: '',
      finish: '',
      material: '',
      usage: [],
      isFeatured: false,
      imageUrl: '',
      textureUrl: '',
      likes: {
        count: 0,
        likedBy: []
      }
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'usage') {
      const usageArray = [...form.usage];
      if (checked) {
        usageArray.push(value);
      } else {
        const index = usageArray.indexOf(value);
        if (index > -1) usageArray.splice(index, 1);
      }
      setForm(prev => ({ ...prev, usage: usageArray }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (error) setError('');
  };

  const fetchTiles = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('snapspace_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('Fetching tiles...');

      let response;
      try {
        response = await fetch('/api/admin/tiles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        addDebugResult('GET /api/admin/tiles (proxy)', response.ok ? 'success' : 'error', 
          `Status: ${response.status} ${response.statusText}`);
      } catch (proxyError) {
        console.log('Proxy failed, trying direct:', proxyError.message);
        addDebugResult('GET /api/admin/tiles (proxy)', 'error', `Proxy failed: ${proxyError.message}`);
        
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

  const handleCreateTile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!form.name.trim()) throw new Error('Name is required');
      if (!form.description.trim()) throw new Error('Description is required');
      if (!form.category) throw new Error('Category is required');
      if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
        throw new Error('Valid price is required');
      }
      if (!form.stock || isNaN(form.stock) || parseInt(form.stock) < 0) {
        throw new Error('Valid stock quantity is required');
      }

      const token = localStorage.getItem('snapspace_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const tileData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: parseFloat(form.price),
        company: form.company.trim() || 'SnapSpace Premium Tiles Pvt Ltd',
        inventory: {
          stock: parseInt(form.stock),
          unit: form.unit
        },
        specifications: {
          size: {
            length: form.length ? parseFloat(form.length) : null,
            width: form.width ? parseFloat(form.width) : null,
            unit: form.sizeUnit
          },
          thickness: form.thickness,
          finish: form.finish,
          material: form.material
        },
        usage: form.usage,
        isFeatured: form.isFeatured,
        imageUrl: form.imageUrl.trim(),
        textureUrl: form.textureUrl.trim(),
        likes: {
          count: form.likes?.count || 0,
          likedBy: form.likes?.likedBy || []
        }
      };

      console.log('Creating tile with data:', tileData);

      let response;
      try {
        response = await fetch('/api/admin/tiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tileData)
        });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct:', proxyError.message);
        response = await fetch('https://snapspace-ry3k.onrender.com/api/admin/tiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tileData)
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

      const responseData = await response.json();
      console.log('Tile created successfully:', responseData);

      // Reset form and refresh tiles
      resetForm();
      setShowCreateForm(false);
      await fetchTiles();

    } catch (err) {
      console.error('Error creating tile:', err);
      setError(err.message || 'Failed to create tile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTile = async (e) => {
    e.preventDefault();
    if (!editingTile) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('snapspace_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const tileData = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: parseFloat(form.price),
        company: form.company.trim() || 'SnapSpace Premium Tiles Pvt Ltd',
        inventory: {
          stock: parseInt(form.stock),
          unit: form.unit
        },
        specifications: {
          size: {
            length: form.length ? parseFloat(form.length) : null,
            width: form.width ? parseFloat(form.width) : null,
            unit: form.sizeUnit
          },
          thickness: form.thickness,
          finish: form.finish,
          material: form.material
        },
        usage: form.usage,
        isFeatured: form.isFeatured,
        imageUrl: form.imageUrl.trim(),
        textureUrl: form.textureUrl.trim(),
        likes: {
          count: form.likes?.count || editingTile.likes?.count || 0,
          likedBy: form.likes?.likedBy || editingTile.likes?.likedBy || []
        }
      };

      console.log('Updating tile with data:', tileData);

      let response;
      try {
        response = await fetch(`/api/admin/tiles/${editingTile._id || editingTile.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tileData)
        });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct:', proxyError.message);
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/admin/tiles/${editingTile._id || editingTile.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tileData)
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

      const responseData = await response.json();
      console.log('Tile updated successfully:', responseData);

      // Reset form and refresh tiles
      resetForm();
      setShowEditForm(false);
      setEditingTile(null);
      await fetchTiles();

    } catch (err) {
      console.error('Error updating tile:', err);
      setError(err.message || 'Failed to update tile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTile = async (tile) => {
    if (!window.confirm(`Are you sure you want to delete "${tile.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('snapspace_token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log(`Deleting tile ${tile._id || tile.id}...`);

      let response;
      try {
        response = await fetch(`/api/admin/tiles/${tile._id || tile.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (proxyError) {
        console.log('Proxy failed, trying direct:', proxyError.message);
        response = await fetch(`https://snapspace-ry3k.onrender.com/api/admin/tiles/${tile._id || tile.id}`, {
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

      console.log(`Tile ${tile._id || tile.id} deleted successfully`);
      await fetchTiles();
      
    } catch (err) {
      console.error('Error deleting tile:', err);
      alert(`Failed to delete tile: ${err.message}`);
    }
  };

  const startEditTile = (tile) => {
    setEditingTile(tile);
    setForm({
      name: tile.name || '',
      description: tile.description || '',
      category: tile.category || '',
      price: tile.price || '',
      company: tile.company || 'SnapSpace Premium Tiles Pvt Ltd',
      stock: tile.inventory?.stock || '',
      unit: tile.inventory?.unit || 'pieces',
      length: tile.specifications?.size?.length || '',
      width: tile.specifications?.size?.width || '',
      sizeUnit: tile.specifications?.size?.unit || 'cm',
      thickness: tile.specifications?.thickness || '',
      finish: tile.specifications?.finish || '',
      material: tile.specifications?.material || '',
      usage: tile.usage || [],
      isFeatured: tile.isFeatured || false,
      imageUrl: tile.imageUrl || '',
      textureUrl: tile.textureUrl || '',
      likes: {
        count: tile.likes?.count || 0,
        likedBy: tile.likes?.likedBy || []
      }
    });
    setShowEditForm(true);
    setShowCreateForm(false);
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

  // Group tiles by category
  const groupedTiles = tiles.reduce((acc, tile) => {
    const category = tile.category || 'uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tile);
    return acc;
  }, {});

  if (isLoading && !showCreateForm && !showEditForm) {
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
                onClick={() => {
                  setShowCreateForm(!showCreateForm);
                  setShowEditForm(false);
                  resetForm();
                }}
                className="login-button"
                style={{ 
                  width: 'auto',
                  height: '40px',
                  padding: '0 16px',
                  fontSize: '12px',
                  backgroundColor: showCreateForm ? 'rgba(76, 175, 80, 0.2)' : 'rgba(33, 150, 243, 0.2)'
                }}
              >
                {showCreateForm ? '❌ Cancel' : '➕ Create Tile'}
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

          {/* Create/Edit Form */}
          {(showCreateForm || showEditForm) && (
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <div className="input-label">
                {showEditForm ? `Edit Tile: ${editingTile?.name}` : 'Create New Tile'}
              </div>
              <form onSubmit={showEditForm ? handleEditTile : handleCreateTile}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  {/* Left Column */}
                  <div>
                    <div className="input-group">
                      <label className="input-label">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter tile name"
                        className="form-input"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="SnapSpace Premium Tiles Pvt Ltd"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Category *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="form-input"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Price * ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="form-input"
                        step="0.01"
                        min="0"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <div className="input-group">
                        <label className="input-label">Stock *</label>
                        <input
                          type="number"
                          name="stock"
                          value={form.stock}
                          onChange={handleChange}
                          placeholder="0"
                          className="form-input"
                          min="0"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Unit</label>
                        <select
                          name="unit"
                          value={form.unit}
                          onChange={handleChange}
                          className="form-input"
                          disabled={isLoading}
                        >
                          <option value="pieces">pieces</option>
                          <option value="boxes">boxes</option>
                          <option value="sqft">sqft</option>
                          <option value="sqm">sqm</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Size</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '8px' }}>
                        <input
                          type="number"
                          name="length"
                          value={form.length}
                          onChange={handleChange}
                          placeholder="Length"
                          className="form-input"
                          step="0.1"
                          disabled={isLoading}
                        />
                        <input
                          type="number"
                          name="width"
                          value={form.width}
                          onChange={handleChange}
                          placeholder="Width"
                          className="form-input"
                          step="0.1"
                          disabled={isLoading}
                        />
                        <select
                          name="sizeUnit"
                          value={form.sizeUnit}
                          onChange={handleChange}
                          className="form-input"
                          disabled={isLoading}
                        >
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Thickness</label>
                      <input
                        type="text"
                        name="thickness"
                        value={form.thickness}
                        onChange={handleChange}
                        placeholder="e.g., 8mm"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="input-group">
                      <label className="input-label">Description *</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter tile description..."
                        className="form-input"
                        rows="3"
                        required
                        disabled={isLoading}
                        style={{ resize: 'vertical', minHeight: '80px' }}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Material</label>
                      <select
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        className="form-input"
                        disabled={isLoading}
                      >
                        <option value="">Select material</option>
                        {materials.map(mat => (
                          <option key={mat} value={mat}>{mat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Finish</label>
                      <select
                        name="finish"
                        value={form.finish}
                        onChange={handleChange}
                        className="form-input"
                        disabled={isLoading}
                      >
                        <option value="">Select finish</option>
                        {finishes.map(finish => (
                          <option key={finish} value={finish}>{finish}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Usage Areas</label>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        padding: '12px',
                        borderRadius: '8px'
                      }}>
                        {usageOptions.map(usage => (
                          <label key={usage} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}>
                            <input
                              type="checkbox"
                              name="usage"
                              value={usage}
                              checked={form.usage.includes(usage)}
                              onChange={handleChange}
                              disabled={isLoading}
                              style={{ accentColor: '#007bff' }}
                            />
                            {usage}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Image URL</label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Texture URL</label>
                      <input
                        type="url"
                        name="textureUrl"
                        value={form.textureUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/texture.jpg"
                        className="form-input"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Likes Count</label>
                      <input
                        type="number"
                        name="likesCount"
                        value={form.likes?.count || 0}
                        onChange={(e) => {
                          const count = parseInt(e.target.value) || 0;
                          setForm(prev => ({
                            ...prev,
                            likes: {
                              ...prev.likes,
                              count: count
                            }
                          }));
                        }}
                        placeholder="0"
                        className="form-input"
                        min="0"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={form.isFeatured}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#007bff'
                          }}
                        />
                        Featured Tile
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button 
                    type="submit" 
                    className="login-button"
                    disabled={isLoading}
                    style={{ flex: 1, height: '45px' }}
                  >
                    {isLoading && <span className="loading-spinner"></span>}
                    {isLoading ? (showEditForm ? 'Updating...' : 'Creating...') : 
                                (showEditForm ? '💾 Update Tile' : '🎯 Create Tile')}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setShowEditForm(false);
                      setEditingTile(null);
                      resetForm();
                    }}
                    className="login-button"
                    style={{ 
                      width: 'auto',
                      padding: '0 20px',
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      color: '#f44336'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tiles List */}
          <div className="input-group">
            <div className="input-label">Tiles by Category ({tiles.length} total)</div>
            {Object.keys(groupedTiles).length === 0 ? (
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
                  onClick={() => {
                    setShowCreateForm(true);
                    setShowEditForm(false);
                    resetForm();
                  }}
                  className="login-button"
                  style={{ width: 'auto', padding: '0 24px' }}
                >
                  ➕ Create First Tile
                </button>
              </div>
            ) : (
              <div style={{ 
                maxHeight: '600px', 
                overflowY: 'auto',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                {Object.entries(groupedTiles).map(([category, categoryTiles]) => (
                  <div key={category} style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      color: 'white', 
                      marginBottom: '12px',
                      textTransform: 'capitalize',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                      paddingBottom: '8px'
                    }}>
                      {category} ({categoryTiles.length})
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                      gap: '16px'
                    }}>
                      {categoryTiles.map((tile) => (
                        <div key={tile._id || tile.id} style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h4 style={{ margin: '0', color: 'white', fontSize: '16px' }}>{tile.name}</h4>
                            {tile.isFeatured && (
                              <span style={{
                                backgroundColor: 'rgba(255, 193, 7, 0.3)',
                                color: '#ffc107',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                FEATURED
                              </span>
                            )}
                          </div>

                          {tile.company && (
                            <div style={{ 
                              marginBottom: '8px', 
                              color: 'rgba(255, 255, 255, 0.9)', 
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              display: 'inline-block'
                            }}>
                              🏢 {tile.company}
                            </div>
                          )}
                          
                          <p style={{ margin: '0 0 8px 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', lineHeight: '1.3' }}>
                            {tile.description}
                          </p>

                          {/* Likes Section */}
                          <div style={{
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            borderRadius: '8px',
                            padding: '8px',
                            marginBottom: '12px',
                            border: '1px solid rgba(244, 67, 54, 0.3)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ color: '#f44336', fontSize: '12px', fontWeight: '600' }}>
                                ❤️ {tile.likes?.count || 0} Likes
                              </span>
                              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '10px' }}>
                                {tile.likes?.likedBy?.length || 0} users
                              </span>
                            </div>
                            {tile.likes?.likedBy && tile.likes.likedBy.length > 0 && (
                              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Recent: {tile.likes.likedBy.slice(-2).map(like => 
                                  `${like.userId}`
                                ).join(', ')}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '12px', marginBottom: '12px' }}>
                            <div><strong>Price:</strong> ${tile.price}</div>
                            <div><strong>Stock:</strong> {tile.inventory?.stock} {tile.inventory?.unit}</div>
                            {tile.specifications?.size?.length && (
                              <div><strong>Size:</strong> {tile.specifications.size.length}x{tile.specifications.size.width} {tile.specifications.size.unit}</div>
                            )}
                            {tile.specifications?.thickness && (
                              <div><strong>Thickness:</strong> {tile.specifications.thickness}</div>
                            )}
                            {tile.specifications?.material && (
                              <div><strong>Material:</strong> {tile.specifications.material}</div>
                            )}
                            {tile.specifications?.finish && (
                              <div><strong>Finish:</strong> {tile.specifications.finish}</div>
                            )}
                          </div>

                          {tile.usage && tile.usage.length > 0 && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Usage:</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {tile.usage.map(use => (
                                  <span key={use} style={{
                                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                    color: '#2196f3',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '10px'
                                  }}>
                                    {use}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => startEditTile(tile)}
                              className="login-button"
                              style={{ 
                                flex: 1,
                                height: '32px',
                                fontSize: '11px',
                                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                color: '#2196f3'
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteTile(tile)}
                              className="login-button"
                              style={{ 
                                flex: 1,
                                height: '32px',
                                fontSize: '11px',
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
              <strong>API Endpoints:</strong><br />
              • GET /api/admin/tiles - Fetch all tiles<br />
              • POST /api/admin/tiles - Create new tile<br />
              • PUT /api/admin/tiles/:id - Update tile<br />
              • DELETE /api/admin/tiles/:id - Delete tile<br />
              <strong>Features:</strong> CRUD operations, category grouping, featured tiles, debug panel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileManagement;

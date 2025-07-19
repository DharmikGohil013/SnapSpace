import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TilesList.module.css';

const TilesList = () => {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://snapspace-ry3k.onrender.com/api/admin/tiles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setTiles(data.tiles);
        setMessage({ type: 'success', text: `${data.tiles.length} tiles loaded successfully` });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch tiles' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error while fetching tiles' });
      console.error('Fetch tiles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 className={styles.title}>All Tiles</h1>
          <p className={styles.subtitle}>Manage your tile inventory</p>
          <button 
            className={styles.addButton}
            onClick={() => navigate('/admin/create-tile')}
          >
            + Add New Tile
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.tilesCard}>
          <div className={styles.tilesHeader}>
            <h2>All Tiles ({tiles.length})</h2>
            <button onClick={fetchTiles} className={styles.refreshButton} disabled={loading}>
              {loading ? '⟳' : '↻'} Refresh
            </button>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading tiles...</p>
            </div>
          ) : tiles.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tiles found. Add your first tile!</p>
              <button 
                className={styles.createFirstButton}
                onClick={() => navigate('/admin/create-tile')}
              >
                Create Your First Tile
              </button>
            </div>
          ) : (
            <div className={styles.tilesGrid}>
              {tiles.map((tile) => (
                <div key={tile._id} className={styles.tileCard}>
                  <div className={styles.tileHeader}>
                    <h3 className={styles.tileTitle}>{tile.name}</h3>
                    {tile.tileId && <span className={styles.tileId}>#{tile.tileId}</span>}
                  </div>
                  
                  <div className={styles.tileContent}>
                    <p className={styles.tileDescription}>
                      {(tile.description || '').length > 100 
                        ? `${tile.description.substring(0, 100)}...` 
                        : tile.description || 'No description'}
                    </p>
                    
                    <div className={styles.tileDetails}>
                      <div className={styles.priceSection}>
                        <span className={styles.price}>{formatPrice(tile.price)}</span>
                        <span className={styles.quantity}>
                          Qty: {tile.inventory?.stock || 0}
                        </span>
                      </div>
                      
                      <div className={styles.specs}>
                        {tile.category && (
                          <span className={styles.spec}>
                            Category: {tile.category}
                          </span>
                        )}
                        {tile.specifications?.material && (
                          <span className={styles.spec}>
                            Material: {tile.specifications.material}
                          </span>
                        )}
                        {tile.specifications?.finish && (
                          <span className={styles.spec}>
                            Finish: {tile.specifications.finish}
                          </span>
                        )}
                        {tile.specifications?.size?.length && tile.specifications?.size?.width && (
                          <span className={styles.spec}>
                            Size: {tile.specifications.size.length}x{tile.specifications.size.width} {tile.specifications.size.unit}
                          </span>
                        )}
                      </div>

                      {tile.usage && tile.usage.length > 0 && (
                        <div className={styles.usageArea}>
                          <strong>Usage:</strong> {tile.usage.join(', ')}
                        </div>
                      )}

                      {tile.isFeatured && (
                        <div className={styles.featuredBadge}>
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.tileFooter}>
                    <span className={styles.date}>
                      Created: {formatDate(tile.createdAt)}
                    </span>
                    <div className={styles.actions}>
                      <button className={styles.editButton}>Edit</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TilesList;

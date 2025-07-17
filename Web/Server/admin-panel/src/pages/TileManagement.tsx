import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Tile } from '../types';
import { Package, Plus, Edit, Trash2, Star, Eye, Search } from 'lucide-react';

const TileManagement: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);

  useEffect(() => {
    loadTiles();
  }, []);

  const loadTiles = async () => {
    try {
      const data = await adminService.getAllTiles();
      setTiles(data.tiles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tiles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tile?')) {
      try {
        await adminService.deleteTile(id);
        await loadTiles();
      } catch (err: any) {
        alert('Failed to delete tile: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await adminService.toggleFeatured(id);
      await loadTiles();
    } catch (err: any) {
      alert('Failed to toggle featured: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredTiles = tiles.filter(tile =>
    tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tile.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading tiles...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tile Management</h1>
          <p style={styles.subtitle}>Manage all tiles in your inventory</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={styles.addButton}
        >
          <Plus size={20} />
          Add New Tile
        </button>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <input
            type="text"
            placeholder="Search tiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          Error: {error}
        </div>
      )}

      <div style={styles.grid}>
        {filteredTiles.map((tile) => (
          <div key={tile._id} style={styles.tileCard}>
            <div style={styles.tileHeader}>
              <div style={styles.tileImage}>
                {tile.images && tile.images.length > 0 ? (
                  <img
                    src={tile.images[0].url}
                    alt={tile.name}
                    style={styles.image}
                  />
                ) : (
                  <Package size={40} color="#6b7280" />
                )}
              </div>
              <div style={styles.featuredBadge}>
                {tile.isFeatured && (
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                )}
              </div>
            </div>

            <div style={styles.tileContent}>
              <h3 style={styles.tileName}>{tile.name}</h3>
              <p style={styles.tileCategory}>{tile.category}</p>
              <p style={styles.tileDescription}>
                {tile.description.length > 100
                  ? tile.description.substring(0, 100) + '...'
                  : tile.description}
              </p>
              
              <div style={styles.tileStats}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Price:</span>
                  <span style={styles.statValue}>₹{tile.price}</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Stock:</span>
                  <span style={styles.statValue}>{tile.inventory.stock}</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Status:</span>
                  <span style={{
                    ...styles.statValue,
                    color: tile.isActive ? '#10B981' : '#EF4444'
                  }}>
                    {tile.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div style={styles.tileActions}>
                <button
                  onClick={() => handleToggleFeatured(tile._id)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: tile.isFeatured ? '#FEF3C7' : '#F3F4F6',
                    color: tile.isFeatured ? '#D97706' : '#6B7280'
                  }}
                  title={tile.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={() => setEditingTile(tile)}
                  style={styles.actionButton}
                  title="Edit tile"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTile(tile._id)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626'
                  }}
                  title="Delete tile"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTiles.length === 0 && !isLoading && (
        <div style={styles.noResults}>
          <Package size={48} color="#6b7280" />
          <h3 style={styles.noResultsTitle}>No tiles found</h3>
          <p style={styles.noResultsText}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first tile'}
          </p>
        </div>
      )}

      {showCreateForm && (
        <CreateTileModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadTiles();
          }}
        />
      )}

      {editingTile && (
        <EditTileModal
          tile={editingTile}
          onClose={() => setEditingTile(null)}
          onSuccess={() => {
            setEditingTile(null);
            loadTiles();
          }}
        />
      )}
    </div>
  );
};

// Create Tile Modal Component
const CreateTileModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'ceramic',
    price: '',
    stock: '',
    material: '',
    size: '',
    finish: '',
    color: '',
    usage: '',
    isFeatured: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tileData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        inventory: {
          stock: Number(formData.stock),
          unit: 'pieces',
          lowStockAlert: 10
        },
        specifications: {
          size: {
            length: 30,
            width: 30,
            thickness: 8,
            unit: 'cm'
          },
          material: formData.material,
          finish: formData.finish,
          color: formData.color,
          pattern: 'Plain',
          usage: formData.usage.split(',').map(u => u.trim())
        },
        images: [{
          url: 'https://via.placeholder.com/300x300?text=Tile',
          altText: formData.name
        }],
        tags: [formData.category, formData.material.toLowerCase()],
        isFeatured: formData.isFeatured,
        isActive: true
      };

      await adminService.createTile(tileData);
      onSuccess();
    } catch (err: any) {
      alert('Failed to create tile: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>Create New Tile</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={styles.input}
                required
              >
                <option value="ceramic">Ceramic</option>
                <option value="porcelain">Porcelain</option>
                <option value="stone">Stone</option>
                <option value="glass">Glass</option>
                <option value="mosaic">Mosaic</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{...styles.input, minHeight: '80px'}}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                style={styles.input}
                placeholder="e.g., Ceramic, Marble"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Finish</label>
              <input
                type="text"
                value={formData.finish}
                onChange={(e) => setFormData({...formData, finish: e.target.value})}
                style={styles.input}
                placeholder="e.g., Glossy, Matt"
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                style={styles.input}
                placeholder="e.g., White, Beige"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Usage (comma separated)</label>
              <input
                type="text"
                value={formData.usage}
                onChange={(e) => setFormData({...formData, usage: e.target.value})}
                style={styles.input}
                placeholder="e.g., Bathroom, Kitchen"
              />
            </div>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              />
              Featured Tile
            </label>
          </div>

          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
              {isSubmitting ? 'Creating...' : 'Create Tile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Tile Modal (simplified version)
const EditTileModal: React.FC<{
  tile: Tile;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ tile, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: tile.name,
    description: tile.description,
    price: tile.price.toString(),
    stock: tile.inventory.stock.toString(),
    isFeatured: tile.isFeatured
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await adminService.updateTile(tile._id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        inventory: {
          ...tile.inventory,
          stock: Number(formData.stock)
        },
        isFeatured: formData.isFeatured
      });
      onSuccess();
    } catch (err: any) {
      alert('Failed to update tile: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>Edit Tile</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{...styles.input, minHeight: '80px'}}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              />
              Featured Tile
            </label>
          </div>

          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
              {isSubmitting ? 'Updating...' : 'Update Tile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '16px'
  },
  addButton: {
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  controls: {
    marginBottom: '24px'
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '400px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  tileCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  tileHeader: {
    position: 'relative',
    height: '200px',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  featuredBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'white',
    borderRadius: '20px',
    padding: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tileContent: {
    padding: '20px'
  },
  tileName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px'
  },
  tileCategory: {
    fontSize: '14px',
    color: '#4F46E5',
    fontWeight: '500',
    marginBottom: '8px',
    textTransform: 'capitalize'
  },
  tileDescription: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '16px'
  },
  tileStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
  },
  statLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  statValue: {
    color: '#1f2937',
    fontWeight: '600'
  },
  tileActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#6b7280'
  },
  noResultsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '16px 0 8px 0',
    color: '#374151'
  },
  noResultsText: {
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#6b7280'
  },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0 24px',
    borderBottom: '1px solid #e5e7eb'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280'
  },
  form: {
    padding: '24px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  checkboxGroup: {
    marginBottom: '24px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '12px 24px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'white',
    color: '#374151',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: '#4F46E5',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default TileManagement;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateTile.module.css';

const CreateTile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: true,
    inventory: {
      stock: '',
      unit: 'pieces'
    },
    specifications: {
      size: {
        length: '',
        width: '',
        unit: 'cm'
      },
      thickness: '',
      finish: '',
      material: ''
    },
    dimensions: '',
    color: '',
    brand: '',
    usage: [],
    isFeatured: false
  });

  const categories = ['ceramic', 'porcelain', 'marble', 'granite', 'stone', 'glass', 'metal', 'vinyl', 'wood'];
  const finishes = ['glossy', 'matte', 'textured', 'polished', 'brushed', 'natural'];
  const usageOptions = ['bathroom', 'kitchen', 'living room', 'bedroom', 'outdoor', 'commercial'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: type === 'checkbox' ? checked : value
          } : type === 'checkbox' ? checked : value
        }
      }));
    } else if (name === 'usage') {
      const usage = [...formData.usage];
      if (checked) {
        usage.push(value);
      } else {
        const index = usage.indexOf(value);
        if (index > -1) {
          usage.splice(index, 1);
        }
      }
      setFormData(prev => ({ ...prev, usage }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear message when user starts typing
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare data for API
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inventory: {
          stock: parseInt(formData.inventory.stock),
          unit: formData.inventory.unit
        },
        specifications: {
          size: {
            length: parseFloat(formData.specifications.size.length) || undefined,
            width: parseFloat(formData.specifications.size.width) || undefined,
            unit: formData.specifications.size.unit
          },
          thickness: formData.specifications.thickness,
          finish: formData.specifications.finish,
          material: formData.specifications.material
        },
        usage: formData.usage,
        isFeatured: formData.isFeatured
      };

      const response = await fetch('https://snapspace-ry3k.onrender.com/api/admin/tiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Tile created successfully!' });
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          inStock: true,
          inventory: {
            stock: '',
            unit: 'pieces'
          },
          specifications: {
            size: {
              length: '',
              width: '',
              unit: 'cm'
            },
            thickness: '',
            finish: '',
            material: ''
          },
          dimensions: '',
          color: '',
          brand: '',
          usage: [],
          isFeatured: false
        });
        
        // Optional: Redirect to tiles list after 2 seconds
        setTimeout(() => {
          navigate('/admin/tiles');
        }, 2000);
        
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create tile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error while creating tile' });
      console.error('Create tile error:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className={styles.title}>Create New Tile</h1>
          <p className={styles.subtitle}>Add a new tile to your inventory</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Tile Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter tile name"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter tile description"
                  rows="4"
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Pricing & Inventory</h3>
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="inventory.stock">Stock Quantity *</label>
                  <input
                    type="number"
                    id="inventory.stock"
                    name="inventory.stock"
                    value={formData.inventory.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label htmlFor="isFeatured" className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span>Featured Tile</span>
                </label>
              </div>
            </div>

            {/* Specifications */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Specifications</h3>
              
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="specifications.size.length">Length (cm)</label>
                  <input
                    type="number"
                    id="specifications.size.length"
                    name="specifications.size.length"
                    value={formData.specifications.size.length}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="30"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="specifications.size.width">Width (cm)</label>
                  <input
                    type="number"
                    id="specifications.size.width"
                    name="specifications.size.width"
                    value={formData.specifications.size.width}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="specifications.thickness">Thickness</label>
                  <input
                    type="text"
                    id="specifications.thickness"
                    name="specifications.thickness"
                    value={formData.specifications.thickness}
                    onChange={handleInputChange}
                    placeholder="e.g., 8mm, 10mm"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="specifications.material">Material</label>
                  <input
                    type="text"
                    id="specifications.material"
                    name="specifications.material"
                    value={formData.specifications.material}
                    onChange={handleInputChange}
                    placeholder="e.g., Ceramic, Porcelain"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="specifications.finish">Finish</label>
                <select
                  id="specifications.finish"
                  name="specifications.finish"
                  value={formData.specifications.finish}
                  onChange={handleInputChange}
                >
                  <option value="">Select finish</option>
                  {finishes.map(finish => (
                    <option key={finish} value={finish}>
                      {finish.charAt(0).toUpperCase() + finish.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Usage Areas */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Usage Areas</h3>
              <div className={styles.checkboxGrid}>
                {usageOptions.map(option => (
                  <label key={option} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="usage"
                      value={option}
                      checked={formData.usage.includes(option)}
                      onChange={handleInputChange}
                    />
                    <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles.submitSection}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <div className={styles.spinner}></div>
                ) : (
                  'Create Tile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTile;

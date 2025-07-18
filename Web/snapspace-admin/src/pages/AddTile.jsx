import React, { useState } from 'react';
import { createTile } from '../api/tileApi';
import Toast from '../components/Toast';

const initialTile = {
  name: '',
  description: '',
  category: 'ceramic',
  price: '',
  inventory: { stock: '', unit: 'pieces' },
  specifications: {
    size: { length: '', width: '', unit: 'cm' },
    thickness: '',
    finish: '',
    material: ''
  },
  usage: '',
  isFeatured: false,
  imageUrl: '',
  textureUrl: '',
};

const categoryOptions = ['ceramic', 'porcelain', 'stone', 'glass', 'mosaic'];

const AddTile = () => {
  const [tile, setTile] = useState(initialTile);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // handle nested fields
    if (name.startsWith('specifications.size.')) {
      const key = name.split('.')[2];
      setTile((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          size: { ...prev.specifications.size, [key]: value }
        }
      }));
    } else if (name.startsWith('specifications.')) {
      const key = name.split('.')[1];
      setTile((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [key]: value }
      }));
    } else if (name.startsWith('inventory.')) {
      const key = name.split('.')[1];
      setTile((prev) => ({
        ...prev,
        inventory: { ...prev.inventory, [key]: value }
      }));
    } else if (name === 'usage') {
      setTile((prev) => ({ ...prev, usage: value }));
    } else if (name === 'isFeatured') {
      setTile((prev) => ({ ...prev, isFeatured: e.target.checked }));
    } else {
      setTile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tileToSend = {
      ...tile,
      usage: tile.usage.split(',').map(u => u.trim()).filter(Boolean)
    };
    try {
      await createTile(tileToSend);
      setToast('Tile added!');
      setTile(initialTile);
    } catch (err) {
      setToast('Failed to add tile');
    }
  };

  return (
    <div className="container max-w-xl mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Tile</h2>
      <form className="card flex flex-col gap-4" onSubmit={handleSubmit}>
        <input name="name" value={tile.name} onChange={handleChange} placeholder="Tile Name" required className="p-2 border rounded" />
        <textarea name="description" value={tile.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />
        <select name="category" value={tile.category} onChange={handleChange} required className="p-2 border rounded">
          {categoryOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <input name="price" type="number" value={tile.price} onChange={handleChange} placeholder="Price" required className="p-2 border rounded" />
        <div className="flex gap-2">
          <input name="inventory.stock" type="number" value={tile.inventory.stock} onChange={handleChange} placeholder="Stock" className="p-2 border rounded" />
          <input name="inventory.unit" value={tile.inventory.unit} onChange={handleChange} placeholder="Unit" className="p-2 border rounded" />
        </div>
        <div className="flex gap-2">
          <input name="specifications.size.length" type="number" value={tile.specifications.size.length} onChange={handleChange} placeholder="Length (cm)" className="p-2 border rounded" />
          <input name="specifications.size.width" type="number" value={tile.specifications.size.width} onChange={handleChange} placeholder="Width (cm)" className="p-2 border rounded" />
        </div>
        <input name="specifications.thickness" value={tile.specifications.thickness} onChange={handleChange} placeholder="Thickness" className="p-2 border rounded" />
        <input name="specifications.finish" value={tile.specifications.finish} onChange={handleChange} placeholder="Finish" className="p-2 border rounded" />
        <input name="specifications.material" value={tile.specifications.material} onChange={handleChange} placeholder="Material" className="p-2 border rounded" />
        <input name="usage" value={tile.usage} onChange={handleChange} placeholder="Usage (comma separated)" className="p-2 border rounded" />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" checked={tile.isFeatured} onChange={handleChange} />
          <span>Featured</span>
        </div>
        <input name="imageUrl" value={tile.imageUrl} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" />
        <input name="textureUrl" value={tile.textureUrl} onChange={handleChange} placeholder="Texture URL" className="p-2 border rounded" />
        <button type="submit">Add Tile</button>
      </form>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AddTile;

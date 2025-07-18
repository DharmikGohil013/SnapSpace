import React, { useEffect, useState } from 'react';
import { getAllTiles, deleteTile } from '../api/tileApi';
import Toast from '../components/Toast';
import { Link } from 'react-router-dom';

const Tiles = () => {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchTiles = async () => {
    setLoading(true);
    try {
      const res = await getAllTiles();
      setTiles(res.data.tiles);
    } catch {
      setToast('Failed to fetch tiles');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tile?')) return;
    try {
      await deleteTile(id);
      setTiles(tiles.filter((t) => t._id !== id));
      setToast('Tile deleted');
    } catch {
      setToast('Delete failed');
    }
  };

  return (
    <div className="container mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Tiles</h2>
        <Link to="/tiles/new" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">+ Add Tile</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : tiles.length === 0 ? (
        <div>No tiles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Category</th>
                <th className="p-2 border-b">Price</th>
                <th className="p-2 border-b">Stock</th>
                <th className="p-2 border-b">Featured</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tiles.map(tile => (
                <tr key={tile._id}>
                  <td className="p-2 border-b">{tile.name}</td>
                  <td className="p-2 border-b">{tile.category}</td>
                  <td className="p-2 border-b">{tile.price}</td>
                  <td className="p-2 border-b">{tile.inventory?.stock}</td>
                  <td className="p-2 border-b">{tile.isFeatured ? 'Yes' : 'No'}</td>
                  <td className="p-2 border-b flex gap-2">
                    {/* <Link to={`/tiles/edit/${tile._id}`} className="text-blue-500 underline">Edit</Link> */}
                    <button className="text-red-500 underline" onClick={() => handleDelete(tile._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Tiles;

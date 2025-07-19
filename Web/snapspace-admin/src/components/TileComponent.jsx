import React, { useState } from 'react';

// Sample tile component with the structure you requested
const TileComponent = () => {
  const [tile, setTile] = useState({
    name: 'Premium Ceramic Floor Tile',
    description: 'High-quality ceramic floor tile perfect for residential and commercial spaces. Features excellent durability and elegant finish.',
    category: 'ceramic',
    price: 45.99,
    company: 'SnapSpace Premium Tiles Pvt Ltd',
    specs: {
      size: { length: 60, width: 60, unit: 'cm' },
      thickness: '8mm',
      finish: 'glossy',
      material: 'ceramic'
    },
    inventory: {
      stock: 500,
      unit: 'pieces'
    },
    usage: ['bathroom', 'kitchen', 'living room'],
    isFeatured: true,
    imageUrl: 'https://example.com/tile-image.jpg',
    textureUrl: 'https://example.com/tile-texture.jpg',
    likes: {
      count: 8,
      likedBy: [
        {
          userId: 'user_001',
          likedAt: new Date('2025-01-15T10:30:00Z').toISOString()
        },
        {
          userId: 'user_002', 
          likedAt: new Date('2025-01-16T14:20:00Z').toISOString()
        },
        {
          userId: 'user_003',
          likedAt: new Date('2025-01-17T09:15:00Z').toISOString()
        }
      ]
    },
    createdAt: new Date('2025-01-10T12:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-17T09:15:00Z').toISOString()
  });

  const handleLike = (userId) => {
    setTile(prevTile => {
      const isLiked = prevTile.likes.likedBy.some(like => like.userId === userId);
      
      if (isLiked) {
        // Unlike
        return {
          ...prevTile,
          likes: {
            count: prevTile.likes.count - 1,
            likedBy: prevTile.likes.likedBy.filter(like => like.userId !== userId)
          }
        };
      } else {
        // Like
        return {
          ...prevTile,
          likes: {
            count: prevTile.likes.count + 1,
            likedBy: [
              ...prevTile.likes.likedBy,
              {
                userId: userId,
                likedAt: new Date().toISOString()
              }
            ]
          }
        };
      }
    });
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h3 style={{ margin: '0', color: 'white', fontSize: '20px' }}>{tile.name}</h3>
        {tile.isFeatured && (
          <span style={{
            backgroundColor: 'rgba(255, 193, 7, 0.3)',
            color: '#ffc107',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            FEATURED
          </span>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', marginBottom: '8px' }}>
          <strong>Company:</strong> {tile.company}
        </div>
        <p style={{ margin: '0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.4' }}>
          {tile.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', marginBottom: '16px' }}>
        <div><strong>Price:</strong> ${tile.price}</div>
        <div><strong>Stock:</strong> {tile.inventory.stock} {tile.inventory.unit}</div>
        <div><strong>Category:</strong> {tile.category}</div>
        <div><strong>Material:</strong> {tile.specs.material}</div>
        <div><strong>Size:</strong> {tile.specs.size.length}x{tile.specs.size.width} {tile.specs.size.unit}</div>
        <div><strong>Finish:</strong> {tile.specs.finish}</div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Usage Areas:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tile.usage.map(use => (
            <span key={use} style={{
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              color: '#2196f3',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              {use}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600' }}>
            ❤️ {tile.likes.count} Likes
          </span>
          <button
            onClick={() => handleLike('current_user')}
            style={{
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              border: '1px solid rgba(244, 67, 54, 0.4)',
              borderRadius: '6px',
              padding: '4px 12px',
              color: '#f44336',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Like
          </button>
        </div>
        
        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
          <strong>Recent Likes:</strong>
          <div style={{ marginTop: '4px' }}>
            {tile.likes.likedBy.slice(-3).map((like, index) => (
              <div key={like.userId} style={{ marginBottom: '2px' }}>
                • User {like.userId} - {new Date(like.likedAt).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
        Created: {new Date(tile.createdAt).toLocaleDateString()} | 
        Updated: {new Date(tile.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TileComponent;

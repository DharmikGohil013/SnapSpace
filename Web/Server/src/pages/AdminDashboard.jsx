import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const dashboardCards = [
    {
      title: 'Tiles',
      description: 'Manage tile inventory',
      icon: '🔲',
      path: '/admin/tiles',
      color: 'blue'
    },
    {
      title: 'Create Tile',
      description: 'Add new tiles',
      icon: '➕',
      path: '/admin/create-tile',
      color: 'green'
    },
    {
      title: 'Users',
      description: 'Manage users',
      icon: '👥',
      path: '/admin/users',
      color: 'purple'
    },
    {
      title: 'Analytics',
      description: 'View reports',
      icon: '📊',
      path: '/admin/analytics',
      color: 'orange'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Welcome back! Manage your SnapSpace platform</p>
          </div>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className={styles.cardsGrid}>
          {dashboardCards.map((card, index) => (
            <div 
              key={index}
              className={`${styles.card} ${styles[card.color]}`}
              onClick={() => navigate(card.path)}
            >
              <div className={styles.cardIcon}>
                {card.icon}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
              </div>
              <div className={styles.cardArrow}>
                →
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className={styles.statsCard}>
          <h2 className={styles.statsTitle}>Quick Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Total Tiles</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>$0</div>
              <div className={styles.statLabel}>Revenue</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>0</div>
              <div className={styles.statLabel}>Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

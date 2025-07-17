import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { DashboardStats } from '../types';
import { BarChart3, Users, Package, Star, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (!stats) return null;

  const statsCards = [
    {
      title: 'Total Tiles',
      value: stats.tiles.total,
      subtitle: `${stats.tiles.active} active`,
      icon: Package,
      color: '#4F46E5',
      bgColor: '#EEF2FF'
    },
    {
      title: 'Featured Tiles',
      value: stats.tiles.featured,
      subtitle: 'Currently featured',
      icon: Star,
      color: '#F59E0B',
      bgColor: '#FFFBEB'
    },
    {
      title: 'Total Users',
      value: stats.users.total,
      subtitle: `${stats.users.verified} verified`,
      icon: Users,
      color: '#10B981',
      bgColor: '#ECFDF5'
    },
    {
      title: 'Active Carts',
      value: stats.carts.withItems,
      subtitle: `of ${stats.carts.total} total`,
      icon: TrendingUp,
      color: '#EF4444',
      bgColor: '#FEF2F2'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard Overview</h1>
        <p style={styles.subtitle}>SnapSpace AR Tile Management System</p>
      </div>

      <div style={styles.grid}>
        {statsCards.map((card, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{
                ...styles.iconContainer,
                backgroundColor: card.bgColor
              }}>
                <card.icon size={24} color={card.color} />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardValue}>{card.value}</h3>
                <p style={styles.cardTitle}>{card.title}</p>
                <p style={styles.cardSubtitle}>{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.activityGrid}>
          <div style={styles.activityCard}>
            <h3 style={styles.activityTitle}>Recent Tiles</h3>
            <p style={styles.activityValue}>{stats.tiles.recent}</p>
            <p style={styles.activitySubtext}>Added this week</p>
          </div>
          <div style={styles.activityCard}>
            <h3 style={styles.activityTitle}>New Users</h3>
            <p style={styles.activityValue}>{stats.users.recent}</p>
            <p style={styles.activitySubtext}>Registered this week</p>
          </div>
          <div style={styles.activityCard}>
            <h3 style={styles.activityTitle}>Admin Users</h3>
            <p style={styles.activityValue}>{stats.users.admins}</p>
            <p style={styles.activitySubtext}>Total administrators</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconContainer: {
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardContent: {
    flex: 1
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px'
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '2px'
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#6b7280'
  },
  recentSection: {
    marginTop: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px'
  },
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  activityCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    textAlign: 'center'
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  activityValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: '4px'
  },
  activitySubtext: {
    fontSize: '12px',
    color: '#6b7280'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#6b7280'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#dc2626',
    background: '#fef2f2',
    borderRadius: '8px'
  }
};

export default Dashboard;

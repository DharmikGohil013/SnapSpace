import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: location.pathname === '/dashboard' || location.pathname === '/'
    },
    {
      path: '/tiles',
      icon: Package,
      label: 'Tiles',
      active: location.pathname === '/tiles'
    },
    {
      path: '/users',
      icon: Users,
      label: 'Users',
      active: location.pathname === '/users'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>SnapSpace Admin</h2>
        <p style={styles.subtitle}>AR Tile Management</p>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.navItemActive : {})
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '280px',
    height: '100vh',
    backgroundColor: '#1f2937',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid #374151'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: 'white'
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0
  },
  nav: {
    flex: 1,
    padding: '24px 0'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  navItemActive: {
    backgroundColor: '#4F46E5',
    color: 'white',
    borderRight: '4px solid #6366f1'
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid #374151'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#d1d5db',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default Sidebar;

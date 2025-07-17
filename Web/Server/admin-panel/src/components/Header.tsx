import React from 'react';
import { useAuth } from './AuthContext';
import { User, Bell, Search } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <Search size={20} color="#6b7280" />
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.rightSection}>
        <button style={styles.notificationButton}>
          <Bell size={20} />
        </button>

        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            <User size={20} color="#6b7280" />
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name || 'Admin User'}</span>
            <span style={styles.userRole}>{user?.role || 'admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    height: '80px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    flexShrink: 0
  },
  searchContainer: {
    flex: 1,
    maxWidth: '500px'
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#f9fafb'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  notificationButton: {
    padding: '12px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #e5e7eb'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937'
  },
  userRole: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'capitalize'
  }
};

export default Header;

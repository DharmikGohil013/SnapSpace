import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { User } from '../types';
import { Users, Plus, Edit, Trash2, Shield, ShieldOff, Search, UserCheck, Crown } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        await loadUsers();
      } catch (err: any) {
        alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await adminService.updateUser(userId, { role: newRole });
        await loadUsers();
      } catch (err: any) {
        alert('Failed to update user role: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading users...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>Manage all users and their permissions</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={styles.addButton}
        >
          <Plus size={20} />
          Add New User
        </button>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <input
            type="text"
            placeholder="Search users..."
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

      <div style={styles.userGrid}>
        {filteredUsers.map((user) => (
          <div key={user._id} style={styles.userCard}>
            <div style={styles.userHeader}>
              <div style={styles.userAvatar}>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Users size={32} color="#6b7280" />
                )}
              </div>
              <div style={styles.roleIcon}>
                {user.role === 'admin' ? (
                  <Crown size={20} color="#F59E0B" />
                ) : (
                  <UserCheck size={20} color="#10B981" />
                )}
              </div>
            </div>

            <div style={styles.userContent}>
              <h3 style={styles.userName}>{user.name}</h3>
              <p style={styles.userEmail}>{user.email}</p>
              <div style={styles.userMeta}>
                <span style={{
                  ...styles.roleBadge,
                  backgroundColor: user.role === 'admin' ? '#FEF3C7' : '#D1FAE5',
                  color: user.role === 'admin' ? '#D97706' : '#059669'
                }}>
                  {user.role}
                </span>
                <span style={styles.joinDate}>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              {user.phone && (
                <p style={styles.userPhone}>📞 {user.phone}</p>
              )}

              {user.address && (
                <p style={styles.userAddress}>
                  📍 {user.address.street}, {user.address.city}
                </p>
              )}

              <div style={styles.userActions}>
                <button
                  onClick={() => handleToggleRole(user._id, user.role)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: user.role === 'admin' ? '#FEF2F2' : '#F0FDF4',
                    color: user.role === 'admin' ? '#DC2626' : '#059669'
                  }}
                  title={user.role === 'admin' ? 'Remove admin role' : 'Make admin'}
                >
                  {user.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                </button>
                <button
                  onClick={() => setEditingUser(user)}
                  style={styles.actionButton}
                  title="Edit user"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  style={{
                    ...styles.actionButton,
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626'
                  }}
                  title="Delete user"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && !isLoading && (
        <div style={styles.noResults}>
          <Users size={48} color="#6b7280" />
          <h3 style={styles.noResultsTitle}>No users found</h3>
          <p style={styles.noResultsText}>
            {searchTerm ? 'Try adjusting your search terms' : 'No users registered yet'}
          </p>
        </div>
      )}

      {showCreateForm && (
        <CreateUserModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            loadUsers();
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadUsers();
          }}
        />
      )}
    </div>
  );
};

// Create User Modal
const CreateUserModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role as 'user' | 'admin',
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      };

      await adminService.createUser(userData);
      onSuccess();
    } catch (err: any) {
      alert('Failed to create user: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>Create New User</h2>
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
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={styles.input}
                required
                minLength={6}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={styles.input}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              style={styles.input}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <h3 style={styles.sectionTitle}>Address Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Street</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              style={styles.input}
              placeholder="House No., Street Name"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Zip Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal
const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zipCode: user.address?.zipCode || '',
    country: user.address?.country || 'India'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as 'user' | 'admin',
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      };

      await adminService.updateUser(user._id, updateData);
      onSuccess();
    } catch (err: any) {
      alert('Failed to update user: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2>Edit User</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
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
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
                style={styles.input}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Address Information</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Street</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({...formData, street: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Zip Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
              {isSubmitting ? 'Updating...' : 'Update User'}
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
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  userCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  userHeader: {
    position: 'relative',
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textAlign: 'center'
  },
  userAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  roleIcon: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'white',
    borderRadius: '50%',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userContent: {
    padding: '24px'
  },
  userName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px',
    textAlign: 'center'
  },
  userEmail: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    textAlign: 'center'
  },
  userMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  joinDate: {
    fontSize: '12px',
    color: '#6b7280'
  },
  userPhone: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  userAddress: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
    lineHeight: '1.4'
  },
  userActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
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
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
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

export default UserManagement;

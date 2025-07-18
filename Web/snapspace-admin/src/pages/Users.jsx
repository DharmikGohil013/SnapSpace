import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/userApi';
import Toast from '../components/Toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data.users);
      } catch {
        setToast('Failed to load users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mt-8">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b">Role</th>
                <th className="p-2 border-b">Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="p-2 border-b">{user.name}</td>
                  <td className="p-2 border-b">{user.email}</td>
                  <td className="p-2 border-b">{user.role || 'user'}</td>
                  <td className="p-2 border-b">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
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

export default Users;

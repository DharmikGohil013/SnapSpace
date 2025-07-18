import React from 'react';
import { removeToken } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b shadow">
      <h1 className="text-xl font-bold text-gray-800">SnapSpace Admin</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;

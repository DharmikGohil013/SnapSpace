import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-100 border-r shadow-sm">
      <nav className="flex flex-col p-4 gap-2">
        <NavLink to="/dashboard" className={({ isActive }) =>
          isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Dashboard
        </NavLink>
        <NavLink to="/tiles" className={({ isActive }) =>
          isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Tiles
        </NavLink>
        <NavLink to="/tiles/new" className={({ isActive }) =>
          isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Add Tile
        </NavLink>
        <NavLink to="/users" className={({ isActive }) =>
          isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>
          Users
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

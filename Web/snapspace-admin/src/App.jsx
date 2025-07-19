import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tiles from './pages/Tiles';
import AddTile from './pages/AddTile';
import UserManagement from './pages/UserManagement';
import TileManagement from './pages/TileManagement';
import Settings from './pages/Settings';
import CorsTestComponent from './components/CorsTestComponent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test-cors" element={<CorsTestComponent />} />
      {/* Temporarily remove ProtectedRoute to test direct navigation */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/tiles" element={<TileManagement />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/tiles" element={<Tiles />} />
        <Route path="/tiles/new" element={<AddTile />} />
        <Route path="/users" element={<Users />} />
      </Route>
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;

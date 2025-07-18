import React, { useState } from 'react';
import { loginAdmin, checkServerHealth } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check server health first
      const isServerHealthy = await checkServerHealth();
      if (!isServerHealthy) {
        setToast('Server is currently unavailable. Please try again later.');
        setIsLoading(false);
        return;
      }

      const res = await loginAdmin(form);
      localStorage.setItem('snapspace_token', res.data.token);
      setToast('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed. ';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. Please check your connection and try again.';
      } else if (err.response) {
        errorMessage += err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage += 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage += err.message || 'Unknown error occurred.';
      }
      
      setToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
        <input 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handleChange} 
          placeholder="Admin Email" 
          className="p-2 border rounded" 
          required 
          disabled={isLoading}
        />
        <input 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={handleChange} 
          placeholder="Password" 
          className="p-2 border rounded" 
          required 
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;

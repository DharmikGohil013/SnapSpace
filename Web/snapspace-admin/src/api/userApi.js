import axios from './axios';

// Admin-only: Get all users
export const getAllUsers = () => axios.get('/admin/users');

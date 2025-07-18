import axios from './axios';

const TILE_BASE = '/admin/tiles';

// Admin-only tile actions
export const createTile = (data) => axios.post(TILE_BASE, data);
export const updateTile = (id, data) => axios.put(`${TILE_BASE}/${id}`, data);
export const deleteTile = (id) => axios.delete(`${TILE_BASE}/${id}`);

// Public or admin: list & view
export const getAllTiles = () => axios.get('/tiles');
export const getTileById = (id) => axios.get(`/tiles/${id}`);
export const searchTiles = (query) => axios.get(`/tiles/search/query?q=${query}`);

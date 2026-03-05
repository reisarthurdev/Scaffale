import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Coloca o token automaticamente em toda requisição se o usuário estiver logado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// Usuário
export const getMe = () => api.get('/users/me');
export const updateMe = (data) => api.patch('/users/me', data);
export const deleteMe = (password) => api.delete('/users/me', { data: { password } });

// Livros
export const searchBooks = (query) => api.get(`/search?q=${encodeURIComponent(query)}`);
export const getMyBooks = () => api.get('/books');
export const saveBook = (book) => api.post('/books', book);
export const updateBook = (id, data) => api.patch(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

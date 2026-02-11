// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Servicios para cada módulo
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

export const espacioService = {
  getAll: (params) => api.get('/espacios', { params }),
  getById: (id) => api.get(`/espacios/${id}`),
  checkAvailability: (id, fecha, hora_inicio, hora_fin) => 
    api.get(`/espacios/${id}/disponibilidad`, { params: { fecha, hora_inicio, hora_fin } })
};

export const reservaService = {
  getAll: () => api.get('/reservas'),
  create: (data) => api.post('/reservas', data),
  cancel: (id) => api.put(`/reservas/${id}/cancelar`),
  approve: (id) => api.put(`/reservas/${id}/aprobar`),
  reject: (id, motivo) => api.put(`/reservas/${id}/rechazar`, { motivo })
};

export const usuarioService = {
  getAll: () => api.get('/usuarios'),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`)
};

export default api;
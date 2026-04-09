import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mỗi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý response error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  verify: (token) => api.post('/auth/verify', { token }),
};

// Stories API
export const storiesAPI = {
  getAll: () => api.get('/stories'),
  getById: (id) => api.get(`/stories/${id}`),
  create: (data) => api.post('/stories', data),
  update: (id, data) => api.put(`/stories/${id}`, data),
  delete: (id) => api.delete(`/stories/${id}`),
  react: (id, type) => api.put(`/stories/${id}/react`, { type }),
  unreact: (id, type) => api.put(`/stories/${id}/unreact`, { type }),
};

// Comments API
export const commentsAPI = {
  getByStoryId: (storyId) => api.get(`/comments/${storyId}`),
  create: (data) => api.post('/comments', data),
  delete: (id) => api.delete(`/comments/${id}`),
};

import axios from 'axios';
import type { CreateUpdateData, CreateArticleData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API functions for updates
export const updatesApi = {
    getAll: () => api.get('/updates'),
    create: (data: CreateUpdateData) => api.post('/updates', data),
};

// API functions for articles
export const articlesApi = {
    getAll: (type?: 'article' | 'case-study') =>
        api.get('/articles', { params: type ? { type } : {} }),
    getById: (id: string) => api.get(`/articles/${id}`),
    create: (data: CreateArticleData) => api.post('/articles', data),
};

// API functions for file upload
export const uploadApi = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;
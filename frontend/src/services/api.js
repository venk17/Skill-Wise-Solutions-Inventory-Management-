import axios from 'axios';

const API_BASE_URL = 'https://skill-wise-solutions-inventory-management.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  getHistory: (id) => api.get(`/products/${id}/history`),
  import: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  export: () => api.get('/products/export', { responseType: 'blob' }),
  getCategories: () => api.get('/products/categories'),
};

export default api;
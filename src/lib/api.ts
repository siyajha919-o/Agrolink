// API configuration for AgroLink backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

// Helper to get auth token from localStorage
export const getToken = () => localStorage.getItem('agrolink_token');

// Helper to set auth headers
export const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role: 'farmer' | 'buyer' }) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) localStorage.setItem('agrolink_token', result.token);
    return result;
  },
  
  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) localStorage.setItem('agrolink_token', result.token);
    return result;
  },
  
  profile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: authHeaders()
    });
    return res.json();
  }
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    return res.json();
  },
  
  getOne: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return res.json();
  },
  
  create: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    });
    return res.json();
  },
  
  update: async (id: string, formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    });
    return res.json();
  },
  
  delete: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    return res.json();
  }
};

// Orders API
export const ordersAPI = {
  create: async (data: { productId: string; quantity: number }) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  getMyOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: authHeaders()
    });
    return res.json();
  },
  
  createPayment: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/create-payment`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ orderId })
    });
    return res.json();
  }
};

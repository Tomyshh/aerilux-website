import axios from 'axios';
import { Product, Order, User, InventoryItem, Plan } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product endpoints
export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },
  
  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
};

// Order endpoints
export const orderService = {
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  
  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
};

// Inventory endpoints
export const inventoryService = {
  checkAvailability: async (productId: string): Promise<boolean> => {
    const { data } = await api.get(`/inventory/${productId}/availability`);
    return data.available;
  },
  
  updateInventory: async (productId: string, quantity: number): Promise<InventoryItem> => {
    const { data } = await api.patch(`/inventory/${productId}`, { quantity });
    return data;
  },
  
  getInventory: async (): Promise<InventoryItem[]> => {
    const { data } = await api.get('/inventory');
    return data;
  },
};

// Payment endpoints
export const paymentService = {
  processPayment: async (paymentData: {
    amount: number;
    orderId: string;
    paymentMethod: string;
    token: string;
  }): Promise<{ success: boolean; transactionId: string }> => {
    const { data } = await api.post('/payments/process', paymentData);
    return data;
  },
  
  validatePayment: async (transactionId: string): Promise<boolean> => {
    const { data } = await api.get(`/payments/validate/${transactionId}`);
    return data.valid;
  },
};

// User endpoints
export const userService = {
  createUser: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.post('/users', userData);
    return data;
  },
  
  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const { data } = await api.get(`/users/${userId}/orders`);
    return data;
  },
};

// Plans endpoints
export const planService = {
  getPlans: async (): Promise<Plan[]> => {
    const { data } = await api.get('/plans');
    return data;
  },
  
  getPlan: async (id: string): Promise<Plan> => {
    const { data } = await api.get(`/plans/${id}`);
    return data;
  },
};

export default api; 
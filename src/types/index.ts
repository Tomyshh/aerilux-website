export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  specifications: {
    dimensions: string;
    weight: string;
    batteryLife: string;
    range: string;
  };
  features: string[];
  inStock: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number | 'custom';
  period: string;
  features: string[];
  featured?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface OrderItem {
  productId: string;
  planId: string;
  quantity: number;
  price: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  orders: Order[];
  createdAt: Date;
}

export interface InventoryItem {
  productId: string;
  quantity: number;
  lastUpdated: Date;
} 
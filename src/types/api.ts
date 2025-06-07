// src/types/api.ts

// Based on Mongoose ProductSchema
export interface ApiProduct {
  _id: string; // Typically provided by Mongoose
  id: string; // Virtual
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional as per schema
  stock: number;
  categoryId: string; // Assuming API returns populated category or just ID
  categoryName?: string; // From virtual, if populated
  sku?: string;
  lowStockThreshold?: number;
  availableSizes: string[];
  createdAt: string; // From timestamps
  updatedAt: string; // From timestamps
}

// Based on Mongoose CategorySchema
export interface ApiCategory {
  _id: string;
  id: string; // Virtual
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string; // This is in the schema
  createdAt: string;
  updatedAt: string;
}

// Based on Mongoose FaqItemSchema
export interface ApiFaqItem {
  _id: string;
  id: string; // Virtual
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Based on Mongoose OrderSchema
interface ApiCustomerInfo {
  name: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  billingAddress?: string;
}

export interface ApiOrderItem {
  productId: string; 
  productName: string;
  quantity: number;
  price: number;
  selectedSize?: string;
}

export interface ApiOrder {
  _id: string;
  id: string; // Virtual
  customerInfo: ApiCustomerInfo;
  items: ApiOrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  orderDate: string; 
  notes?: string;
  customerId?: string; 
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrderPayload {
  customerInfo: ApiCustomerInfo;
  items: ApiOrderItem[];
  totalAmount: number;
  notes?: string;
  customerId?: string;
}

// User and Auth Types
export const USER_ROLES = ["Admin", "Editor", "Viewer"] as const;
export type UserRole = typeof USER_ROLES[number];

export interface ApiUser {
  _id: string;
  id: string; // Virtual
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  lastLogin?: string; // Date as string
  createdAt: string;
  updatedAt: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole; 
  avatarUrl?: string | null; // Explicitly allow null
}

export interface SignInPayload {
  email: string;
  password: string;
}

// This is the actual flat response structure from /auth/signup and /auth/signin
export interface AuthApiResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  avatarUrl?: string;
  lastLogin?: string;
}

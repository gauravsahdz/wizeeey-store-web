import type { ApiProduct as BackendProduct, ApiCategory as BackendCategory, ApiFaqItem as BackendFaqItem, ApiOrder as BackendOrder, ApiUser as BackendUser, UserRole } from './api';

// Frontend Product type, adapted from API Product
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; 
  categoryName?: string; 
  categoryId: string; 
  availableSizes: string[];
  stock: number;
  sku?: string;
};

// Frontend Category type, adapted from API Category
export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string; 
  dataAiHint?: string; 
};

export type CartItem = {
  product: Product; 
  quantity: number;
  selectedSize: string;
};

export type StyleRecommendation = {
  itemId: string;
  itemName: string;
  itemDescription: string;
  itemPhotoDataUri: string; 
};

export type FaqItem = BackendFaqItem; 

export type Order = BackendOrder;

// Frontend User type, adapted from API User
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  lastLogin?: string; // Added lastLogin
};


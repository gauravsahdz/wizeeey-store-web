import type { Product, Category } from '@/types';
import { PLACEHOLDER_IMAGE_DATA_URI } from './constants';

// Mock categories can be kept for fallback or until API is fully integrated everywhere
export const mockCategories: Category[] = [
  { id: 'cat1', name: 'New Arrivals', slug: 'new-arrivals', imageUrl: 'https://placehold.co/800x400.png', dataAiHint: 'fashion runway' },
  { id: 'cat2', name: 'Tops', slug: 'tops', imageUrl: 'https://placehold.co/800x400.png', dataAiHint: 'shirts blouses' },
  { id: 'cat3', name: 'Bottoms', slug: 'bottoms', imageUrl: 'https://placehold.co/800x400.png', dataAiHint: 'pants jeans' },
  { id: 'cat4', name: 'Dresses', slug: 'dresses', imageUrl: 'https://placehold.co/800x400.png', dataAiHint: 'elegant dresses' },
  { id: 'cat5', name: 'Outerwear', slug: 'outerwear', imageUrl: 'https://placehold.co/800x400.png', dataAiHint: 'jackets coats' },
];

// Mock products can be kept for fallback or specific demos
export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Classic White Tee',
    description: 'A timeless classic, this white t-shirt is made from 100% premium cotton for ultimate comfort and style. Perfect for layering or wearing on its own.',
    price: 29.99,
    imageUrl: 'https://placehold.co/600x800.png', // Changed from images array
    categoryName: 'Tops',
    categoryId: 'cat2',
    availableSizes: ['S', 'M', 'L', 'XL'],
    stock: 100,
    // photoDataUri: PLACEHOLDER_IMAGE_DATA_URI, 
  },
  {
    id: 'prod2',
    name: 'Slim Fit Denim Jeans',
    description: 'Crafted for a modern silhouette, these slim fit jeans offer both comfort and style. Made with stretch denim for ease of movement.',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x800.png',
    categoryName: 'Bottoms',
    categoryId: 'cat3',
    availableSizes: ['28', '30', '32', '34', '36'],
    stock: 75,
    // photoDataUri: PLACEHOLDER_IMAGE_DATA_URI,
  },
  // Add more mock products if needed, ensure they conform to the new Product type
];

// These functions will be replaced by API calls.
// export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id);
// export const getProductsByCategory = (categoryId: string): Product[] => {
//   const category = mockCategories.find(c => c.id === categoryId);
//   if (!category) return [];
//   return mockProducts.filter(p => p.categoryName === category.name); 
// };

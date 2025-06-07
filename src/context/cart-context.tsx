
"use client";

import type { Product, CartItem } from '@/types'; // Product type is now updated
import type { ReactNode } from 'react';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number; selectedSize: string } // selectedColor removed
  | { type: 'REMOVE_ITEM'; productId: string; selectedSize: string } // selectedColor removed
  | { type: 'UPDATE_QUANTITY'; productId: string; selectedSize: string; quantity: number } // selectedColor removed
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

const initialState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        // Ensure key for finding item is unique enough without color
        item => item.product.id === action.product.id && item.selectedSize === action.selectedSize
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.quantity;
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity, selectedSize: action.selectedSize }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => !(item.product.id === action.productId && item.selectedSize === action.selectedSize)),
      };
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id === action.productId && item.selectedSize === action.selectedSize
          ? { ...item, quantity: Math.max(0, action.quantity) } 
          : item
      ).filter(item => item.quantity > 0); 
      return { ...state, items: updatedItems };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.items };
    default:
      return state;
  }
};

interface CartContextType extends CartState {
  addItem: (product: Product, quantity: number, selectedSize: string) => void; // selectedColor removed
  removeItem: (productId: string, selectedSize: string) => void; // selectedColor removed
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void; // selectedColor removed
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        dispatch({ type: 'LOAD_CART', items: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error("Could not access localStorage for cart:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    } catch (error) {
      console.error("Could not set localStorage for cart:", error);
    }
  }, [state.items]);

  const addItem = (product: Product, quantity: number, selectedSize: string) => {
    dispatch({ type: 'ADD_ITEM', product, quantity, selectedSize });
  };

  const removeItem = (productId: string, selectedSize: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId, selectedSize });
  };

  const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, selectedSize, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

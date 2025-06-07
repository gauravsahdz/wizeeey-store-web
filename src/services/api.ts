
// src/services/api.ts
import { API_BASE_URL } from '@/lib/config';
import type { 
  ApiProduct, 
  ApiCategory, 
  ApiFaqItem, 
  ApiOrder, 
  ApiOrderPayload,
  ApiUser, 
  SignUpPayload,
  SignInPayload,
  AuthApiResponse
} from '@/types/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    const effectiveApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
    if (!effectiveApiBaseUrl) {
      console.error("API_BASE_URL is not configured. Please check your .env file and ensure NEXT_PUBLIC_API_BASE_URL is set.");
      throw new Error("API_BASE_URL is not configured.");
    }
  }
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add Authorization header if token is available
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorBodyText = ''; 
      let parsedErrorBody: any = null; 
      try {
        errorBodyText = await response.text();
        parsedErrorBody = JSON.parse(errorBodyText);
      } catch (e) {
        // If JSON.parse fails, errorBodyText already contains the raw non-JSON response
      }
      
      console.error(`API Error ${response.status} for ${url}:`, errorBodyText); 
      
      let message = parsedErrorBody?.message || 
                    (typeof parsedErrorBody === 'string' ? parsedErrorBody : null) ||
                    (errorBodyText && !parsedErrorBody?.message ? errorBodyText : response.statusText); // Prefer errorBodyText if it's not HTML
      
      // Avoid using full HTML page as error message if it's a generic gateway error
      if (typeof message === 'string' && message.toLowerCase().includes('<!doctype html>')) {
          message = response.statusText;
      }

      let errorMessage = `API request failed with status ${response.status}: ${message}`;
      
      if (response.status === 400 && parsedErrorBody?.message) {
        throw new Error(parsedErrorBody.message); // Use direct message from API for 400 errors
      } else if (response.status === 401) {
        errorMessage = `API request failed with status 401 (Unauthorized) for ${url}. This may be due to an invalid or expired token, or the endpoint requires authentication. The error body was: ${message}`;
      } else if (response.status === 502) {
         errorMessage = `A "502 Bad Gateway" error occurred while trying to fetch from the backend API (${url}). This means the API server on Render.com (or your host) is not responding correctly. Site Owners: Please check your API application logs for details.`;
      }

      throw new Error(errorMessage);
    }
    if (response.status === 204) { // No Content
      return null as T;
    }
    
    const responseText = await response.text();
    if (!responseText) {
      console.warn(`API Warning: Successful response for ${url} but body was empty.`);
      throw new Error("API returned a successful status but with an empty response body.");
    }
    return JSON.parse(responseText);

  } catch (error: any) {
    console.error(`Error fetching from ${url}:`, error.message);
    throw error; 
  }
}

// Product Endpoints
export const getProducts = (): Promise<ApiProduct[]> => fetchApi<ApiProduct[]>('/api/products');
export const getProductById = (id: string): Promise<ApiProduct | null> => fetchApi<ApiProduct | null>(`/products/${id}`);

// Category Endpoints
export const getCategories = (): Promise<ApiCategory[]> => fetchApi<ApiCategory[]>('/api/categories');
export const getCategoryById = (id: string): Promise<ApiCategory | null> => fetchApi<ApiCategory | null>(`/categories/${id}`);

// FAQ Endpoints
export const getFaqs = (): Promise<ApiFaqItem[]> => fetchApi<ApiFaqItem[]>('/api/faqs');

// Order Endpoints
export const createOrder = (orderData: ApiOrderPayload): Promise<ApiOrder> => 
  fetchApi<ApiOrder>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const getOrders = (): Promise<ApiOrder[]> => fetchApi<ApiOrder[]>('/api/orders');

// Auth Endpoints
export const signupUser = (payload: SignUpPayload): Promise<AuthApiResponse> =>
  fetchApi<AuthApiResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const signinUser = (payload: SignInPayload): Promise<AuthApiResponse> =>
  fetchApi<AuthApiResponse>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// User Endpoint (whoami)
export const getMe = (): Promise<ApiUser> => fetchApi<ApiUser>('/api/auth/me');

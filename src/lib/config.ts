// src/lib/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    'Warning: NEXT_PUBLIC_API_BASE_URL is not defined. API calls may fail.'
  );
}

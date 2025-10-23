import axios from 'axios';

// ✅ Simple and correct base URL
const BASE_URL = 'https://code-a2z-server.vercel.app/api';

export const makeRequest = async (url: string, options: any = {}) => {
  // ✅ Ensure URL doesn't have duplicate /api
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullUrl = `${BASE_URL}/${cleanUrl}`;
  
  console.log('🌐 API Request:', fullUrl);
  
  const config = {
    url: fullUrl,
    ...options,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Convenience methods
export const post = (url: string, data: any, options?: any) => 
  makeRequest(url, { method: 'POST', data, ...options });

export const get = (url: string, options?: any) => 
  makeRequest(url, { method: 'GET', ...options });

export const put = (url: string, data: any, options?: any) => 
  makeRequest(url, { method: 'PUT', data, ...options });

export const del = (url: string, options?: any) => 
  makeRequest(url, { method: 'DELETE', ...options });
import axios from 'axios';
import { VITE_SERVER_DOMAIN } from '../../config/env';

enum Methods {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// ✅ NEW IMPLEMENTATION (internal)
const BASE_URL = 'https://code-a2z-server.vercel.app/api';

const makeNewRequest = async (url: string, options: any = {}) => {
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullUrl = `${BASE_URL}/${cleanUrl}`;

  console.log('🌐 API Request:', fullUrl);

  const token = localStorage.getItem('token');

  const config = {
    url: fullUrl,
    ...options,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    withCredentials: true,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('❌ API Error:', {
      url: fullUrl,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// ✅ OLD API - MAINTAINED FOR COMPATIBILITY
export async function makeRequest<T, D = undefined>(
  url: string,
  method: Methods,
  _isAuthRequired: boolean,
  data?: D,
  hasFullURL?: boolean,
  headers?: Record<string, string>
): Promise<T> {
  // Convert old parameters to new format
  const requestOptions: any = {
    method,
    data,
    headers: {
      ...headers,
    },
  };

  // Handle URL construction
  let finalUrl = url;
  if (!hasFullURL) {
    finalUrl = VITE_SERVER_DOMAIN + url;
  }

  return makeNewRequest(finalUrl, requestOptions);
}

// ✅ OLD FUNCTIONS - MAINTAINED
export async function get<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.GET,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function post<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.POST,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function put<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.PUT,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function patch<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.PATCH,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function del<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.DELETE,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

// ✅ NEW FUNCTIONS - ADDED FOR NEW CODE
export const newGet = (url: string, options?: any) =>
  makeNewRequest(url, { method: 'GET', ...options });

export const newPost = (url: string, data: any, options?: any) =>
  makeNewRequest(url, { method: 'POST', data, ...options });

export const newPut = (url: string, data: any, options?: any) =>
  makeNewRequest(url, { method: 'PUT', data, ...options });

export const newPatch = (url: string, data: any, options?: any) =>
  makeNewRequest(url, { method: 'PATCH', data, ...options });

export const newDel = (url: string, options?: any) =>
  makeNewRequest(url, { method: 'DELETE', ...options });

// ✅ DEFAULT EXPORT FOR NEW CODE
export default makeNewRequest;

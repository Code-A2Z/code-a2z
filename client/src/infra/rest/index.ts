import axios from "axios";

enum Methods {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export async function makeRequest<T, D = undefined>(
  url: string,
  method: Methods,
  isAuthRequired: boolean,
  data?: D,
  hasFullURL?: boolean,
  headers?: Record<string, string>,
): Promise<T> {
  let token: string | null = null;

  if (isAuthRequired) {
    token = localStorage.getItem("token");
  }
  if (!hasFullURL) {
    url = import.meta.env.VITE_SERVER_DOMAIN + url;
  }

  const response = await axios({
    url,
    method,
    data,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...headers,
    },
  });
  return response.data;
}

export async function get<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>,
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.GET,
    isAuthRequired,
    body,
    hasFullURL,
    headers,
  );
}

export async function post<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>,
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.POST,
    isAuthRequired,
    body,
    hasFullURL,
    headers,
  );
}

export async function put<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>,
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.PUT,
    isAuthRequired,
    body,
    hasFullURL,
    headers,
  );
}

export async function patch<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>,
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.PATCH,
    isAuthRequired,
    body,
    hasFullURL,
    headers,
  );
}

export async function del<T, D = undefined>(
  url: string,
  isAuthRequired: boolean,
  body?: D,
  hasFullURL: boolean = false,
  headers?: Record<string, string>,
): Promise<T> {
  return makeRequest<T, D>(
    url,
    Methods.DELETE,
    isAuthRequired,
    body,
    hasFullURL,
    headers,
  );
}
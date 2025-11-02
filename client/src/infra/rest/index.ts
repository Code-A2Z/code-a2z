import axios from 'axios';
import { VITE_SERVER_DOMAIN } from '../../config/env';
import { getAccessToken } from '../../shared/utils/local';

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export async function makeRequest<Payload, Response>(
  url: string,
  method: Methods,
  isAuthRequired?: boolean,
  data?: Payload | undefined,
  hasFullURL?: boolean,
  headers?: Record<string, string>
): Promise<Response> {
  const token = getAccessToken();
  if (!hasFullURL) {
    url = VITE_SERVER_DOMAIN + url;
  }

  const response = await axios({
    url,
    method,
    data,
    withCredentials: isAuthRequired,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...headers,
    },
  });
  return response.data;
}

export async function get<Payload, Response>(
  url: string,
  isAuthRequired: boolean = false,
  body: Payload | undefined = undefined,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<Response> {
  return makeRequest<Payload, Response>(
    url,
    Methods.GET,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function post<Payload, Response>(
  url: string,
  isAuthRequired: boolean = false,
  body: Payload | undefined = undefined,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<Response> {
  return makeRequest<Payload, Response>(
    url,
    Methods.POST,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function put<Payload, Response>(
  url: string,
  isAuthRequired: boolean = false,
  body: Payload | undefined = undefined,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<Response> {
  return makeRequest<Payload, Response>(
    url,
    Methods.PUT,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function patch<Payload, Response>(
  url: string,
  isAuthRequired: boolean = false,
  body: Payload | undefined = undefined,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<Response> {
  return makeRequest<Payload, Response>(
    url,
    Methods.PATCH,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

export async function del<Payload, Response>(
  url: string,
  isAuthRequired: boolean = false,
  body: Payload | undefined = undefined,
  hasFullURL: boolean = false,
  headers?: Record<string, string>
): Promise<Response> {
  return makeRequest<Payload, Response>(
    url,
    Methods.DELETE,
    isAuthRequired,
    body,
    hasFullURL,
    headers
  );
}

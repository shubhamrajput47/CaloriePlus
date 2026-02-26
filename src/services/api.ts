/**
 * Axios API client - base URL, auth header, interceptors
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '@config/env';

const createApi = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.api.baseUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': env.api.apiKey,
    },
  });

  client.interceptors.request.use((config) => {
    // Token can be injected by auth service
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Trigger logout or refresh
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const api = createApi();

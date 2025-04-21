import axios, { InternalAxiosRequestConfig } from 'axios';

// Cliente Axios centralizado con validación de URL
const client = axios.create();

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url && config.url.startsWith('//')) {
    // Rechazar URLs protocol-relative
    return Promise.reject(new Error('URLs sin protocolo no permitidas'));
  }
  return config;
});

export default client;

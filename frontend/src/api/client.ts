import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // set to true if your backend uses httpOnly cookies for auth
});

client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore for SSR
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const response = error?.response;

    if (response && response.status === 401) {
      // simple default behaviour: clear tokens and surface the error.
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } catch (e) {
        // ignore in SSR
      }

      // Optional: redirect to login if running in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default client;

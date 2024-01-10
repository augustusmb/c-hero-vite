import axios from 'axios';

const environment = import.meta.env.VITE_NODE_ENV

const apiClient = axios.create({
  baseURL: environment === 'local' ? 'http://localhost:5173/' : 'https://c-herotraining.com/',
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (apiClient.defaults.headers.common['Authorization']) {
        config.headers.Authorization = apiClient.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Error getting access token: ', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export default apiClient;
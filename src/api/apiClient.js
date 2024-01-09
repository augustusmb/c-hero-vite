import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://c-herotraining.com/', // replace with your API base URL
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
  console.log('hi3')
  console.log('token ', token)
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export default apiClient;
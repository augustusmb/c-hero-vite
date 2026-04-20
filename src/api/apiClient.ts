import axios from "axios";

const environment = import.meta.env.VITE_NODE_ENV;

const apiClient = axios.create({
  baseURL:
    environment === "local"
      ? "http://localhost:5173/"
      : "https://c-herotraining.com/",
});

let getAccessToken: (() => Promise<string>) | null = null;

export const registerAuthTokenGetter = (
  fn: (() => Promise<string>) | null,
) => {
  getAccessToken = fn;
};

apiClient.interceptors.request.use(async (config) => {
  const isPublic = typeof config.url === "string" && config.url.includes("/api/public/");
  if (!isPublic && getAccessToken) {
    try {
      const token = await getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Not authenticated yet — let the request through so the server returns 401
    }
  }
  return config;
});

export default apiClient;

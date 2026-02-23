import axios from "axios";

const ACCESS_TOKEN_KEY = "emrs_access_token";
const REFRESH_TOKEN_KEY = "emrs_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshSession() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");
    refreshPromise = axios
      .post("http://localhost:4000/api/auth/refresh", { refreshToken })
      .then((response) => {
        setAuthTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error?.response?.status;
    const requestUrl = String(original.url || "");
    const isAuthCall = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/refresh");

    if (status !== 401 || original._retry || isAuthCall) {
      return Promise.reject(error);
    }

    try {
      original._retry = true;
      const data = await refreshSession();
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      clearAuthTokens();
      window.dispatchEvent(new Event("emrs:auth-logout"));
      return Promise.reject(refreshError);
    }
  }
);

export default api;

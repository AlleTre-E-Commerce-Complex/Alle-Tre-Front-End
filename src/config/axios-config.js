import Axios from "axios";
import auth from "../utils/auth";
import { store } from "redux-store/store";
import { setBlockedUser } from "redux-store/blocked-user-slice";

Axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
const AuthAxios = Axios.create();

// Request interceptor
AuthAxios.interceptors.request.use(async (config) => {
  try {
    const accessToken = await auth.getToken();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Response interceptor
AuthAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite refresh loops
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Handle blocked user
    if (error?.response?.data?.message === 'Token error: User is blocked') {
      await auth.logout();
      store.dispatch(setBlockedUser(true));
      return Promise.reject(error);
    }

    // Handle token expiration
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await auth.refreshToken();
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return AuthAxios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout and reject
        await auth.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const axios = Axios;
export const authAxios = AuthAxios;

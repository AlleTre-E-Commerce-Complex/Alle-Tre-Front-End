import Axios from "axios";
import auth from "../utils/auth";
import { createBrowserHistory } from "history"; 
import routes from "routes";
import { store } from "redux-store/store";
import { setBlockedUser } from "redux-store/blocked-user-slice";

// Axios.defaults.baseURL =
//   process.env.NODE_ENV !== "production"
//     ? process.env.REACT_APP_DEV_URL
//     : process.env.REACT_APP_SERVER_URL;
Axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
const AuthAxios = Axios.create();

AuthAxios.interceptors.request.use(async (config) => {
  let accessToken = await auth.getToken();
  config.headers = {
    Authorization: `Bearer ${accessToken}`,
    // "Accept-Language": window.localStorage.getItem("language"),
  };
  return config;
});

// Response interceptor for handling errors globally
AuthAxios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    console.log('****>',error)
    // Check if the error is a 401 unauthorized
    if (error?.response?.data?.message === 'Token error: User is blocked') {
       auth.logout()
       // Dispatch the action to show the modal
        store.dispatch(setBlockedUser(true));
    }

    return Promise.reject(error); // Reject the promise to propagate the error
  }
);
export const axios = Axios;
export const authAxios = AuthAxios;

import jwt_decode from "jwt-decode";
import Axios from "axios";
import api from "../api";
import routes from "routes";
import { getDefaultPerPage } from "constants/pagination";

class Auth {
  constructor() {
    this.refreshPromise = null;
    this.REFRESH_BUFFER = 60; // Change buffer to 60 seconds
  }

  async getDecodedToken() {
    const token = await this.getToken();
    return this._decodeToken(token);
  }

  async getUser() {
    try {
      const token = await this.getToken();
      if (!token) return null;
      return this._decodeToken(token);
    } catch (e) {
      return null;
    }
  }

  setToken({ newAccessToken, /*newRefreshToken*/ }) {
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }
    // if (newRefreshToken) {
    //   localStorage.setItem("refreshToken", newRefreshToken);
    // }
  }

  async logout() {
    try {
      // const refreshToken = localStorage.getItem("refreshToken");
      // if (refreshToken) {
      //   await Axios.post(api.auth.logout, { refreshToken }).catch(console.error);
      // }
        await Axios.post(api.auth.logout)
    } catch (e){
      console.error("log out api failed :",e)
    } finally {
      this.refreshPromise = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("hasCompletedProfile");
      if (window.location.pathname !== routes.app.home) {
        const perPage = getDefaultPerPage()
        window.location = `${routes.app.home}?page=1&perPage=${perPage}`
      }
    }
  }

  async getToken() {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return await this.refreshToken();
      }

      if (this.hasExpired(accessToken)) {
        return await this.refreshToken();
      }

      return accessToken;
    } catch (e) {
      console.error("Error getting token:", e);
      return null;
    }
  }

  // async refreshToken() {
  //   // If there's already a refresh in progress, return that promise
  //   if (this.refreshPromise) {
  //     return this.refreshPromise;
  //   }
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   if (!refreshToken) {
  //     // alert('window.location.pathname'+window.location.pathname)
  //     if(window.location.pathname.includes("/alletre/profile/my-bids/pending")){
  //       return null
  //     }
  //    if(
  //       !window.location.pathname.includes("details") &&
  //       !window.location.pathname.includes("/alletre/categories/") &&
  //       !window.location.pathname.includes("/privacy-policy")){
  //       await this.logout();
  //     }
  //     return null;
  //   }

  //   // Create new refresh promise
  //   this.refreshPromise = (async () => {
  //     try {
  //       const res = await Axios.post(api.auth.RefrshToken, {
  //         refreshToken,
  //       });
        
  //       const data = res.data;
  //       if (!data?.data?.accessToken) {
  //         throw new Error('Invalid token response');
  //       }

  //       this.setToken({
  //         newAccessToken: data.data.accessToken,
  //         newRefreshToken: data.data.refreshToken || refreshToken,
  //       });
        
  //       return data.data.accessToken;
  //     } catch (error) {
  //       console.error("Token refresh failed:", error);
  //       await this.logout();
  //       return null;
  //     } finally {
  //       // Clear the refresh promise
  //       this.refreshPromise = null;
  //     }
  //   })();

  //   return this.refreshPromise;
  // }

  async refreshToken() {
  // If there's already a refresh in progress, return that promise
  if (this.refreshPromise) {
    return this.refreshPromise;
  }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      // alert('window.location.pathname'+window.location.pathname)
      if(window.location.pathname.includes("/alletre/profile/my-bids/pending")){
        return null
      }
     if(
        !window.location.pathname.includes("details") &&
        !window.location.pathname.includes("/alletre/categories/") &&
        !window.location.pathname.includes("/privacy-policy")){
        await this.logout();
      }
      return null;
    }

  // Create new refresh promise
  this.refreshPromise = (async () => {
    try {
      // Call refresh endpoint — cookie (HttpOnly refreshToken) is sent automatically
      const res = await Axios.post(api.auth.RefrshToken);
      const data = res.data;
      if (!data?.data?.accessToken) {
        throw new Error("Invalid token response");
      }

      // Update only access token; backend should rotate refresh cookie
      this.setToken({
        newAccessToken: data.data.accessToken,
      });

      return data.data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await this.logout();
      return null;
    } finally {
      this.refreshPromise = null;
    }
  })();

  return this.refreshPromise;
}


  hasExpired(token) {
    if (!token) return true;

    try {
      const decodeToken = jwt_decode(token);
      const now = new Date().getTime() / 1000;
      // Use 60 second buffer instead of 30
      return !decodeToken || (decodeToken.exp - this.REFRESH_BUFFER) < now;
    } catch (e) {
      return true;
    }
  }

  _decodeToken(token) {
    try {
      return jwt_decode(token);
    } catch (e) {
      return null;
    }
  }
}

export default new Auth();

import jwt_decode from "jwt-decode";
import Axios from "axios";
import api from "../api";
import routes from "routes";

class Auth {
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

  setToken({ newAccessToken, newRefreshToken }) {
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Even if the server call fails, we'll still clear local storage
        await Axios.post(api.auth.logout, { refreshToken }).catch(console.error);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Ensure we redirect to home page after logout
      if (window.location.pathname !== routes.app.home) {
        window.location = routes.app.home;
      }
    }
  }

  async getToken() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        const newToken = await this.refreshToken();
        return newToken;
      }
      
      if (this.hasExpired(accessToken)) {
        const newToken = await this.refreshToken();
        return newToken;
      }
      
      return accessToken;
    } catch (e) {
      console.error("Error getting token:", e);
      return null;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      await this.logout();
      return null;
    }

    try {
      const res = await Axios.post(api.auth.RefrshToken, {
        refreshToken,
      });
      
      const data = res.data;
      if (!data?.data?.accessToken) {
        throw new Error('Invalid token response');
      }

      this.setToken({
        newAccessToken: data.data.accessToken,
        newRefreshToken: data.data.refreshToken || refreshToken,
      });
      
      return data.data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      return null;
    }
  }

  hasExpired(token) {
    if (!token) return true;
    
    try {
      const decodeToken = jwt_decode(token);
      const now = new Date().getTime() / 1000;
      // Add 30 second buffer to prevent edge cases
      return !decodeToken || (decodeToken.exp - 30) < now;
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

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
    }
  }

  async getToken() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      // If no access token, try to refresh
      if (!accessToken) {
        const newToken = await this.refreshToken();
        return newToken;
      }
      
      // Check if token is expired or will expire soon
      if (this.hasExpired(accessToken)) {
        console.log('Token expired or expiring soon, refreshing...');
        const newToken = await this.refreshToken();
        return newToken;
      }
      
      return accessToken;
    } catch (e) {
      console.error("Error getting token:", e);
      // If there's an error, attempt to refresh the token
      try {
        const newToken = await this.refreshToken();
        return newToken;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        await this.logout();
        return null;
      }
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
      
      const { data } = res;
      if (!data?.accessToken) {
        throw new Error('Invalid token response');
      }

      this.setToken({
        newAccessToken: data.accessToken,
        newRefreshToken: data.refreshToken,
      });
      
      return data.accessToken;
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
      return !decodeToken || !decodeToken.exp || (decodeToken.exp - 30) < now;
    } catch (e) {
      console.error('Error checking token expiration:', e);
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

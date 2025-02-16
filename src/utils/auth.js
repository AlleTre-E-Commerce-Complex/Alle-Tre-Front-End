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
      sessionStorage.setItem("accessToken", newAccessToken);
    }
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await Axios.post(api.auth.logout, { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  async getToken() {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) return null;
      
      if (this.hasExpired(accessToken)) {
        const newToken = await this.refreshToken();
        return newToken || null;
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
      window.location = routes.app.home;
      return false;
    }

    try {
      const res = await Axios.post(api.auth.RefrshToken, {
        refreshToken,
      });
      const data = res.data;
      this.setToken({
        newAccessToken: data?.data.accessToken,
        newRefreshToken: data?.data?.refreshToken,
      });
      return data?.data?.accessToken;
    } catch (e) {
      this.logout();
      return false;
    }
  }

  hasExpired(token) {
    try {
      const decodeToken = jwt_decode(token);
      const now = new Date().getTime() / 1000;
      return decodeToken.exp < now;
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

import jwt_decode from "jwt-decode";
import Axios from "axios";
import api from "../api";
import routes from "routes";

let accessToken = "";
//

class Auth {
  async getDecodedToken() {
    const token = await this.getToken();
    return this._decodeToken(token);
  }

  async getUser() {
    const token = await this.getToken();
    return this._decodeToken(token);
  }

  setToken({ newAccessToken, newRefreshToken }) {
    accessToken = newAccessToken;
    localStorage.setItem("token", newRefreshToken || "");
  }

  logout() {
    this.setToken({ newAccessToken: "", newRefreshToken: "" });
  }

  async getToken() {
    const localStorageToken = localStorage.getItem("token");
    if (!localStorageToken || this.hasExpired()) return this.refreshToken();
    else return accessToken;
  }

  async refreshToken() {
    const localStorageToken = localStorage.getItem("token");
    console.log('localStorageToken :', localStorageToken) 
    console.log('accessToken :', accessToken)
    if (!localStorageToken && accessToken) {
      window.location = routes.app.home;
      return false;
    }
    if (!this.hasExpired()) return accessToken;

    try {
      if(localStorageToken === ''){
        console.log('localStorageToken is empty')
        return false;
      }
      const res = await Axios.post(api.auth.RefrshToken, {
        refreshToken: localStorageToken,
      });
      const data = res.data;
      this.setToken({
        newAccessToken: data?.data.accessToken,
        newRefreshToken: data?.data?.refreshToken,
      });
      return data?.data?.accessToken;
    } catch (e) {
      return false;
    }
  }

  hasExpired() {
    if (!accessToken) return true;
    const decodeToken = jwt_decode(accessToken);
    const now = new Date().getTime() / 1000;

    if (!decodeToken || now > decodeToken.exp) {
      return true;
    } else {
      return false;
    }
  }

  _decodeToken(token) {
    try {
      const decoded = jwt_decode(token);
      return decoded;
    } catch (e) {
      return false;
    }
  }
}

export default new Auth();

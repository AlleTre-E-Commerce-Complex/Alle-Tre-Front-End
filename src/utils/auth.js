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


// import jwt_decode from "jwt-decode";
// import Axios from "axios";
// import api from "../api";
// import routes from "routes";

// class Auth {
//   async getDecodedToken() {
//     const token = await this.getToken();
//     return this._decodeToken(token);
//   }

//   async getUser() {
//     const token = await this.getToken();
//     return this._decodeToken(token);
//   }

//   setToken({ newAccessToken, newRefreshToken }) {
//     if (newAccessToken) {
//       localStorage.setItem("accessToken", newAccessToken);
//     }
//     if (newRefreshToken) {
//       localStorage.setItem("refreshToken", newRefreshToken);
//     }
//   }

//   logout() {
//     console.log("logout");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//   }

//   async getToken() {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken || this.hasExpired(accessToken)) {
//       return this.refreshToken();
//     }
//     return accessToken;
//   }

//   async refreshToken() {
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (!refreshToken) {
//       // window.location = routes.app.home;
//       return false;
//     }

//     try {
//       const res = await Axios.post(api.auth.RefrshToken, {
//         refreshToken,
//       });
//       const data = res.data;
//       this.setToken({
//         newAccessToken: data?.data.accessToken,
//         newRefreshToken: data?.data?.refreshToken,
//       });
//       return data?.data?.accessToken;
//     } catch (e) {
//       this.logout();
//       return false;
//     }
//   }

//   hasExpired(token) {
//     try {
//       const decodeToken = jwt_decode(token);
//       const now = new Date().getTime() / 1000;
//       return decodeToken.exp < now;
//     } catch (e) {
//       return true;
//     }
//   }

//   _decodeToken(token) {
//     try {
//       return jwt_decode(token);
//     } catch (e) {
//       return null;
//     }
//   }
// }

// export default new Auth();

import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import LodingTestAllatre from "../component/shared/lotties-file/loding-test-allatre";
import useAxios from "../hooks/use-axios";
import routes from "../routes";
import Auth from "../utils/auth";
import { useDispatch } from "react-redux";
import { Open } from "redux-store/auth-model-slice";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const history = useHistory();
  const { pathname, search } = useLocation();

  const { isError } = useAxios();

  const login = ({ accessToken,/* refreshToken*/ }) => {
    setUser(Auth._decodeToken(accessToken));

    Auth.setToken({
      newAccessToken: accessToken,
      // newRefreshToken: refreshToken,
    });
  };

  const logout = () => {
    // Auth.setToken({ newAccessToken: "", newRefreshToken: "" });
    Auth.logout();
    setUser(null);
    // history.push(routes.app.home);
  };

  const searchParams = new URLSearchParams(search).toString();

  React.useEffect(() => {
    if (pathname.startsWith(routes.auth.forgetpass.restpass)) {
      setIsLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        const user = await Auth.getUser();
        if (!user) {
          if(window.location.pathname.includes("/alletre/profile/my-bids/pending")){
            dispatch(Open());
            setIsLoading(false); // ensure the app renders children instead of loading screen
            // return;
        }else{
          // Removing the aggressive history.push intercept here
          // as it conflicts with back navigation and page loading.
          // Unauthenticated users will still be blocked from protected routes
          // via other mechanisms (like PrivateRoutes or specific component checks).
          }
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        setUser(null);
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [pathname, searchParams, history, dispatch]); 

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isLoading,
        isError,
      }}
    >
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LodingTestAllatre />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

function useAuthState() {
  const { user, isLoading, isError, login, logout } =
    React.useContext(AuthContext);

  return {
    user,
    isLoading,
    isError,
    logout,
    login,
  };
}

export { AuthProvider, useAuthState };

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser, logout } from "../services/authService";

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    user: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        setAuth({
          loading: false,
          authenticated: res.authenticated ?? !!res.user,
          user: res.user,
        });
        console.log("AuthProvider loaded user:", res);
      } catch {
        setAuth({
          loading: false,
          authenticated: false,
          user: null,
        });
      }
    };

    loadUser();
  }, []);

  const signOut = async () => {
    await logout();
    setAuth({
      loading: false,
      authenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

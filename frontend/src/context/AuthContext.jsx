import { createContext, useState } from "react";

const authContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(false);
  const login = ({ token, isAdmin }) => {
    setToken(token);
    setAdmin(isAdmin);
  };
  const logout = () => {
    setToken(null);
    setAdmin(false);
  };

  return (
    <authContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthContextProvider };

import { createContext, useState } from "react";

const authContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [details,setDetails]=useState({})
  const login = ({ token, isAdmin, details }) => {
    setToken(token);
    setAdmin(isAdmin);
    setDetails(details);
  };
  const updateDetails=(data)=>{
    setDetails(data)
  }
  const logout = () => {
    setToken(null);
    setAdmin(false);
  };

  return (
    <authContext.Provider value={{ token, admin, details, login, logout, updateDetails }}>
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthContextProvider };

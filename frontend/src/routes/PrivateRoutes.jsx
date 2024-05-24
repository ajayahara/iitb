import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
  const { token, admin } = useContext(authContext);
  const { pathname } = useLocation();
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (!admin && (pathname == "/verify" || pathname.includes("/user/details"))) {
    return <Navigate to="/" />;
  }
  return children;
};

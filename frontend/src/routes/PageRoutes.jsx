import { Route, Routes } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { VerifyUsers } from "../pages/VerifyUsers";
import { UserDetails } from "../pages/UserDetails";
import { PrivateRoutes } from "./PrivateRoutes";

export const PageRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      ></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route
        path="/verify"
        element={
          <PrivateRoutes>
            <VerifyUsers />
          </PrivateRoutes>
        }
      ></Route>
      <Route
        path="/user/details/:id"
        element={
          <PrivateRoutes>
            <UserDetails />
          </PrivateRoutes>
        }
      ></Route>
    </Routes>
  );
};

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ children, isAuthenticated }) => {
  const location = useLocation();
  if (!isAuthenticated && location.pathname === "/")
    return <Navigate to={"/auth/signin"} replace />;

  if (isAuthenticated && location.pathname.includes("auth"))
    return <Navigate to={"/"} replace />;

  return children;
};

export default CheckAuth;

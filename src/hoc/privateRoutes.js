import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PrivateRoutes = () => {
  const auth = localStorage.getItem("token");

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

import { Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../components/Homepage/HomePage";
import Login from "../components/Auth/Login";
import SignUp from "./../components/Auth/Signup";
import PrivateRoutes from "../hoc/privateRoutes";

const Router = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<HomePage />} path="/home" exact />
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </>
  );
};

export default Router;

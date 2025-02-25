import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import QueryPage from "../pages/QueryPage";
import AboutPage from "../pages/AboutPage";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";
import { Loader } from 'rsuite';
import RequireAuth from "./RequireAuth";

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader className="flex-grow p-4" speed="normal" content="Normal" />}>
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/queryboard" element={<QueryPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} /> */}

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Suspense>
  );
};

export default AppRouter;

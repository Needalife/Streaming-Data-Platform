import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SettingsPage from "../pages/SettingsPage";
import QueryPage from "../pages/QueryPage";
import HomePage from "../pages/HomePage";
import MetricsPage from "../pages/MetricsPage";
import SignIn from "../components/settings/authentication/SignIn";
import SignUp from "../components/settings/authentication/SignUp";
import { Loader } from 'rsuite';

const AppRouter = () => {

  return (
    <Suspense fallback={<Loader className="flex-grow p-4" speed="normal" content="Normal" />}>
      {(
            <div className="flex-grow p-4">
              <Routes>
              <Route
                  path="/"
                  element={<HomePage />}
                />
                <Route
                  path="/queryboard"
                  element={<QueryPage />}
                />
                <Route
                  path="/metrics"
                  element={<MetricsPage />}
                />
                <Route
                  path="/settings"
                  element={<SettingsPage />}
                />
                <Route
                  path="/signup"
                  element={<SignUp />}
                />
                <Route
                  path="/signin"
                  element={<SignIn />}
                />
              </Routes>
            </div>
      )}
    </Suspense>
  );
};

export default AppRouter;
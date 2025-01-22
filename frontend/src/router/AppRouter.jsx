import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from '../components/sidebar/Sidebar';
import SettingsPage from '../pages/SettingsPage';
import QueryBoard from '../pages/QueryBoard';
import HomePage from '../pages/HomePage';
import MetricsPage from '../pages/MetricsPage';
import SignIn from '../components/settings/SignIn';
import SignUp from '../components/settings/SignUp';
import { Loader } from 'rsuite';

const AppRouter = () => {
//   const excludedRoutes = ['/']; // Exclude timer on the authentication route
//   const location = useLocation();
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
//   const logoutFunction = useLogout();

//   useEffect(() => {
//     // Force reload the authentication page only once
//     if (location.pathname === '/' && !sessionStorage.getItem('reloaded')) {
//       sessionStorage.setItem('reloaded', 'true');
//       window.location.reload();
//     }
//   }, [location.pathname]);

//   // Handle logout when the timer ends
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     logoutFunction();
//   };

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
                  element={<QueryBoard />}
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

      {/* <Routes>
        <Route
          path="/"
          element={
            <Authentication
              onLogin={() => setIsLoggedIn(true)} // Set login state on successful login
            />
          }
        />
      </Routes> */}
    </Suspense>
  );
};

export default AppRouter;
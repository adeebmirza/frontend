import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from './routes';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}

          {/* Private Routes */}
          {privateRoutes.map(({ path, element }) => (
            <Route 
              key={path} 
              path={path} 
              element={<PrivateRoute>{element}</PrivateRoute>} 
            />
          ))}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;

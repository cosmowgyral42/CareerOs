import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AuthProvider from '../context/AuthProvider';
import AppLayout from '../layouts/AppLayout';

import Landing from '../pages/Landing';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import Dashboard from '../pages/dashboard/dashboard';

import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Landing />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
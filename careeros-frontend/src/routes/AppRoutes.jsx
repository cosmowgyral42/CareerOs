import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/dashboard';
import Goals from '../pages/goals/Goals';
import Tasks from '../pages/tasks/Tasks';
import ProtectedRoute from './ProtectedRoute';
import Projects from '../pages/projects/Projects';
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/goals"
              element={<Goals />}
            />
          </Route>
        </Route>
        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
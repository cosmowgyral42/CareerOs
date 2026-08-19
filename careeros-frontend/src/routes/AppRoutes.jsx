import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Placeholder from '../pages/Placeholder';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/goals"
            element={<Placeholder title="Goals" />}
          />
          <Route
            path="/tasks"
            element={<Placeholder title="Tasks" />}
          />
          <Route
            path="/projects"
            element={<Placeholder title="Projects" />}
          />
          <Route
            path="/applications"
            element={<Placeholder title="Applications" />}
          />
          <Route
            path="/resources"
            element={<Placeholder title="Resources" />}
          />
          <Route
            path="/skills"
            element={<Placeholder title="Skills" />}
          />
          <Route
            path="/career"
            element={<Placeholder title="Career" />}
          />
          <Route
            path="/resume"
            element={<Placeholder title="Resume AI" />}
          />
          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
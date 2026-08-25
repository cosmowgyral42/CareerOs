import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import Landing from '../pages/landing';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';

import Dashboard from '../pages/dashboard/dashboard';
import Goals from '../pages/goals/goals';
import Tasks from '../pages/tasks/tasks';
import Projects from '../pages/projects/Projects';
import Resources from '../pages/resources/resources';
import Applications from '../pages/applications/applications';
import Skills from '../pages/skills/skills';
import SkillGaps from '../pages/skill-gaps/SkillGaps';
import CareerTargets from '../pages/career-targets/CareerTargets';

import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected application */}
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

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/applications"
              element={<Applications />}
            />

            <Route
              path="/resources"
              element={<Resources />}
            />

            <Route
              path="/skills"
              element={<Skills />}
            />

            <Route
              path="/skill-gaps"
              element={<SkillGaps />}
            />

            <Route
              path="/career-targets"
              element={<CareerTargets />}
            />
          </Route>
        </Route>

        {/* Unknown routes */}
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
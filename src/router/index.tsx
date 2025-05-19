import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import ActivityTypesPage from '../pages/ActivityTypesPage'; // ← importer ici

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/activity-types',
    element: <ActivityTypesPage />, // ← nouvelle route
  },
]);

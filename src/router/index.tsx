import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import ActivityTypesPage from '../pages/ActivityTypesPage';
import ProjectList from '../pages/projects/ProjectList';
import ProjectForm from '../pages/projects/ProjectForm';
import TaskBoard from '../pages/projects/TaskBoard';
import TaskForm from '../pages/projects/TaskForm';
import TaskStatusConfig from '../pages/projects/TaskStatusConfig';
import TagManager from '../pages/projects/TagManager';

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
    element: <ActivityTypesPage />,
  },
  {
    path: '/projects',
    element: <ProjectList />,
  },
  {
    path: '/projects/create',
    element: <ProjectForm />,
  },
  {
    path: '/projects/:id/edit',
    element: <ProjectForm />,
  },
  {
    path: '/projects/:id',
    element: <TaskBoard />,
  },
  {
    path: '/projects/:id/tasks/create',
    element: <TaskForm />,
  },
  {
    path: '/projects/:id/tasks/:taskId/edit',
    element: <TaskForm />,
  },
  {
    path: '/task-status',
    element: <TaskStatusConfig />,
  },
  {
    path: '/tags',
    element: <TagManager />,
  },
]);

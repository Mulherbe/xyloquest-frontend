// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // 👈 importe ton thème
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <ActivityProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </ActivityProvider>
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

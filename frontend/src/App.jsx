import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import { getTheme } from './utils/theme';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import Dashboard from './modules/dashboard/Dashboard';
import WealthPage from './modules/wealth/WealthPage';
import LoansPage from './modules/loans/LoansPage';
import GoalsPage from './modules/goals/GoalsPage';
import ReportsPage from './modules/reports/ReportsPage';
import SettingsPage from './modules/settings/SettingsPage';

function AuthedApp({ mode, onToggleTheme }) {
  return (
    <AppLayout mode={mode} onToggleTheme={onToggleTheme}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wealth" element={<WealthPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage mode={mode} onToggleTheme={onToggleTheme} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  const savedMode = localStorage.getItem('themeMode') || 'dark';
  const [mode, setMode] = useState(savedMode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('themeMode', next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AuthedApp mode={mode} onToggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const { token, user, fetchMe } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (token && !user) {
      fetchMe().finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [token]);

  if (checking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  return children;
}

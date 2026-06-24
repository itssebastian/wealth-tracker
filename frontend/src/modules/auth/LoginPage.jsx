import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Link, Alert,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (vals) => {
    const ok = await login(vals.email, vals.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0D0F14 0%, #151820 100%)', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, background: 'linear-gradient(135deg, #6C63FF 0%, #00D9A3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <AccountBalance sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D9A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WealthOS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Sign in to your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                autoComplete="current-password"
              />
              <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ mt: 1, py: 1.5 }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover" color="primary">
                Create one
              </Link>
            </Typography>
          </Box>

          {/* Demo hint */}
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Demo: <strong>demo@wealthtracker.in</strong> / <strong>Demo@1234</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

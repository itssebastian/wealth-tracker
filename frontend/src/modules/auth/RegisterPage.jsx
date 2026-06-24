import React from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Link, Alert,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function RegisterPage() {
  const { register: authRegister, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (vals) => {
    const ok = await authRegister(vals.name, vals.email, vals.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0D0F14 0%, #151820 100%)', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, background: 'linear-gradient(135deg, #6C63FF 0%, #00D9A3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
              <AccountBalance sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D9A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WealthOS
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Create your account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name} helperText={errors.name?.message} fullWidth
              />
              <TextField
                label="Email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email} helperText={errors.email?.message} fullWidth
              />
              <TextField
                label="Password"
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                error={!!errors.password} helperText={errors.password?.message} fullWidth
              />
              <TextField
                label="Confirm Password"
                type="password"
                {...register('confirm', { validate: v => v === password || 'Passwords do not match' })}
                error={!!errors.confirm} helperText={errors.confirm?.message} fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ mt: 1, py: 1.5 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover" color="primary">Sign in</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

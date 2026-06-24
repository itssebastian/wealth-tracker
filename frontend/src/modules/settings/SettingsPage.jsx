import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, MenuItem,
  Grid, Divider, Avatar, Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import PageHeader from '../../components/common/PageHeader';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

export default function SettingsPage({ onToggleTheme, mode }) {
  const { user, updateProfile } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', currency: user?.currency || 'INR' },
  });

  const pwForm = useForm();

  const onSaveProfile = async (vals) => {
    setLoading(true);
    try {
      await updateProfile(vals);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const onChangePassword = async (vals) => {
    if (vals.newPassword !== vals.confirmPassword) return;
    setLoading(true);
    try {
      await updateProfile({ password: vals.newPassword });
      pwForm.reset();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" />
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Changes saved successfully.</Alert>}

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2.5 }} />
              <form onSubmit={handleSubmit(onSaveProfile)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Full Name" {...register('name', { required: true })} error={!!errors.name} fullWidth />
                  <TextField label="Email" value={user?.email || ''} disabled fullWidth helperText="Email cannot be changed" />
                  <TextField select label="Currency" defaultValue={user?.currency || 'INR'} {...register('currency')} fullWidth>
                    {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                  <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Password */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>Change Password</Typography>
              <form onSubmit={pwForm.handleSubmit(onChangePassword)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="New Password" type="password" {...pwForm.register('newPassword', { required: true, minLength: 6 })} error={!!pwForm.formState.errors.newPassword} fullWidth />
                  <TextField label="Confirm Password" type="password" {...pwForm.register('confirmPassword', { required: true })} fullWidth />
                  <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Appearance</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography fontWeight={600}>Theme</Typography>
                  <Typography variant="body2" color="text.secondary">Currently: {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</Typography>
                </Box>
                <Button variant="outlined" onClick={onToggleTheme}>
                  Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* App Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>About WealthOS</Typography>
              {[
                { label: 'Version', value: '1.0.0' },
                { label: 'Stack', value: 'React + Node.js + MySQL' },
                { label: 'Modules', value: 'Dashboard · Wealth · Loans · Goals · Reports' },
              ].map(item => (
                <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

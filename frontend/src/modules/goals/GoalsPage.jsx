import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, LinearProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  IconButton, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Flag } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import dayjs from 'dayjs';

const GOAL_TYPES = ['Emergency Fund', 'House Renovation', 'Car Purchase', 'Retirement', 'Child Education', 'Other'];
const GOAL_COLORS = { 'Emergency Fund': '#FF5C7C', 'House Renovation': '#FFB347', 'Car Purchase': '#6C63FF', Retirement: '#00D9A3', 'Child Education': '#4ECDC4', Other: '#8B8FA8' };

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control } = useForm();

  const fetchGoals = async () => {
    const { data } = await api.get('/goals');
    setGoals(data.data);
  };

  useEffect(() => { fetchGoals(); }, []);

  const openForm = (item = null) => {
    setEditItem(item);
    reset(item ? { ...item, targetDate: item.targetDate } : { goalName: '', goalType: 'Other', targetAmount: '', currentAmount: 0, targetDate: '' });
    setOpen(true);
  };

  const onSubmit = async (vals) => {
    setLoading(true);
    try {
      if (editItem) await api.put(`/goals/${editItem.id}`, vals);
      else await api.post('/goals', vals);
      setOpen(false);
      await fetchGoals();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/goals/${deleteId}`);
      setDeleteId(null);
      await fetchGoals();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <Box>
      <PageHeader title="Financial Goals" subtitle="Plan and track your financial milestones" action={() => openForm()} actionLabel="Add Goal" actionIcon={<Add />} />

      <Grid container spacing={2.5}>
        {goals.length === 0 && (
          <Grid size={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Flag sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">No goals yet. Set your first financial goal!</Typography>
            </Card>
          </Grid>
        )}
        {goals.map(goal => {
          const pct = parseFloat(goal.progressPct);
          const daysLeft = dayjs(goal.targetDate).diff(dayjs(), 'day');
          const color = GOAL_COLORS[goal.goalType] || '#6C63FF';
          const remaining = parseFloat(goal.targetAmount) - parseFloat(goal.currentAmount);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={goal.id}>
              <Card sx={{ height: '100%', borderTop: `3px solid ${color}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{goal.goalName}</Typography>
                      <Chip label={goal.goalType} size="small" sx={{ mt: 0.5, bgcolor: `${color}20`, color }} />
                    </Box>
                    <Box>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openForm(goal)}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(goal.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Progress</Typography>
                      <Typography variant="body2" fontWeight={700} color={pct >= 100 ? 'success.main' : 'text.primary'}>{pct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={Math.min(pct, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: `${color}20`, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Saved</Typography>
                      <Typography fontWeight={700} color="success.main">{formatCurrency(goal.currentAmount)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">Target</Typography>
                      <Typography fontWeight={700}>{formatCurrency(goal.targetAmount)}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Still needed: <strong>{formatCurrency(Math.max(0, remaining))}</strong></Typography>
                    <Typography variant="caption" color={daysLeft < 30 ? 'error.main' : 'text.secondary'}>
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editItem ? 'Edit Goal' : 'Add Financial Goal'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Goal Name" {...register('goalName', { required: true })} fullWidth />
            <Controller name="goalType" control={control} defaultValue="Other" render={({ field }) => (
              <TextField select label="Goal Type" {...field} fullWidth>
                {GOAL_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )} />
            <TextField label="Target Amount (₹)" type="number" {...register('targetAmount', { required: true })} fullWidth />
            <TextField label="Current Amount (₹)" type="number" {...register('currentAmount')} fullWidth />
            <TextField label="Target Date" type="date" InputLabelProps={{ shrink: true }} {...register('targetDate', { required: true })} fullWidth />
            <TextField label="Notes" multiline rows={2} {...register('notes')} fullWidth />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </Box>
  );
}

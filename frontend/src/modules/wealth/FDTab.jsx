import React, { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Typography, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import dayjs from 'dayjs';

const COMPOUNDING = ['Monthly', 'Quarterly', 'Annually'];

export default function FDTab({ data, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm();

  const principal = watch('principalAmount');
  const rate = watch('interestRate');
  const start = watch('startDate');
  const end = watch('maturityDate');
  const freq = watch('compoundingFrequency') || 'Quarterly';

  const calcPreview = () => {
    if (!principal || !rate || !start || !end) return null;
    const years = dayjs(end).diff(dayjs(start), 'day') / 365;
    if (years <= 0) return null;
    const n = freq === 'Monthly' ? 12 : freq === 'Quarterly' ? 4 : 1;
    return (parseFloat(principal) * Math.pow(1 + parseFloat(rate) / 100 / n, n * years)).toFixed(2);
  };

  const openForm = (item = null) => {
    setEditItem(item);
    reset(item ? { ...item, startDate: item.startDate, maturityDate: item.maturityDate } : {
      bankName: '', principalAmount: '', interestRate: '', startDate: '', maturityDate: '', compoundingFrequency: 'Quarterly', notes: '',
    });
    setOpen(true);
  };

  const onSubmit = async (vals) => {
    setLoading(true);
    try {
      if (editItem) await api.put(`/wealth/fds/${editItem.id}`, vals);
      else await api.post('/wealth/fds', vals);
      setOpen(false);
      onRefresh();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/wealth/fds/${deleteId}`);
      setDeleteId(null);
      onRefresh();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const total = data.reduce((s, a) => s + parseFloat(a.maturityAmount || a.principalAmount), 0);
  const preview = calcPreview();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>Fixed Deposits <Chip label={formatCurrency(total)} color="success" size="small" sx={{ ml: 1 }} /></Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openForm()}>Add FD</Button>
      </Box>

      <TableContainer component={Card} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bank</TableCell>
              <TableCell>FD No.</TableCell>
              <TableCell align="right">Principal</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell>Maturity Date</TableCell>
              <TableCell align="right">Maturity Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No FDs yet.</TableCell></TableRow>
            ) : data.map((row) => {
              const isMaturing = dayjs(row.maturityDate).diff(dayjs(), 'day') <= 30 && dayjs(row.maturityDate).isAfter(dayjs());
              return (
                <TableRow key={row.id} hover>
                  <TableCell>{row.bankName}</TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{row.fdNumber || '-'}</Typography></TableCell>
                  <TableCell align="right">{formatCurrency(row.principalAmount)}</TableCell>
                  <TableCell align="right">{row.interestRate}%</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {formatDate(row.maturityDate)}
                      {isMaturing && <Chip label="Maturing Soon" size="small" color="warning" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right"><Typography fontWeight={700} color="success.main">{formatCurrency(row.maturityAmount)}</Typography></TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openForm(row)}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editItem ? 'Edit FD' : 'Add Fixed Deposit'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Bank Name" {...register('bankName', { required: true })} error={!!errors.bankName} fullWidth />
            <TextField label="FD Number" {...register('fdNumber')} fullWidth />
            <TextField label="Principal Amount (₹)" type="number" {...register('principalAmount', { required: true })} error={!!errors.principalAmount} fullWidth />
            <TextField label="Interest Rate (%)" type="number" inputProps={{ step: 0.01 }} {...register('interestRate', { required: true })} error={!!errors.interestRate} fullWidth />
            <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} {...register('startDate', { required: true })} fullWidth />
            <TextField label="Maturity Date" type="date" InputLabelProps={{ shrink: true }} {...register('maturityDate', { required: true })} fullWidth />
            <Controller name="compoundingFrequency" control={control} defaultValue="Quarterly" render={({ field }) => (
              <TextField select label="Compounding" {...field} fullWidth>
                {COMPOUNDING.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            )} />
            {preview && (
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">Estimated Maturity Amount</Typography>
                <Typography variant="h6" fontWeight={700} color="success.main">{formatCurrency(preview)}</Typography>
              </Box>
            )}
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

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

const ACCOUNT_TYPES = ['Savings', 'Current', 'Salary', 'NRI'];

export default function SavingsTab({ data, onRefresh }) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const openForm = (item = null) => {
    setEditItem(item);
    reset(item || { bankName: '', accountType: 'Savings', currentBalance: '', notes: '' });
    setOpen(true);
  };

  const onSubmit = async (vals) => {
    setLoading(true);
    try {
      if (editItem) await api.put(`/wealth/savings/${editItem.id}`, vals);
      else await api.post('/wealth/savings', vals);
      setOpen(false);
      onRefresh();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/wealth/savings/${deleteId}`);
      setDeleteId(null);
      onRefresh();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const total = data.reduce((s, a) => s + parseFloat(a.currentBalance), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>Savings Accounts <Chip label={formatCurrency(total)} color="primary" size="small" sx={{ ml: 1 }} /></Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openForm()}>Add Account</Button>
      </Box>

      <TableContainer component={Card} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bank</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No accounts yet. Add your first savings account.</TableCell></TableRow>
            ) : data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell fontWeight={600}>{row.bankName}</TableCell>
                <TableCell><Chip label={row.accountType} size="small" /></TableCell>
                <TableCell align="right"><Typography fontWeight={700} color="success.main">{formatCurrency(row.currentBalance)}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>{row.notes || '-'}</Typography></TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit"><IconButton size="small" onClick={() => openForm(row)}><Edit fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editItem ? 'Edit Account' : 'Add Savings Account'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Bank Name" {...register('bankName', { required: true })} error={!!errors.bankName} fullWidth />
            <Controller name="accountType" control={control} rules={{ required: true }} render={({ field }) => (
              <TextField select label="Account Type" {...field} fullWidth>
                {ACCOUNT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )} />
            <TextField label="Current Balance (₹)" type="number" {...register('currentBalance', { required: true, min: 0 })} error={!!errors.currentBalance} fullWidth />
            <TextField label="Account Number (optional)" {...register('accountNumber')} fullWidth />
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

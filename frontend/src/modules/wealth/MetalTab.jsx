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

const GOLD_TYPES = ['Physical Gold', 'Gold ETF', 'Sovereign Gold Bond'];
const SILVER_TYPES = ['Physical Silver', 'Silver ETF', 'SilverBees'];

export default function MetalTab({ metal, data, onRefresh }) {
  const isGold = metal === 'gold';
  const types = isGold ? GOLD_TYPES : SILVER_TYPES;
  const endpoint = isGold ? '/wealth/gold' : '/wealth/silver';

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm();
  const qty = watch('quantity');
  const curr = watch('currentPrice');
  const purch = watch('purchasePrice');

  const openForm = (item = null) => {
    setEditItem(item);
    reset(item || { type: types[0], quantity: '', purchasePrice: '', currentPrice: '', purchaseDate: '', notes: '' });
    setOpen(true);
  };

  const onSubmit = async (vals) => {
    setLoading(true);
    try {
      if (editItem) await api.put(`${endpoint}/${editItem.id}`, vals);
      else await api.post(endpoint, vals);
      setOpen(false);
      onRefresh();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`${endpoint}/${deleteId}`);
      setDeleteId(null);
      onRefresh();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const total = data.reduce((s, a) => s + parseFloat(a.currentValue || 0), 0);
  const previewValue = qty && curr ? (parseFloat(qty) * parseFloat(curr)).toFixed(2) : null;
  const previewPnL = qty && curr && purch ? ((parseFloat(curr) - parseFloat(purch)) * parseFloat(qty)).toFixed(2) : null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {isGold ? 'Gold' : 'Silver'} Investments{' '}
          <Chip label={formatCurrency(total)} color="warning" size="small" sx={{ ml: 1 }} />
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openForm()}>Add {isGold ? 'Gold' : 'Silver'}</Button>
      </Box>

      <TableContainer component={Card} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Qty (g)</TableCell>
              <TableCell align="right">Buy Price/g</TableCell>
              <TableCell align="right">Current/g</TableCell>
              <TableCell align="right">Current Value</TableCell>
              <TableCell align="right">P&amp;L</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No {isGold ? 'gold' : 'silver'} investments yet.</TableCell></TableRow>
            ) : data.map((row) => {
              const pnl = parseFloat(row.profitLoss || 0);
              return (
                <TableRow key={row.id} hover>
                  <TableCell><Chip label={row.type} size="small" color={isGold ? 'warning' : 'default'} /></TableCell>
                  <TableCell align="right">{row.quantity}g</TableCell>
                  <TableCell align="right">{formatCurrency(row.purchasePrice)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.currentPrice)}</TableCell>
                  <TableCell align="right"><Typography fontWeight={700}>{formatCurrency(row.currentValue)}</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={700} color={pnl >= 0 ? 'success.main' : 'error.main'}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</Typography></TableCell>
                  <TableCell>{formatDate(row.purchaseDate)}</TableCell>
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
        <DialogTitle fontWeight={700}>{editItem ? 'Edit' : 'Add'} {isGold ? 'Gold' : 'Silver'} Investment</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Controller name="type" control={control} rules={{ required: true }} defaultValue={types[0]} render={({ field }) => (
              <TextField select label="Type" {...field} fullWidth>
                {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )} />
            <TextField label="Quantity (grams)" type="number" inputProps={{ step: 0.0001 }} {...register('quantity', { required: true })} fullWidth />
            <TextField label="Purchase Price (₹/gram)" type="number" inputProps={{ step: 0.01 }} {...register('purchasePrice', { required: true })} fullWidth />
            <TextField label="Current Price (₹/gram)" type="number" inputProps={{ step: 0.01 }} {...register('currentPrice', { required: true })} fullWidth />
            {previewValue && (
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Current Value</Typography>
                  <Typography fontWeight={700}>{formatCurrency(previewValue)}</Typography>
                </Box>
                {previewPnL && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">P&L</Typography>
                    <Typography fontWeight={700} color={parseFloat(previewPnL) >= 0 ? 'success.main' : 'error.main'}>
                      {parseFloat(previewPnL) >= 0 ? '+' : ''}{formatCurrency(previewPnL)}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            <TextField label="Purchase Date" type="date" InputLabelProps={{ shrink: true }} {...register('purchaseDate', { required: true })} fullWidth />
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

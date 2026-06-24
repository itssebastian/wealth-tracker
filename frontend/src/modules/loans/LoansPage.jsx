import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Tabs, Tab,
} from '@mui/material';
import { Add, Edit, Delete, Payment, CurrencyRupee } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';

const LOAN_TYPES = ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan', 'Other'];

function LoanCard({ loan, onEdit, onDelete, onSelect, selected }) {
  return (
    <Card
      onClick={() => onSelect(loan)}
      sx={{ cursor: 'pointer', border: selected ? '2px solid' : '1px solid', borderColor: selected ? 'primary.main' : 'divider' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" fontWeight={700}>{loan.bankName}</Typography>
          <Chip label={loan.loanType} size="small" color="primary" />
        </Box>
        <Typography variant="h5" fontWeight={800} color="error.main" sx={{ mb: 1 }}>
          {formatCurrency(loan.currentOutstanding)}
        </Typography>
        <LinearProgress variant="determinate" value={parseFloat(loan.loanProgressPct)} sx={{ mb: 1, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6C63FF, #00D9A3)' } }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">{loan.loanProgressPct}% paid</Typography>
          <Typography variant="caption" color="text.secondary">EMI: {formatCurrency(loan.emiAmount)}/mo</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <Tooltip title="Edit"><IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(loan); }}><Edit fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(loan.id); }}><Delete fontSize="small" /></IconButton></Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [prepayments, setPrepayments] = useState([]);
  const [detailTab, setDetailTab] = useState(0);
  const [loanDialog, setLoanDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [prepayDialog, setPrepayDialog] = useState(false);
  const [editLoan, setEditLoan] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loanForm = useForm();
  const paymentForm = useForm();
  const prepayForm = useForm();

  const fetchLoans = async () => {
    const { data } = await api.get('/loans');
    setLoans(data.data);
    if (data.data.length > 0 && !selectedLoan) setSelectedLoan(data.data[0]);
  };

  const fetchPayments = async (loanId) => {
    const [p, pp] = await Promise.all([
      api.get(`/loans/${loanId}/payments`),
      api.get(`/loans/${loanId}/prepayments`),
    ]);
    setPayments(p.data.data);
    setPrepayments(pp.data.data);
  };

  useEffect(() => { fetchLoans(); }, []);
  useEffect(() => { if (selectedLoan) fetchPayments(selectedLoan.id); }, [selectedLoan]);

  const openLoanDialog = (loan = null) => {
    setEditLoan(loan);
    loanForm.reset(loan || { bankName: '', loanType: 'Home Loan', loanAmount: '', interestRate: '', loanStartDate: '', loanTenureMonths: '', currentOutstanding: '', emiAmount: '' });
    setLoanDialog(true);
  };

  const submitLoan = async (vals) => {
    setLoading(true);
    try {
      if (editLoan) await api.put(`/loans/${editLoan.id}`, vals);
      else await api.post('/loans', vals);
      setLoanDialog(false);
      await fetchLoans();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitPayment = async (vals) => {
    setLoading(true);
    try {
      await api.post(`/loans/${selectedLoan.id}/payments`, vals);
      setPaymentDialog(false);
      paymentForm.reset();
      await fetchLoans();
      await fetchPayments(selectedLoan.id);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const submitPrepay = async (vals) => {
    setLoading(true);
    try {
      await api.post(`/loans/${selectedLoan.id}/prepayments`, vals);
      setPrepayDialog(false);
      prepayForm.reset();
      await fetchLoans();
      await fetchPayments(selectedLoan.id);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/loans/${deleteId}`);
      setDeleteId(null);
      setSelectedLoan(null);
      await fetchLoans();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const sl = selectedLoan;

  return (
    <Box>
      <PageHeader title="Loans" subtitle="Track your home loan and EMI payments" action={() => openLoanDialog()} actionLabel="Add Loan" actionIcon={<Add />} />

      <Grid container spacing={2.5}>
        {/* Loan cards */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loans.length === 0 ? (
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No loans added yet.</Typography>
              </Card>
            ) : loans.map(loan => (
              <LoanCard key={loan.id} loan={loan} selected={selectedLoan?.id === loan.id}
                onSelect={setSelectedLoan} onEdit={openLoanDialog} onDelete={setDeleteId} />
            ))}
          </Box>
        </Grid>

        {/* Detail panel */}
        {sl && (
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h6" fontWeight={700}>{sl.bankName} — Loan Detail</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button size="small" variant="outlined" startIcon={<Payment />} onClick={() => setPaymentDialog(true)}>Add EMI</Button>
                    <Button size="small" variant="outlined" color="success" startIcon={<CurrencyRupee />} onClick={() => setPrepayDialog(true)}>Prepay</Button>
                  </Box>
                </Box>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {[
                    { label: 'Original Loan', value: formatCurrency(sl.loanAmount), color: 'text.primary' },
                    { label: 'Outstanding', value: formatCurrency(sl.currentOutstanding), color: 'error.main' },
                    { label: 'Total Paid', value: formatCurrency(sl.totalPaid), color: 'success.main' },
                    { label: 'Interest Paid', value: formatCurrency(sl.totalInterestPaid), color: 'warning.main' },
                    { label: 'Principal Paid', value: formatCurrency(sl.totalPrincipalPaid), color: 'primary.main' },
                    { label: 'EMI/Month', value: formatCurrency(sl.emiAmount), color: 'text.primary' },
                  ].map(s => (
                    <Grid item xs={6} sm={4} key={s.label}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                        <Typography fontWeight={700} color={s.color}>{s.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Tabs value={detailTab} onChange={(_, v) => setDetailTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tab label={`EMI History (${payments.length})`} sx={{ textTransform: 'none' }} />
                  <Tab label={`Prepayments (${prepayments.length})`} sx={{ textTransform: 'none' }} />
                </Tabs>

                {detailTab === 0 && (
                  <TableContainer sx={{ maxHeight: 320, overflowX: 'auto' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">EMI</TableCell>
                          <TableCell align="right">Principal</TableCell>
                          <TableCell align="right">Interest</TableCell>
                          <TableCell align="right">Outstanding</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments.length === 0 ? (
                          <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No payments recorded.</TableCell></TableRow>
                        ) : payments.map(p => (
                          <TableRow key={p.id} hover>
                            <TableCell>{formatDate(p.paymentDate)}</TableCell>
                            <TableCell align="right">{formatCurrency(p.emiAmount)}</TableCell>
                            <TableCell align="right" sx={{ color: 'success.main' }}>{formatCurrency(p.principalComponent)}</TableCell>
                            <TableCell align="right" sx={{ color: 'error.main' }}>{formatCurrency(p.interestComponent)}</TableCell>
                            <TableCell align="right">{formatCurrency(p.outstandingAfterPayment)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {detailTab === 1 && (
                  <TableContainer sx={{ maxHeight: 320, overflowX: 'auto' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Outstanding After</TableCell>
                          <TableCell align="right">Interest Saved</TableCell>
                          <TableCell align="right">Months Saved</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prepayments.length === 0 ? (
                          <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No prepayments recorded.</TableCell></TableRow>
                        ) : prepayments.map(p => (
                          <TableRow key={p.id} hover>
                            <TableCell>{formatDate(p.prepaymentDate)}</TableCell>
                            <TableCell align="right" sx={{ color: 'success.main', fontWeight: 700 }}>{formatCurrency(p.amount)}</TableCell>
                            <TableCell align="right">{formatCurrency(p.outstandingAfterPrepayment)}</TableCell>
                            <TableCell align="right" sx={{ color: 'success.main' }}>{formatCurrency(p.interestSaved)}</TableCell>
                            <TableCell align="right">{p.monthsSaved} mo</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Loan Form Dialog */}
      <Dialog open={loanDialog} onClose={() => setLoanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editLoan ? 'Edit Loan' : 'Add Loan'}</DialogTitle>
        <form onSubmit={loanForm.handleSubmit(submitLoan)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Bank Name" {...loanForm.register('bankName', { required: true })} fullWidth />
            <Controller name="loanType" control={loanForm.control} defaultValue="Home Loan" render={({ field }) => (
              <TextField select label="Loan Type" {...field} fullWidth>
                {LOAN_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )} />
            <TextField label="Loan Amount (₹)" type="number" {...loanForm.register('loanAmount', { required: true })} fullWidth />
            <TextField label="Interest Rate (%)" type="number" inputProps={{ step: 0.01 }} {...loanForm.register('interestRate', { required: true })} fullWidth />
            <TextField label="EMI Amount (₹)" type="number" {...loanForm.register('emiAmount', { required: true })} fullWidth />
            <TextField label="Loan Start Date" type="date" InputLabelProps={{ shrink: true }} {...loanForm.register('loanStartDate', { required: true })} fullWidth />
            <TextField label="Tenure (Months)" type="number" {...loanForm.register('loanTenureMonths', { required: true })} fullWidth />
            <TextField label="Current Outstanding (₹)" type="number" {...loanForm.register('currentOutstanding', { required: true })} fullWidth />
            <TextField label="Account Number" {...loanForm.register('accountNumber')} fullWidth />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setLoanDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* EMI Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Record EMI Payment</DialogTitle>
        <form onSubmit={paymentForm.handleSubmit(submitPayment)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Payment Date" type="date" InputLabelProps={{ shrink: true }} {...paymentForm.register('paymentDate', { required: true })} fullWidth />
            <TextField label="EMI Amount (₹)" type="number" defaultValue={sl?.emiAmount} {...paymentForm.register('emiAmount', { required: true })} fullWidth />
            <TextField label="Principal Component (₹)" type="number" {...paymentForm.register('principalComponent', { required: true })} fullWidth />
            <TextField label="Interest Component (₹)" type="number" {...paymentForm.register('interestComponent', { required: true })} fullWidth />
            <TextField label="Outstanding After Payment (₹)" type="number" {...paymentForm.register('outstandingAfterPayment', { required: true })} fullWidth />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Saving...' : 'Record'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Prepayment Dialog */}
      <Dialog open={prepayDialog} onClose={() => setPrepayDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Record Prepayment</DialogTitle>
        <form onSubmit={prepayForm.handleSubmit(submitPrepay)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Prepayment Date" type="date" InputLabelProps={{ shrink: true }} {...prepayForm.register('prepaymentDate', { required: true })} fullWidth />
            <TextField label="Amount (₹)" type="number" {...prepayForm.register('amount', { required: true, min: 1 })} fullWidth />
            <TextField label="Notes" multiline rows={2} {...prepayForm.register('notes')} fullWidth />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setPrepayDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={loading}>{loading ? 'Processing...' : 'Record Prepayment'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={loading} />
    </Box>
  );
}

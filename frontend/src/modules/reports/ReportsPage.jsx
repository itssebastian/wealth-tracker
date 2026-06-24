import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, TextField, MenuItem, Divider,
} from '@mui/material';
import { BarChart as BarChartIcon } from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import dayjs from 'dayjs';

const COLORS = ['#6C63FF', '#00D9A3', '#FFB347', '#FF5C7C'];

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [s, t, l] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/networth-trend'),
        api.get('/loans'),
      ]);
      setSummary(s.data.data);
      setTrend(t.data.data.map(r => ({ month: dayjs(r.recordDate).format('MMM YY'), netWorth: parseFloat(r.netWorth), assets: parseFloat(r.totalSavings) + parseFloat(r.totalFD) + parseFloat(r.totalGold) + parseFloat(r.totalSilver) })));
      setLoans(l.data.data);
    };
    load();
  }, []);

  const pieData = summary ? [
    { name: 'Savings', value: parseFloat(summary.totalSavings) },
    { name: 'FD', value: parseFloat(summary.totalFD) },
    { name: 'Gold', value: parseFloat(summary.totalGold) },
    { name: 'Silver', value: parseFloat(summary.totalSilver) },
  ].filter(d => d.value > 0) : [];

  const loanBarData = loans.map(l => ({
    name: l.bankName,
    original: parseFloat(l.loanAmount),
    outstanding: parseFloat(l.currentOutstanding),
    paid: parseFloat(l.totalPaid || 0),
  }));

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Financial insights and analysis" />

      <Grid container spacing={2.5}>
        {/* Wealth Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Wealth Breakdown</Typography>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No data</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Net Worth vs Assets */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Net Worth vs Total Assets</Typography>
              {trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="assets" name="Total Assets" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netWorth" name="Net Worth" fill="#00D9A3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No trend data</Typography>}
            </CardContent>
          </Card>
        </Grid>

        {/* Loan Report */}
        {loanBarData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Loan Analysis</Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={loanBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={v => formatCurrency(v)} />
                    <Legend />
                    <Bar dataKey="original" name="Original Loan" fill="#FF5C7C" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outstanding" name="Outstanding" fill="#FFB347" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="paid" name="Total Paid" fill="#00D9A3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Summary Table */}
        {summary && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Financial Summary</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Total Assets', value: formatCurrency(summary.totalAssets), color: 'success.main' },
                    { label: 'Total Liabilities', value: formatCurrency(summary.totalLiabilities), color: 'error.main' },
                    { label: 'Net Worth', value: formatCurrency(summary.netWorth), color: 'primary.main' },
                    { label: 'Savings', value: formatCurrency(summary.totalSavings) },
                    { label: 'Fixed Deposits', value: formatCurrency(summary.totalFD) },
                    { label: 'Gold', value: formatCurrency(summary.totalGold) },
                    { label: 'Silver', value: formatCurrency(summary.totalSilver) },
                  ].map(item => (
                    <Grid item xs={6} sm={4} md={3} key={item.label}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                        <Typography fontWeight={700} color={item.color || 'text.primary'}>{item.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

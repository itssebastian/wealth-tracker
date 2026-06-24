import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Alert, Divider,
} from '@mui/material';
import {
  Savings, AccountBalance, Diamond, Inventory2, Home, TrendingUp,
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import dayjs from 'dayjs';

const COLORS = ['#6C63FF', '#00D9A3', '#FFB347', '#FF5C7C'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, trendRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/networth-trend'),
        ]);
        setSummary(sumRes.data.data);
        setTrend(trendRes.data.data.map(r => ({
          month: dayjs(r.recordDate).format('MMM YY'),
          netWorth: parseFloat(r.netWorth),
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pieData = summary ? [
    { name: 'Savings', value: parseFloat(summary.assetAllocation.savings) },
    { name: 'FD', value: parseFloat(summary.assetAllocation.fd) },
    { name: 'Gold', value: parseFloat(summary.assetAllocation.gold) },
    { name: 'Silver', value: parseFloat(summary.assetAllocation.silver) },
  ].filter(d => d.value > 0) : [];

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle={`Updated ${dayjs().format('DD MMM YYYY')}`} />

      {/* Notifications */}
      {summary?.notifications?.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {summary.notifications.map((n, i) => (
            <Alert key={i} severity={n.severity === 'warning' ? 'warning' : 'info'} sx={{ borderRadius: 2 }}>
              <strong>{n.type}:</strong> {n.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Savings" value={formatCurrency(summary?.totalSavings)} icon={<Savings />}
            gradient="linear-gradient(135deg, #6C63FF, #5A52D5)" loading={loading} subtitle="All accounts" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Fixed Deposits" value={formatCurrency(summary?.totalFD)} icon={<AccountBalance />}
            gradient="linear-gradient(135deg, #00D9A3, #00A87E)" loading={loading} subtitle="Maturity value" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Gold" value={formatCurrency(summary?.totalGold)} icon={<Diamond />}
            gradient="linear-gradient(135deg, #FFB347, #FF8C00)" loading={loading} subtitle="Current price" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Silver" value={formatCurrency(summary?.totalSilver)} icon={<Inventory2 />}
            gradient="linear-gradient(135deg, #8B8FA8, #6B6F88)" loading={loading} subtitle="Current price" />
        </Grid>
      </Grid>

      {/* Net Worth + Allocation + Loans */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(145deg, rgba(108,99,255,0.15) 0%, rgba(0,217,163,0.07) 100%)', border: '1px solid rgba(108,99,255,0.2)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Net Worth
              </Typography>
              <Typography fontWeight={800} sx={{ mt: 0.75, mb: 1.5, fontSize: { xs: '1.875rem', md: '2.5rem' }, lineHeight: 1.1, background: 'linear-gradient(135deg, #6C63FF, #00D9A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {loading ? '—' : formatCurrency(summary?.netWorth)}
              </Typography>
              <Divider sx={{ mb: 1.5, borderColor: 'rgba(108,99,255,0.15)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Assets</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">{formatCurrency(summary?.totalAssets)}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">Liabilities</Typography>
                  <Typography variant="body2" fontWeight={700} color="error.main">{formatCurrency(summary?.totalLiabilities)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>Asset Allocation</Typography>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="46%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '0.72rem', paddingTop: 4 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No asset data</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Home sx={{ fontSize: 18, color: 'error.main' }} />
                  <Typography variant="subtitle2" fontWeight={700}>Loan Overview</Typography>
                </Box>
                {loading ? (
                  <Typography variant="body2" color="text.secondary">Loading...</Typography>
                ) : (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                    <Typography fontWeight={800} sx={{ fontSize: '2rem', lineHeight: 1.1, color: 'error.main', mt: 0.5 }}>
                      {formatCurrency(summary?.totalLiabilities)}
                    </Typography>
                  </Box>
                )}
              </Box>
              {!loading && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider', mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total Assets</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">{formatCurrency(summary?.totalAssets)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">Net Worth</Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">{formatCurrency(summary?.netWorth)}</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Net Worth Trend */}
      <Card>
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUp sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant="subtitle2" fontWeight={700}>Net Worth Trend</Typography>
          </Box>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trend} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} width={52} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="netWorth" stroke="#6C63FF" strokeWidth={2} dot={{ fill: '#6C63FF', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
              <TrendingUp sx={{ fontSize: 40, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">No trend data yet.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function StatCard({ title, value, subtitle, icon, gradient, loading, trend, trendValue }) {
  if (loading) return (
    <Card>
      <CardContent>
        <Skeleton width="60%" />
        <Skeleton width="40%" height={48} />
        <Skeleton width="50%" />
      </CardContent>
    </Card>
  );

  const isPositive = parseFloat(trendValue) >= 0;

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient accent bar */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: gradient || 'linear-gradient(90deg, #6C63FF, #00D9A3)' }} />
      <CardContent sx={{ pt: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ p: 0.8, borderRadius: 1.5, background: gradient ? `linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,217,163,0.08))` : 'action.hover' }}>
              {React.cloneElement(icon, { sx: { fontSize: 18, color: 'primary.main' } })}
            </Box>
          )}
        </Box>

        <Typography variant="h5" fontWeight={700} sx={{ my: 0.5, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          {trend && trendValue !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {isPositive ? (
                <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />
              )}
              <Typography variant="caption" fontWeight={700} color={isPositive ? 'success.main' : 'error.main'}>
                {isPositive ? '+' : ''}{trendValue}%
              </Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

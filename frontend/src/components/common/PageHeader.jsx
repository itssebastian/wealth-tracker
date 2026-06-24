import { Box, Typography, Button } from '@mui/material';

export default function PageHeader({ title, subtitle, action, actionLabel, actionIcon }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 1, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      {action && (
        <Button variant="contained" startIcon={actionIcon} onClick={action} sx={{ flexShrink: 0 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>{title || 'Confirm Delete'}</DialogTitle>
      <DialogContent>
        <Typography>{message || 'Are you sure? This action cannot be undone.'}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

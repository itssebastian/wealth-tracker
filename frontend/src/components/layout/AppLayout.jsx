import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip, useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Dashboard, AccountBalance, Savings, BarChart, Flag, Settings,
  Menu as MenuIcon, Home, Logout, Brightness4, Brightness7,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const DRAWER_WIDTH = 220;

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Wealth', icon: <Savings />, path: '/wealth' },
  { label: 'Loans', icon: <Home />, path: '/loans' },
  { label: 'Goals', icon: <Flag />, path: '/goals' },
  { label: 'Reports', icon: <BarChart />, path: '/reports' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
];

export default function AppLayout({ children, mode, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: 1 }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: 'linear-gradient(135deg, #6C63FF 0%, #00D9A3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <AccountBalance sx={{ color: '#fff', fontSize: 17 }} />
        </Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D9A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          WealthOS
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, px: 1.5, mt: 0.5 }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  pl: 1.5,
                  bgcolor: active ? 'rgba(108,99,255,0.12)' : 'transparent',
                  '&:hover': { bgcolor: active ? 'rgba(108,99,255,0.16)' : 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.primary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 600 : 400, fontSize: '0.875rem', color: active ? 'primary.main' : 'text.primary' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User section */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>{user?.email}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, bgcolor: 'action.hover', borderRadius: 2, p: 0.5 }}>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton size="small" onClick={onToggleTheme} sx={{ flex: 1, borderRadius: 1.5 }}>
              {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={() => { logout(); navigate('/login'); }} sx={{ flex: 1, borderRadius: 1.5 }}>
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Toolbar variant="dense">
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1.5 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #6C63FF, #00D9A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WealthOS
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' } }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' } }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, mt: { xs: 7, md: 0 }, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}

import { createTheme } from '@mui/material/styles';

const baseTokens = {
  primary: '#6C63FF',      // electric violet
  primaryDark: '#5A52D5',
  secondary: '#00D9A3',    // emerald accent
  error: '#FF5C7C',
  warning: '#FFB347',
  success: '#00D9A3',
  dark: {
    bg: '#0D0F14',
    surface: '#151820',
    card: '#1C1F2E',
    cardHover: '#22263A',
    border: '#2A2D3E',
    text: '#E8EAFF',
    textSecondary: '#8B8FA8',
  },
  light: {
    bg: '#F4F6FF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E5E8F5',
    text: '#1A1D2E',
    textSecondary: '#6B6F88',
  },
};

export const getTheme = (mode = 'dark') => createTheme({
  palette: {
    mode,
    primary: { main: baseTokens.primary, dark: baseTokens.primaryDark },
    secondary: { main: baseTokens.secondary },
    error: { main: baseTokens.error },
    warning: { main: baseTokens.warning },
    success: { main: baseTokens.success },
    background: {
      default: mode === 'dark' ? baseTokens.dark.bg : baseTokens.light.bg,
      paper: mode === 'dark' ? baseTokens.dark.card : baseTokens.light.surface,
    },
    text: {
      primary: mode === 'dark' ? baseTokens.dark.text : baseTokens.light.text,
      secondary: mode === 'dark' ? baseTokens.dark.textSecondary : baseTokens.light.textSecondary,
    },
    divider: mode === 'dark' ? baseTokens.dark.border : baseTokens.light.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', letterSpacing: '0.04em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${mode === 'dark' ? baseTokens.dark.border : baseTokens.light.border}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: mode === 'dark' ? '0 8px 32px rgba(108,99,255,0.15)' : '0 8px 32px rgba(0,0,0,0.08)' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 16px rgba(108,99,255,0.35)' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 6 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6 },
      },
    },
  },
});

export default getTheme;

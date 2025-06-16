'use client';

import { useState, useMemo } from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Container,
  Box,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from 'next/link';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { FavoritesProvider } from '../context/FavoritesContext';

export default function RootLayout({ children }) {
  const [mode, setMode] = useState('light');

  const toggleDarkMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1e3a8a' },
          secondary: { main: '#f97316' },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Inter", "Poppins", sans-serif',
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body>
        <FavoritesProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6">Salamander Tracker</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button color="inherit" component={Link} href="/">
                    Home
                  </Button>
                  <Button color="inherit" component={Link} href="/videos">
                    Videos
                  </Button>
                  <Button color="inherit" component={Link} href="/favorites">
                    Favorites
                  </Button>
                  <IconButton onClick={toggleDarkMode} color="inherit">
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>
            <Container sx={{ py: 4 }}>{children}</Container>
          </ThemeProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
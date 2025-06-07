// === src/app/layout.js ===
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
          primary: { main: '#2e7d32' },
          secondary: { main: '#ff7043' },
        },
        typography: {
          fontFamily: '"Poppins", Arial, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body>
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
                <IconButton onClick={toggleDarkMode} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          <Container sx={{ py: 4 }}>{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "@global": {
            "*::-webkit-scrollbar": {
              width: "5px"
            },
            "*::-webkit-scrollbar-track": {
              background: "#E4EFEF"
            },
            "*::-webkit-scrollbar-thumb": {
              background: "#1D388F61",
              borderRadius: "2px"
            }
          }
        }
      }
    }
  }
});

export default theme;
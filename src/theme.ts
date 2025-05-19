// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9146FF',
    },
    background: {
      default: '#0f0f0f',
      paper: '#181818',
    },
    text: {
      primary: '#fff',
      secondary: '#aaa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #9146FF',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});

export default theme;

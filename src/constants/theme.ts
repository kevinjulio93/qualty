import { createTheme, Theme } from '@mui/material/styles';
export const APP_THEME: Theme = createTheme({
    palette: {
        primary: {
          main: '#185063',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#D47B3D',
        },
        warning: {
          main: '#f6ce48',
        },
        success: {
          main: '#4a811c',
        },
        error: {
          main: '#F44336',
        },
    },
});
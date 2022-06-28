import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#0086ff',
    },
    secondary: {
      main: '#4f9cb1',
    },
    error: {
      main: '#d62828',
    },
    background: {
      default: '#FAFAFA',
    },
  },
});

export default theme;
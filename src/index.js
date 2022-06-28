import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Authenticator } from "./context/Authenticator";
import App from './App';
import theme from './theme';
import history from "./routes/history";

ReactDOM.render(
  <React.StrictMode>
    <Authenticator>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>
          <App />
        </Router>
      </ThemeProvider>
    </Authenticator>
  </React.StrictMode>,
  document.getElementById('root')
);
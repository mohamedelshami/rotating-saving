import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from "./serviceWorker";

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import App from './App';
import theme from './theme';

const history = createBrowserHistory();

ReactDOM.render(
 <Router history={history}>
   <ThemeProvider theme={theme}>
     <CssBaseline />
     <App />
   </ThemeProvider>
 </Router>,
  document.querySelector('#root'),
);

serviceWorker.unregister();

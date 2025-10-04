import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import MuiThemeProvider from './shared/theme/MuiThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MuiThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MuiThemeProvider>
  </StrictMode>
);

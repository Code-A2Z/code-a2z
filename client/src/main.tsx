import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import MuiThemeProvider from './shared/components/molecules/theme';
import { BrowserRouter } from 'react-router-dom';
import A2ZNotifications from './shared/components/molecules/notification';

const cache = createCache({
  key: 'myapp',
  nonce: 'code-a2z-css', // 🔑 must match the CSP nonce
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={cache}>
      <MuiThemeProvider>
        <BrowserRouter>
          <A2ZNotifications />
          <App />
        </BrowserRouter>
      </MuiThemeProvider>
    </CacheProvider>
  </StrictMode>
);

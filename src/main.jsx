import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { AxiosProvider } from './contexts/AxiosContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AxiosProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AxiosProvider>
    </BrowserRouter>
  </StrictMode>,
);
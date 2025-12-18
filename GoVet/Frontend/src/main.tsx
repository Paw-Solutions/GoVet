import React from 'react';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import App from './App';
import { AuthProvider } from './hooks/useAuth'; // ← añadido

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProvider>    {/* ← añadido */}
      <App />
    </AuthProvider>  {/* ← añadido */}
  </React.StrictMode>
);
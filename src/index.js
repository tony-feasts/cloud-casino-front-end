import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="747809132155-su6a3kum44eabtir69jst8v9v1iasp98.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);

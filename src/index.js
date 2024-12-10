import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const root = ReactDOM.createRoot(document.getElementById('root'));
const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql', // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
});
root.render(
  <GoogleOAuthProvider clientId="747809132155-su6a3kum44eabtir69jst8v9v1iasp98.apps.googleusercontent.com">
      <ApolloProvider client = {client}>
          <App />
      </ApolloProvider>

  </GoogleOAuthProvider>
);

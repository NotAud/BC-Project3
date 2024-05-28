import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css'
import { SocketProvider } from './providers/SocketProvider';

import ROUTER from './router/router';
import { UserProvider } from './providers/UserContext';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SocketProvider>
        <UserProvider>
          <RouterProvider router={ROUTER} />
        </UserProvider>
      </SocketProvider>
    </ApolloProvider>
  </React.StrictMode>,
)

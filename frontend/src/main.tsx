import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import './index.css'

import ROUTER from './router/router';
import { UserProvider } from './providers/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={ROUTER} />
    </UserProvider>
  </React.StrictMode>,
)

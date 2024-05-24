import Home from "../pages/home/Home.tsx";
import Login from "../pages/login/Login.tsx";
import Signup from "../pages/login/Signup.tsx";

import MainLayout from "../layouts/MainLayout.tsx";

import AuthMiddleware from "./middleware/AuthMiddleware.ts";

const ROUTES = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        loader: AuthMiddleware,
        element: <Login />
      },
      {
        path: "/signup",
        loader: AuthMiddleware,
        element: <Signup />
      },
    ]
  },
]

// eslint-disable-next-line react-refresh/only-export-components
export default ROUTES;

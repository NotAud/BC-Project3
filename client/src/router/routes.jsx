import Home from "../pages/home/Home.jsx";
import Login from "../pages/login/Login.jsx";
import Signup from "../pages/login/Signup.jsx";
import LobbyPage from "../pages/lobby/LobbyPage.jsx";
import HistoricGames from "../pages/historygames/HistoricGames.jsx";

import MainLayout from "../layouts/MainLayout.jsx";

import AuthMiddleware from "./middleware/AuthMiddleware.js";

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
      {
        path: "/lobby/:id",
        element: <LobbyPage />
      },
      {
        path: "/historic-games",
        element: <HistoricGames />
      },
    ]
  },
]

// eslint-disable-next-line react-refresh/only-export-components
export default ROUTES;

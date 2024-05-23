import Login from "../pages/login/Login.tsx";
import Home from "../pages/home/Home.tsx";

const ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]

// eslint-disable-next-line react-refresh/only-export-components
export default ROUTES;

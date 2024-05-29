import { Link, useNavigate, useLocation } from "react-router-dom";

export default function HeaderLogin() {
    const navigate = useNavigate()
    const location = useLocation()

    async function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return location.pathname !== "/login" && location.pathname !== "/signup" ? (
        <>
            {
                localStorage.getItem("user") ? (
                    <button onClick={handleLogout} className="text-[16px] hover:text-orange-700 transition-all">Logout</button>
                ) : (
                    <Link to="/login" className="text-[16px] hover:text-orange-700 transition-all">Login</Link>
                )
            }
        </>
    ) : null
}
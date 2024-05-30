import { Link, Outlet } from 'react-router-dom';
import HeaderLogin from '../components/HeaderLogin';
import Logo from "../assets/logo.png"


export default function MainLayout() {
    const currentYear = new Date().getFullYear()

    return(
        <div className="flex flex-col w-full h-full overflow-x-hidden">
            <header className="flex justify-between pt-2 px-4">
                <div className="flex items-center gap-x-6">
                    <Link to="/">
                        <div className="flex items-center hover:scale-105 transition-all">
                            <img src={Logo} alt="Quizly" className="w-10 h-10" />
                            <h1 className="text-[18px] font-medium">Quizly</h1>
                        </div>
                    </Link>
                    <div className="flex gap-x-4">
                        <Link to="/">
                            <span className="text-[18px] hover:text-orange-700 transition-all">Home</span>
                        </Link>
                        <Link to="/historic-games">
                            <span className="text-[18px] hover:text-orange-700 transition-all">Historic Games</span>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center">
                    <HeaderLogin />
                </div>
            </header>
            <hr />
            <main className="flex flex-grow">
                <Outlet />
            </main>
            <footer className="text-center">
                <span>Ron Miller © {currentYear}</span>
            </footer>
        </div>
    )
}
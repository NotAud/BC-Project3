import { Link, Outlet } from 'react-router-dom';
import HeaderLogin from '../components/HeaderLogin';


export default function MainLayout() {
    const currentYear = new Date().getFullYear()

    return(
        <div className="flex flex-col w-full h-full">
            <header className="flex justify-between bg-purple-300 py-2 px-4">
                <Link to="/">
                    <h1 className="text-[18px] font-medium">Quiz Game</h1>
                </Link>
                <div className="flex">
                    <HeaderLogin />
                </div>
            </header>
            <main className="flex flex-grow">
                <Outlet />
            </main>
            <footer className="text-center">
                <span>Ron Miller © {currentYear}</span>
            </footer>
        </div>
    )
}
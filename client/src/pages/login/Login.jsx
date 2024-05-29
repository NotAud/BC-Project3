import { useState } from "react";
import loginUser from "../../api/login"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        
        // Call the loginUser function with the entered username and password
        const response = await loginUser(username, password);

        // Clear the form fields after submission
        setUsername('');
        setPassword('');

        // Redirect to the home page after successful login
        if (response.error === null) {
            navigate("/");
        }
    }

    async function goToSignup() {
        navigate("/signup");
    }

    return (
        <div className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2 rounded-[4px] bg-black/5 shadow-md px-4 py-2">
                    <h1 className="text-[24px] font-medium">Sign In</h1>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-1">
                            <div className="flex flex-col gap-y-0.5">
                                <label htmlFor="username" className="text-[12px] text-zinc-800">Username</label>
                                <input type="text" id="username" value={username} spellCheck="false" autoComplete="off" onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-y-0.5">
                                <label htmlFor="password" className="text-[12px] text-zinc-800">Password</label>
                                <input type="password" id="password" value={password} spellCheck="false" autoComplete="off" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <button className="bg-zinc-900 rounded-[4px] py-1 text-white transition-all hover:bg-zinc-800/90" onClick={handleLogin}>Login</button>
                    </div>
                </div>
                <button className="w-full bg-zinc-900 rounded-[4px] py-1 text-white transition-all hover:bg-zinc-800/90" onClick={goToSignup}>Sign Up</button>
            </div>
        </div>
    )
}
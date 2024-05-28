import { useState } from "react";
import signupUser from "../../api/signup"

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleSignup(e: any) {
        e.preventDefault();
        
        // Call the loginUser function with the entered username and password
        const response = await signupUser(username, password);

        // Clear the form fields after submission
        setUsername('');
        setPassword('');
    }

    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="flex flex-col gap-y-2 rounded-[4px] bg-black/5 shadow-md px-4 py-2">
                <h1 className="text-[24px] font-medium">Sign Up</h1>
                <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-1">
                        <div className="flex flex-col gap-y-0.5">
                            <label htmlFor="username" className="text-[12px] text-zinc-800">Username</label>
                            <input type="text" id="username" value={username} spellCheck="false" autoComplete="off" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-y-0.5">
                            <label htmlFor="password" className="text-[12px] text-zinc-800">Password</label>
                            <input type="text" id="password" value={password} spellCheck="false" autoComplete="off" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <button className="bg-zinc-900 rounded-[4px] py-1 text-white transition-all hover:bg-zinc-800/90" onClick={handleSignup}>Sign Up</button>
                </div>
            </div>
        </div>
    )
}
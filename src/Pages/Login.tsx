import { useState } from "react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email,
                password,
            });
            console.log(res.data, 'res');

            localStorage.setItem("token", res.data.token);
            window.location.href = "/home";
        } catch (err: any) {
            alert(err?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* LEFT IMAGE SECTION */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 items-center justify-center p-10">
                <div className="text-center">
                    <img
                        src="https://illustrations.popsy.co/blue/task-list.svg"
                        alt="Task Manager"
                        className="w-[80%] mx-auto"
                    />
                    <h2 className="text-2xl font-bold text-blue-700 mt-6">
                        Organize Your Tasks
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Stay productive with a simple and powerful task manager
                    </p>
                </div>
            </div>

            {/* RIGHT FORM SECTION */}
            <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-blue-700">
                            Task Manager
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Welcome back! Login to continue
                        </p>
                    </div>

                    {/* EMAIL */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full mt-1 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-600">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="w-full mt-1 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={login}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
                    >
                        Login
                    </button>

                    {/* FOOTER */}
                    <p className="text-center text-xs text-gray-500 mt-6">
                        Organize tasks • Track progress • Stay productive
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
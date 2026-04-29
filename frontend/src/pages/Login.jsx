import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../redux/authSlice";
import logoImg from '../assets/Paisafy_logo.png';

const Login = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { isLoggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");

        if (!username || username.trim() === "") {
            setMessage("Please enter your username.");
            return;
        }

        if (!password || password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        dispatch(login({ username, password }))
            .unwrap()
            .then(() => {
                const showOnboarding = location.state?.showOnboarding;
                if (showOnboarding) {
                    navigate("/onboarding");
                } else {
                    navigate("/dashboard");
                }
                window.location.reload();
            })
            .catch((error) => {
                setLoading(false);
                setMessage(error);
            });
    };

    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-primary-200">
            {/* Left Side - Visual Presentation */}
            <div className="relative hidden w-full lg:w-1/2 flex-col justify-between overflow-hidden bg-[#071324] p-12 text-white lg:flex">
                
                <div className="relative z-10 flex items-center gap-3">
                    <img src="/logo.png" alt="Paisafy Logo" className="h-16 w-auto rounded bg-white p-2" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
                        Master your money,<br/>shape your future.
                    </h1>
                    <p className="mb-10 text-lg leading-relaxed text-primary-100 opacity-90">
                        Manage your personal finances with ease. Track expenses, set budgets, and achieve your financial goals with Paisafy's intelligent platform.
                    </p>
                    
                    <div className="flex justify-center mix-blend-screen">
                        <img 
                            src={logoImg} 
                            alt="Paisafy Dashboard Preview" 
                            className="relative z-10 h-auto w-full scale-110"
                        />
                    </div>
                </div>

                <div className="relative z-10 text-sm font-medium text-primary-200/60">
                    &copy; {new Date().getFullYear()} Paisafy Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full items-center justify-center p-8 sm:p-12 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-10 flex justify-center lg:hidden">
                        <img src="/logo.png" alt="Paisafy Logo" className="h-12 w-auto" />
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Welcome back</h2>
                        <p className="mt-3 text-base text-gray-500">Please enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {message && (
                            <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-red-800">Login Failed</h3>
                                        <p className="text-xs font-medium text-red-600">{message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-bold text-gray-700" htmlFor="password">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-sm font-bold text-primary-600 transition-colors hover:text-primary-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-primary-600 px-4 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-primary-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                            disabled={loading}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : "Sign In"}
                            </span>
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-bold text-primary-600 transition-colors hover:text-primary-500 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

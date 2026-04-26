import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../redux/authSlice";

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
        setLoading(true);
        setMessage("");

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
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Visual */}
            <div className="hidden w-1/2 flex-col justify-center bg-primary-600 px-12 text-white lg:flex">
                <div className="mb-6 flex justify-center lg:justify-start">
                    <img src="/logo.png" alt="Paisafy Logo" className="h-20 w-auto" />
                </div>
                <h1 className="mb-4 text-4xl font-bold">Welcome Back</h1>
                <p className="mb-8 text-lg text-primary-100">
                    Manage your personal finances with ease. Track expenses, set budgets, and achieve your financial goals with Paisafy.
                </p>
                <div className="h-64 rounded-xl bg-primary-700/50 backdrop-blur-sm p-8 shadow-2xl">
                    {/* Abstract Content Placeholder */}
                    <div className="h-full w-full rounded bg-primary-500/30"></div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                    <p className="mt-2 text-gray-600">Please enter your details to access your account.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {message && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Login Failed
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

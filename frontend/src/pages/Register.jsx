import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../redux/authSlice";

const Register = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();

    const handleRegister = (e) => {
        e.preventDefault();
        setSuccessful(false);
        setLoading(true);
        setMessage("");

        dispatch(register({ username, email, password }))
            .unwrap()
            .then(() => {
                setSuccessful(true);
                setLoading(false);
                navigate("/login", { state: { showOnboarding: true } });
            })
            .catch((error) => {
                setSuccessful(false);
                setLoading(false);
                setMessage(error);
            });
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Visual */}
            <div className="hidden w-1/2 flex-col justify-center bg-primary-600 px-12 text-white lg:flex">
                <div className="mb-6 flex justify-center">
                    <img src="/logo.png" alt="Paisafy Logo" className="h-20 w-auto" />
                </div>
                <h1 className="mb-4 text-4xl font-bold">Join Paisafy</h1>
                <p className="mb-8 text-lg text-primary-100">
                    Start your journey towards financial freedom today. Create an account to get started.
                </p>
                <div className="h-64 rounded-xl bg-primary-700/50 backdrop-blur-sm p-8 shadow-2xl">
                    {/* Abstract Content Placeholder */}
                    <div className="h-full w-full rounded bg-primary-500/30"></div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-gray-600">Enter your details to sign up.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {!successful && (
                        <>
                            {message && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Registration Failed
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
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-70"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Sign Up"}
                            </button>
                        </>
                    )}
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

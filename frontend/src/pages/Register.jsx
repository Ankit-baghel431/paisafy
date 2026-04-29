import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { register, sendOtp } from "../redux/authSlice";
import logoImg from '../assets/Paisafy_logo.png';

const Register = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);

    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    let navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();

    const handleSendOtp = (e) => {
        e.preventDefault();
        setSuccessful(false);
        setMessage("");

        // Basic Frontend Validation Rules
        if (username.length < 3 || username.length > 20) {
            setMessage("Username must be between 3 and 20 characters.");
            return;
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setMessage("Username can only contain letters, numbers, and underscores.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        dispatch(sendOtp({ username, email }))
            .unwrap()
            .then(() => {
                setLoading(false);
                setStep(2);
                setMessage("");
            })
            .catch((error) => {
                setLoading(false);
                setMessage(error);
            });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setSuccessful(false);
        setMessage("");

        if (!otp || otp.length !== 6) {
            setMessage("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);

        dispatch(register({ username, email, password, otp }))
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
        <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-primary-200">
            {/* Left Side - Visual Presentation */}
            <div className="relative hidden w-full lg:w-1/2 flex-col justify-between overflow-hidden bg-[#071324] p-12 text-white lg:flex">
                
                <div className="relative z-10 flex items-center gap-3">
                    <img src="/logo.png" alt="Paisafy Logo" className="h-16 w-auto rounded bg-white p-2" />
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
                        Start your journey<br/>to financial freedom.
                    </h1>
                    <p className="mb-10 text-lg leading-relaxed text-primary-100 opacity-90">
                        Join thousands of smart savers who use Paisafy to track spending, hit savings goals, and take total control of their money.
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
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Create Account</h2>
                        <p className="mt-3 text-base text-gray-500">Enter your details to sign up and get started.</p>
                    </div>

                    <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
                        {!successful && (
                            <>
                                {message && (
                                    <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-red-800">Registration Failed</h3>
                                                <p className="text-xs font-medium text-red-600">{message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 1 ? (
                                    <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="username">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                            placeholder="Choose a username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="rounded-xl bg-primary-50 p-4 border border-primary-100 mb-6">
                                            <p className="text-sm text-primary-800">
                                                We've sent a 6-digit verification code to <span className="font-bold">{email}</span>. 
                                                Please check your console logs to simulate receiving the email.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="otp">
                                                Verification Code
                                            </label>
                                            <input
                                                type="text"
                                                id="otp"
                                                maxLength="6"
                                                className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-center text-2xl tracking-widest text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                                        >
                                            &larr; Back to edit details
                                        </button>
                                    </div>
                                )}
                                

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
                                                {step === 1 ? "Sending OTP..." : "Verifying..."}
                                            </>
                                        ) : (
                                            step === 1 ? "Continue" : "Verify & Create Account"
                                        )}
                                    </span>
                                </button>
                            </>
                        )}
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-bold text-primary-600 transition-colors hover:text-primary-500 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

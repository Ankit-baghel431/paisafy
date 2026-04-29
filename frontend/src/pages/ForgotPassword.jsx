import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from '../assets/Paisafy_logo.png';

const API_URL = "http://localhost:8080/api/auth/";

const ForgotPassword = () => {
    let navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        if (!email || email.trim() === "") {
            setMessage("Please enter your email address.");
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(API_URL + "forgot-password-otp", { email });
            setMessage(response.data.message);
            setIsError(false);
            setStep(2);
        } catch (error) {
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        if (!otp || otp.length !== 6) {
            setMessage("Please enter the 6-digit OTP.");
            setIsError(true);
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(API_URL + "reset-password", { 
                email, 
                otp, 
                newPassword 
            });
            setMessage(response.data.message);
            setIsError(false);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
            setIsError(true);
        } finally {
            setLoading(false);
        }
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
                        Reset your password<br/>securely.
                    </h1>
                    <p className="mb-10 text-lg leading-relaxed text-primary-100 opacity-90">
                        Regain access to your Paisafy account quickly. Enter your email and verify it with the code we send to set a new password.
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
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Forgot Password</h2>
                        <p className="mt-3 text-base text-gray-500">
                            {step === 1 ? "Enter your email to receive a reset code." : "Enter your OTP and a new password."}
                        </p>
                    </div>

                    {message && (
                        <div className={`mb-6 animate-in fade-in slide-in-from-top-2 rounded-xl border p-4 shadow-sm ${isError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {isError ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className={`text-sm font-bold ${isError ? 'text-red-800' : 'text-green-800'}`}>
                                        {isError ? 'Error' : 'Success'}
                                    </h3>
                                    <p className={`text-xs font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="space-y-5">
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
                                            Sending...
                                        </>
                                    ) : "Send OTP"}
                                </span>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="otp">
                                        6-Digit OTP
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        maxLength="6"
                                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="newPassword">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                            Resetting...
                                        </>
                                    ) : "Reset Password"}
                                </span>
                            </button>
                        </form>
                    )}

                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-gray-500">
                            Remembered your password?{" "}
                            <Link to="/login" className="font-bold text-primary-600 transition-colors hover:text-primary-500 hover:underline">
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

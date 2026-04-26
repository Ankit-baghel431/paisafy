import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaShieldAlt, FaRobot, FaMobileAlt } from "react-icons/fa";

const LandingPage = () => {
    return (
        <div className="bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="Paisafy Logo" className="h-14 w-auto" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                Login
                            </Link>
                            <Link to="/register" className="rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500 transition-all">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                        Master Your Money with <br />
                        <span className="text-primary-600">Smart Insights</span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        Track expenses, set budgets, and achieve your financial goals with AI-powered analytics.
                        The all-in-one platform for your personal finance journey.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/register" className="rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-all transform hover:-translate-y-1">
                            Start for Free
                        </Link>
                        <a href="#features" className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition-all">
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[40rem] bg-gradient-to-tr from-primary-100 to-indigo-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Features</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need to grow</p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: <FaChartLine />, title: "Detailed Analytics", desc: "Visualize your spending patterns with interactive charts." },
                            { icon: <FaRobot />, title: "AI Advisor", desc: "Get personalized financial advice powered by advanced AI." },
                            { icon: <FaShieldAlt />, title: "Secure & Private", desc: "Bank-grade security to keep your financial data safe." },
                            { icon: <FaMobileAlt />, title: "Multi-Platform", desc: "Access your dashboard from simple, responsive interfaces." }
                        ].map((feature, idx) => (
                            <div key={idx} className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
                                <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center text-xl text-primary-600 mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                                <p className="mt-2 text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-4 text-center text-gray-400">
                    <p>&copy; 2026 Paisafy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

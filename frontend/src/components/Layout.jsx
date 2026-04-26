import React from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const location = useLocation();

    const getPageTitle = (pathname) => {
        const path = pathname.split("/")[1]; // gets 'dashboard' from '/dashboard'
        if (!path) return "Overview";
        return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " "); // e.g., 'Budget Planner'
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-20 items-center justify-between bg-white px-8 shadow-sm border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {getPageTitle(location.pathname)}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">
                            {currentUser.username ? currentUser.username[0].toUpperCase() : "U"}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-gray-700">{currentUser.username}</p>
                            <p className="text-xs text-gray-500">{currentUser.email || "user@example.com"}</p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

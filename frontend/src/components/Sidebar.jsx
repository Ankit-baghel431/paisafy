import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaWallet, FaChartLine, FaUser, FaSignOutAlt, FaPiggyBank, FaBullseye, FaFileAlt, FaRobot } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Sidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        window.location.reload();
    };

    const navItems = [
        { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
        { path: "/transactions", icon: <FaWallet />, label: "Transactions" },
        { path: "/budget", icon: <FaPiggyBank />, label: "Budget Planner" },
        { path: "/goals", icon: <FaBullseye />, label: "Goals" },
        { path: "/analytics", icon: <FaChartLine />, label: "Analytics" },
        { path: "/reports", icon: <FaFileAlt />, label: "Reports" },
        { path: "/advisor", icon: <FaRobot />, label: "AI Advisor" },
        { path: "/profile", icon: <FaUser />, label: "Profile" },
    ];

    return (
        <div className="flex h-screen w-64 flex-col bg-white shadow-lg border-r border-gray-100">
            <div className="flex h-20 items-center justify-center border-b border-gray-100">
                <img src="/logo.png" alt="Paisafy Logo" className="h-16 w-auto" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 py-6 px-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                ? "bg-primary-50 text-primary-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-gray-100 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                    <span className="text-lg"><FaSignOutAlt /></span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

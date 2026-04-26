import React, { useState } from "react";
import { useSelector } from "react-redux";
import StatCard from "../components/StatCard";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

const Dashboard = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    // Mock Data - Replace with API calls later
    // Mock Data - Replace with API calls later
    const stats = [
        { title: "Total Balance", amount: "₹0.00", icon: <FaWallet />, color: "bg-blue-500", trend: 0 },
        { title: "Total Income", amount: "₹0.00", icon: <FaArrowUp />, color: "bg-green-500", trend: 0 },
        { title: "Total Expenses", amount: "₹0.00", icon: <FaArrowDown />, color: "bg-red-500", trend: 0 },
    ];

    const transactions = [];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome back, here's what's happening with your finance today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Description</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Amount</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{tx.desc}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <td className={`px-6 py-4 font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                                        {tx.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import StatCard from "../components/StatCard";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/transactions?size=100", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTransactions(res.data.content);
        } catch (error) {
            console.error("Error fetching transactions", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Summaries
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    const stats = [
        { title: "Total Balance", amount: `₹${netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: <FaWallet />, color: "bg-blue-500", trend: null },
        { title: "Total Income", amount: `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: <FaArrowUp />, color: "bg-green-500", trend: null },
        { title: "Total Expenses", amount: `₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: <FaArrowDown />, color: "bg-red-500", trend: null },
    ];

    const getCategoryStyles = (category) => {
        const styles = {
            "Food": { color: "bg-orange-100 text-orange-600" },
            "Transport": { color: "bg-blue-100 text-blue-600" },
            "Entertainment": { color: "bg-purple-100 text-purple-600" },
            "Utilities": { color: "bg-yellow-100 text-yellow-600" },
            "Health": { color: "bg-red-100 text-red-600" },
            "Income": { color: "bg-green-100 text-green-600" },
            "Other": { color: "bg-gray-100 text-gray-600" }
        };
        if (category?.includes('Food')) return styles["Food"];
        if (category?.includes('Transport')) return styles["Transport"];
        if (category?.includes('Entertainment')) return styles["Entertainment"];
        if (category?.includes('Utilities')) return styles["Utilities"];
        if (category?.includes('Health')) return styles["Health"];
        if (category?.includes('Income')) return styles["Income"];
        return styles["Other"];
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="mt-2 text-gray-500">Welcome back, {user?.username}! Here's what's happening with your finances today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                    <Link to="/transactions" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : recentTransactions.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No transactions recorded yet.</td></tr>
                            ) : (
                                recentTransactions.map((tx) => {
                                    const { color } = getCategoryStyles(tx.category);
                                    const isIncome = tx.type === 'INCOME';
                                    
                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
                                                    {tx.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-500">{formatDate(tx.date)}</td>
                                            <td className={`px-6 py-4 font-bold text-right tracking-tight ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                                                {isIncome ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

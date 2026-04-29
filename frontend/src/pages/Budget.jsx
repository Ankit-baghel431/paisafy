import React, { useState, useEffect } from "react";
import { FaPlus, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const Budget = () => {
    const { user } = useSelector((state) => state.auth);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Modal state
    const [category, setCategory] = useState("Food");
    const [limitAmount, setLimitAmount] = useState("");
    const [color, setColor] = useState("bg-blue-500");

    const categories = ["Food", "Transport", "Entertainment", "Utilities", "Health", "Other"];
    const colors = [
        { name: "Blue", value: "bg-blue-500" },
        { name: "Orange", value: "bg-orange-500" },
        { name: "Purple", value: "bg-purple-500" },
        { name: "Green", value: "bg-green-500" },
        { name: "Red", value: "bg-red-500" }
    ];

    useEffect(() => {
        if (user?.token) {
            fetchBudgets();
        }
    }, [user]);

    const fetchBudgets = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/budgets", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBudgets(res.data);
        } catch (error) {
            console.error("Error fetching budgets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBudget = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/budgets", {
                category,
                limitAmount: parseFloat(limitAmount),
                color
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBudgets([...budgets, res.data]);
            setIsModalOpen(false);
            setLimitAmount("");
        } catch (error) {
            console.error("Error creating budget", error);
        }
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Budget Planner</h1>
                    <p className="mt-2 text-gray-500">Set limits and let Paisafy automatically track your spending per category.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
                >
                    <FaPlus /> Set New Budget
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading budgets...</div>
            ) : budgets.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500 mb-4">You haven't set any budgets yet.</p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-primary-600 font-semibold hover:underline"
                    >
                        Create your first budget
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {budgets.map((budget) => {
                        const percentage = budget.limitAmount > 0 ? Math.min((budget.spentAmount / budget.limitAmount) * 100, 100) : 0;
                        const isNearingLimit = percentage >= 85;
                        const isOverLimit = percentage >= 100;

                        return (
                            <div key={budget.id} className={`rounded-2xl bg-white p-6 shadow-sm border ${isOverLimit ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl ${budget.color} bg-opacity-10`}>
                                            <FaMoneyBillWave className={`text-xl ${budget.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">{budget.category}</h3>
                                    </div>
                                    <span className={`text-sm font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                                        {percentage.toFixed(0)}% Used
                                    </span>
                                </div>

                                <div className="mb-2 flex justify-between text-sm">
                                    <span className={`font-semibold ${isOverLimit ? 'text-red-600' : 'text-gray-700'}`}>
                                        ₹{budget.spentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-gray-500">of ₹{budget.limitAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${isOverLimit ? 'bg-red-500' : budget.color}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>

                                {isNearingLimit && !isOverLimit && (
                                    <p className="mt-3 text-xs font-semibold text-orange-500 flex items-center gap-1">
                                        ⚠️ You are nearing your limit!
                                    </p>
                                )}
                                {isOverLimit && (
                                    <p className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1">
                                        🚨 Budget Exceeded!
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Budget Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Set New Budget</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleCreateBudget} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select 
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit (₹)</label>
                                <input 
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="e.g. 5000"
                                    value={limitAmount}
                                    onChange={(e) => setLimitAmount(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                                <div className="flex gap-3">
                                    {colors.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            className={`w-8 h-8 rounded-full ${c.value} ${color === c.value ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-80 hover:opacity-100'}`}
                                            onClick={() => setColor(c.value)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-500 transition-colors mt-2"
                            >
                                Save Budget
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budget;

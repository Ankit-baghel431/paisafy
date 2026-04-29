import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaTrophy, FaPlane, FaHome, FaCar, FaLaptop, FaGraduationCap } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const Goals = () => {
    const { user } = useSelector((state) => state.auth);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    // Form state - Create Goal
    const [title, setTitle] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [initialAmount, setInitialAmount] = useState("");
    const [color, setColor] = useState("bg-indigo-500");
    const [icon, setIcon] = useState("FaTrophy");

    // Form state - Deposit
    const [depositAmount, setDepositAmount] = useState("");

    const iconsList = [
        { name: "Trophy", value: "FaTrophy", component: <FaTrophy /> },
        { name: "Plane", value: "FaPlane", component: <FaPlane /> },
        { name: "Home", value: "FaHome", component: <FaHome /> },
        { name: "Car", value: "FaCar", component: <FaCar /> },
        { name: "Laptop", value: "FaLaptop", component: <FaLaptop /> },
        { name: "Education", value: "FaGraduationCap", component: <FaGraduationCap /> },
    ];

    const colors = [
        { name: "Indigo", value: "bg-indigo-500" },
        { name: "Pink", value: "bg-pink-500" },
        { name: "Emerald", value: "bg-emerald-500" },
        { name: "Amber", value: "bg-amber-500" },
        { name: "Cyan", value: "bg-cyan-500" }
    ];

    const renderIcon = (iconName) => {
        const found = iconsList.find(i => i.value === iconName);
        return found ? found.component : <FaTrophy />;
    };

    useEffect(() => {
        if (user?.token) {
            fetchGoals();
        }
    }, [user]);

    const fetchGoals = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/goals", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setGoals(res.data);
        } catch (error) {
            console.error("Error fetching goals", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/goals", {
                title,
                targetAmount: parseFloat(targetAmount),
                savedAmount: initialAmount ? parseFloat(initialAmount) : 0,
                color,
                icon
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setGoals([...goals, res.data]);
            setIsCreateModalOpen(false);
            setTitle("");
            setTargetAmount("");
            setInitialAmount("");
        } catch (error) {
            console.error("Error creating goal", error);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!selectedGoal || !depositAmount) return;
        
        try {
            const res = await axios.put(`http://localhost:8080/api/goals/${selectedGoal.id}/fund`, {
                amount: parseFloat(depositAmount)
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            
            setGoals(goals.map(g => g.id === selectedGoal.id ? res.data : g));
            setIsDepositModalOpen(false);
            setDepositAmount("");
            setSelectedGoal(null);
        } catch (error) {
            console.error("Error funding goal", error);
        }
    };

    const openDepositModal = (goal) => {
        setSelectedGoal(goal);
        setDepositAmount("");
        setIsDepositModalOpen(true);
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Goals</h1>
                    <p className="mt-2 text-gray-500">Set savings targets and track your progress towards your dreams.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
                >
                    <FaPlus /> Add Goal
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading goals...</div>
            ) : goals.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500 mb-4">You haven't set any financial goals yet.</p>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-primary-600 font-semibold hover:underline"
                    >
                        Create your first goal
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => {
                        const percentage = goal.targetAmount > 0 ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) : 0;
                        const isComplete = percentage >= 100;

                        return (
                            <div key={goal.id} className={`rounded-2xl bg-white p-6 shadow-sm border ${isComplete ? 'border-green-200 bg-green-50/20' : 'border-gray-100'} flex flex-col`}>
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`p-4 rounded-2xl ${goal.color} text-white shadow-md`}>
                                        <span className="text-2xl">{renderIcon(goal.icon)}</span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {isComplete ? 'COMPLETED' : `${percentage.toFixed(0)}%`}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h3>
                                <p className="text-gray-500 text-sm mb-6">Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</p>

                                <div className="mt-auto">
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="font-semibold text-gray-900 text-lg">
                                            ₹{goal.savedAmount.toLocaleString('en-IN')}
                                        </span>
                                        {!isComplete && (
                                            <button 
                                                onClick={() => openDepositModal(goal)}
                                                className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                                            >
                                                + DEPOSIT
                                            </button>
                                        )}
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : goal.color}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Goal Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Create New Goal</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="e.g. New Car"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target (₹)</label>
                                    <input 
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        placeholder="500000"
                                        value={targetAmount}
                                        onChange={(e) => setTargetAmount(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Saved (₹)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        placeholder="0"
                                        value={initialAmount}
                                        onChange={(e) => setInitialAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                <div className="flex gap-3 flex-wrap">
                                    {iconsList.map(i => (
                                        <button
                                            key={i.value}
                                            type="button"
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${icon === i.value ? 'bg-gray-100 text-gray-900 border-2 border-gray-300' : 'text-gray-400 hover:bg-gray-50 border border-gray-100'}`}
                                            onClick={() => setIcon(i.value)}
                                            title={i.name}
                                        >
                                            {i.component}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
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
                                className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-500 transition-colors mt-4"
                            >
                                Save Goal
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Deposit Modal */}
            {isDepositModalOpen && selectedGoal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Deposit Funds</h2>
                            <button onClick={() => setIsDepositModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleDeposit} className="p-6">
                            <p className="text-sm text-gray-500 mb-4">Adding funds to <strong>{selectedGoal.title}</strong>.</p>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Deposit (₹)</label>
                                <input 
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-bold text-center focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="0"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-500 transition-colors mt-6"
                            >
                                Confirm Deposit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;

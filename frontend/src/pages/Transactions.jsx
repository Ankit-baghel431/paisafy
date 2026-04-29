import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaSearch, FaTrash, FaUtensils, FaCar, FaFilm, FaBolt, FaHeartbeat, FaMoneyBillWave, FaEllipsisH, FaWallet, FaArrowUp, FaArrowDown, FaReceipt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const Transactions = () => {
    const { user } = useSelector((state) => state.auth);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [newTx, setNewTx] = useState({ description: "", amount: "", type: "EXPENSE", category: "Food", date: new Date().toISOString().split('T')[0] });

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

    const openModal = (type) => {
        setNewTx((prev) => ({ ...prev, type, category: type === 'INCOME' ? 'Income' : 'Food' }));
        setModalOpen(true);
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newTx,
                amount: parseFloat(newTx.amount),
            };
            const res = await axios.post("http://localhost:8080/api/transactions", payload, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTransactions([res.data, ...transactions]);
            setModalOpen(false);
            setNewTx({ description: "", amount: "", type: "EXPENSE", category: "Food", date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            alert("Failed to add transaction");
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/transactions/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTransactions(transactions.filter(tx => tx.id !== id));
        } catch (error) {
            alert("Failed to delete transaction");
            console.error(error);
        }
    };

    // Calculate Summaries
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    // Helper for Category styling
    const getCategoryStyles = (category) => {
        const styles = {
            "Food": { icon: <FaUtensils />, color: "bg-orange-100 text-orange-600" },
            "Transport": { icon: <FaCar />, color: "bg-blue-100 text-blue-600" },
            "Entertainment": { icon: <FaFilm />, color: "bg-purple-100 text-purple-600" },
            "Utilities": { icon: <FaBolt />, color: "bg-yellow-100 text-yellow-600" },
            "Health": { icon: <FaHeartbeat />, color: "bg-red-100 text-red-600" },
            "Income": { icon: <FaMoneyBillWave />, color: "bg-green-100 text-green-600" },
            "Other": { icon: <FaEllipsisH />, color: "bg-gray-100 text-gray-600" }
        };
        // Soft match for categories
        if (category.includes('Food')) return styles["Food"];
        if (category.includes('Transport')) return styles["Transport"];
        if (category.includes('Entertainment')) return styles["Entertainment"];
        if (category.includes('Utilities')) return styles["Utilities"];
        if (category.includes('Health')) return styles["Health"];
        if (category.includes('Income')) return styles["Income"];
        
        return styles["Other"];
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transactions</h1>
                    <p className="mt-2 text-gray-500">Track and manage your daily expenses and income.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => openModal('INCOME')}
                        className="flex items-center gap-2 rounded-xl bg-green-500/10 px-5 py-2.5 font-semibold text-green-700 hover:bg-green-500/20 transition-all border border-green-500/20"
                    >
                        <FaArrowUp className="text-sm" /> Income
                    </button>
                    <button
                        onClick={() => openModal('EXPENSE')}
                        className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-primary-500/30 hover:bg-primary-500 hover:shadow-lg transition-all"
                    >
                        <FaPlus className="text-sm" /> Add Expense
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                            <FaWallet className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Net Balance</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <FaArrowUp className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Income</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            <FaArrowDown className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="mb-6 flex items-center gap-4">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                    <FaSearch className="text-gray-400" />
                    <input type="text" placeholder="Search transactions..." className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" />
                </div>
                <select className="rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100 outline-none text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
                    <option>All Categories</option>
                    <option>Food & Dining</option>
                    <option>Transportation</option>
                    <option>Entertainment</option>
                </select>
            </div>

            {/* Transactions List */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Transaction Details</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mb-4"></div>
                                            <p className="text-gray-500">Loading transactions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                                <FaReceipt className="text-4xl" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">No Transactions Yet</h3>
                                            <p className="mt-1 text-gray-500 max-w-sm">You haven't recorded any income or expenses yet. Add a transaction to get started.</p>
                                            <button 
                                                onClick={() => openModal('EXPENSE')}
                                                className="mt-6 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
                                            >
                                                Add First Transaction
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => {
                                    const { icon, color } = getCategoryStyles(tx.category);
                                    const isIncome = tx.type === 'INCOME';
                                    
                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                                        {icon}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{tx.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
                                                    {tx.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-medium">
                                                {formatDate(tx.date)}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold tracking-tight ${isIncome ? 'text-green-600' : 'text-gray-900'}`}>
                                                {isIncome ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleDelete(tx.id)} 
                                                    className="rounded-lg p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all focus:opacity-100"
                                                    title="Delete Transaction"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Redesigned Add Transaction Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity p-4">
                    <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Transaction</h2>
                        
                        {/* Segmented Control */}
                        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setNewTx({ ...newTx, type: 'EXPENSE', category: 'Food & Dining' })}
                                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${newTx.type === 'EXPENSE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setNewTx({ ...newTx, type: 'INCOME', category: 'Income' })}
                                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${newTx.type === 'INCOME' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Income
                            </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Groceries, Salary..."
                                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    value={newTx.description}
                                    onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">₹</div>
                                        <input
                                            type="number"
                                            required
                                            min="0.01"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="block w-full rounded-xl border border-gray-200 pl-8 pr-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                            value={newTx.amount}
                                            onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white appearance-none"
                                        value={newTx.category}
                                        onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                                    >
                                        {newTx.type === 'EXPENSE' ? (
                                            <>
                                                <option value="Food & Dining">Food & Dining</option>
                                                <option value="Transportation">Transportation</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Utilities">Bills & Utilities</option>
                                                <option value="Health">Healthcare</option>
                                                <option value="Other">Other Expense</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Income">Salary / Income</option>
                                                <option value="Other">Other Income</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                    value={newTx.date}
                                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                                />
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-500/30 hover:bg-primary-500 hover:shadow-lg transition-all"
                                >
                                    Save Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;

import React, { useState } from "react";
import { FaPlus, FaMinus, FaSearch } from "react-icons/fa";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [newTx, setNewTx] = useState({ desc: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().split('T')[0] });

    const openModal = (type) => {
        setNewTx((prev) => ({ ...prev, type, category: type === 'income' ? 'Income' : 'Food' }));
        setModalOpen(true);
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        const tx = {
            id: transactions.length + 1,
            ...newTx,
            amount: parseFloat(newTx.amount),
        };
        setTransactions([tx, ...transactions]);
        setModalOpen(false);
        setNewTx({ desc: "", amount: "", type: "expense", category: "Food", date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="mt-2 text-gray-600">Manage your income and expenses.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => openModal('income')}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
                    >
                        <FaPlus /> Add Income
                    </button>
                    <button
                        onClick={() => openModal('expense')}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
                    >
                        <FaMinus /> Add Expense
                    </button>
                </div>
            </div>

            {/* Filters & Search - Placeholder for now */}
            <div className="mt-6 flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-gray-500">
                    <FaSearch />
                    <input type="text" placeholder="Search transactions..." className="w-full bg-transparent outline-none" />
                </div>
            </div>

            {/* Transactions List */}
            <div className="mt-6 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Description</th>
                            <th className="px-6 py-3 font-medium">Category</th>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
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
                                <td className={`px-6 py-4 font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Transaction Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900">Add New Transaction</h2>
                        <form onSubmit={handleAddTransaction} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                    value={newTx.desc}
                                    onChange={(e) => setNewTx({ ...newTx, desc: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        value={newTx.amount}
                                        onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        value={newTx.type}
                                        onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                                    >
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                    value={newTx.category}
                                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                                >
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Health">Health</option>
                                    <option value="Income">Income</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                    value={newTx.date}
                                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
                                >
                                    Add Transaction
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

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useSelector } from "react-redux";
import axios from "axios";

const Analytics = () => {
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
            const res = await axios.get("http://localhost:8080/api/transactions?size=500", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTransactions(res.data.content);
        } catch (error) {
            console.error("Error fetching transactions", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Dynamic Aggregations ---

    const categoryColors = {
        "Food": "#f97316",        // orange-500
        "Transport": "#3b82f6",   // blue-500
        "Entertainment": "#a855f7",// purple-500
        "Utilities": "#eab308",   // yellow-500
        "Health": "#ef4444",      // red-500
        "Other": "#9ca3af"        // gray-400
    };

    // 1. Expense Breakdown by Category
    const expenseData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'EXPENSE');
        const grouped = expenses.reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
            return acc;
        }, {});

        return Object.keys(grouped).map(key => ({
            name: key,
            value: grouped[key],
            color: categoryColors[key] || categoryColors["Other"]
        }));
    }, [transactions]);

    // 2. Monthly Trends (Income vs Expense)
    const monthlyData = useMemo(() => {
        const grouped = transactions.reduce((acc, tx) => {
            // Get short month name e.g. "Jan", "Feb"
            const month = new Date(tx.date).toLocaleString('default', { month: 'short' });
            if (!acc[month]) {
                acc[month] = { name: month, income: 0, expense: 0, order: new Date(tx.date).getMonth() };
            }
            if (tx.type === 'INCOME') {
                acc[month].income += tx.amount;
            } else {
                acc[month].expense += tx.amount;
            }
            return acc;
        }, {});

        // Sort by month order
        return Object.values(grouped).sort((a, b) => a.order - b.order);
    }, [transactions]);

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                <p className="mt-2 text-gray-500">Visual insights into your financial health.</p>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading your data...</div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500">You haven't added any transactions yet. Add some data to see insights!</p>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Expense Breakdown */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-6 text-lg font-bold text-gray-900">Expense Breakdown</h3>
                        <div className="h-80 w-full">
                            {expenseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expenseData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {expenseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No expenses to display</div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="mb-6 text-lg font-bold text-gray-900">Monthly Trends</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyData}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tickFormatter={(value) => value >= 1000 ? `₹${value / 1000}k` : `₹${value}`} 
                                        tick={{fill: '#6b7280', fontSize: 12}}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{fill: '#f9fafb'}}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
                                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" maxBarSize={40} />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Analytics;

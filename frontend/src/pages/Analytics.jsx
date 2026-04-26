import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const Analytics = () => {
    // Mock Data
    const expenseData = [];

    const monthlyData = [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="mt-2 text-gray-600">Visual insights into your financial health.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Expense Breakdown */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Trends */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Monthly Trends</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={monthlyData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                                <Legend />
                                <Bar dataKey="income" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Income" />
                                <Bar dataKey="expense" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Insights Card */}
            <div className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 p-8 text-white shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                        <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">AI Insight</h3>
                        <p className="mt-2 text-primary-100">
                            Start adding transactions to get personalized insights about your spending habits.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;

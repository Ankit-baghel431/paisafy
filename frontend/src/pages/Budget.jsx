import React, { useState } from "react";
import { FaPlus, FaMoneyBillWave } from "react-icons/fa";

const Budget = () => {
    const [budgets, setBudgets] = useState([]);

    return (
        <div>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Budget Planner</h1>
                    <p className="mt-2 text-gray-600">Set limits and track your spending per category.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary-500">
                    <FaPlus /> Set New Budget
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {budgets.map((budget) => {
                    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                    return (
                        <div key={budget.id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-lg ${budget.color} bg-opacity-10`}>
                                        <FaMoneyBillWave className={`text-xl ${budget.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">{budget.category}</h3>
                                </div>
                                <span className="text-sm font-medium text-gray-500">
                                    {percentage.toFixed(0)}% Used
                                </span>
                            </div>

                            <div className="mb-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-700">₹{budget.spent.toLocaleString('en-IN')}</span>
                                <span className="text-gray-500">of ₹{budget.limit.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${budget.color} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>

                            {percentage >= 90 && (
                                <p className="mt-3 text-xs font-medium text-red-500">
                                    ⚠️ You are nearing your budget limit!
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Budget;

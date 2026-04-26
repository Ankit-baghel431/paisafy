import React from "react";
import { FaPlus, FaTrophy, FaPlane, FaHome, FaCar } from "react-icons/fa";

const Goals = () => {
    const goals = [];

    return (
        <div>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
                    <p className="mt-2 text-gray-600">Track your progress towards your dreams.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary-500">
                    <FaPlus /> Add Goal
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                    const percentage = Math.min((goal.saved / goal.target) * 100, 100);
                    return (
                        <div key={goal.id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-4 rounded-xl ${goal.color} text-white shadow-md`}>
                                    <span className="text-2xl">{goal.icon}</span>
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.title}</h3>
                            <p className="text-gray-500 text-sm mb-4">Target: ₹{goal.target.toLocaleString('en-IN')}</p>

                            <div className="mt-auto">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-primary-600">₹{goal.saved.toLocaleString('en-IN')} Saved</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${goal.color}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;

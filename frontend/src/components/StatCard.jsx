import React from "react";

const StatCard = ({ title, amount, icon, color, trend }) => {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">{amount}</h3>
                </div>
                <div className={`rounded-full p-3 ${color}`}>
                    <span className="text-xl text-white">{icon}</span>
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="ml-2 text-gray-500">from last month</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;

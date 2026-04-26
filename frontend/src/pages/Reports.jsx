import React from "react";
import { FaDownload, FaFileAlt } from "react-icons/fa";

const Reports = () => {
    const reports = [];

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600 mb-8">Download and manage your financial statements.</p>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Available Statements</h3>
                    <button className="text-sm text-primary-600 font-medium hover:underline">Request Custom Report</button>
                </div>
                <ul className="divide-y divide-gray-100">
                    {reports.map((report) => (
                        <li key={report.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                    <FaFileAlt />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                                    <p className="text-xs text-gray-500">{report.date} • {report.size}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                                <FaDownload /> Download
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Reports;

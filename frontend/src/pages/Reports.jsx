import React, { useState, useEffect } from "react";
import { FaDownload, FaFileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const Reports = () => {
    const { user } = useSelector((state) => state.auth);
    const [transactions, setTransactions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (user?.token) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/transactions?size=1000", {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTransactions(res.data.content);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const generateCSV = () => {
        setIsGenerating(true);
        setTimeout(() => {
            if (transactions.length === 0) {
                alert("No transactions to export.");
                setIsGenerating(false);
                return;
            }

            // Define CSV headers
            const headers = ["ID", "Date", "Description", "Category", "Type", "Amount"];
            
            // Map transactions to CSV rows
            const rows = transactions.map(tx => [
                tx.id,
                new Date(tx.date).toLocaleDateString(),
                `"${tx.description}"`, // Quote strings to handle commas
                tx.category,
                tx.type,
                tx.amount
            ]);

            // Combine headers and rows
            const csvContent = [
                headers.join(","),
                ...rows.map(e => e.join(","))
            ].join("\n");

            // Create a Blob and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            
            // Name file dynamically with current date
            const dateStr = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `Paisafy_Full_Report_${dateStr}.csv`);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setIsGenerating(false);
        }, 500); // Simulate brief processing time for UX
    };

    const reports = [
        { id: 1, name: "All Transactions (CSV)", description: "Complete history of all your incomes and expenses.", type: "Full Export" }
    ];

    return (
        <div className="max-w-4xl pb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Reports</h1>
            <p className="text-gray-500 mb-8">Export your financial data to Excel or CSV format.</p>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-5 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Available Exports</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                    {reports.map((report) => (
                        <li key={report.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50/50 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                    <FaFileAlt className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-gray-900">{report.name}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{report.description}</p>
                                </div>
                            </div>
                            <button 
                                onClick={generateCSV}
                                disabled={isGenerating || transactions.length === 0}
                                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-bold shadow-sm transition-all
                                    ${isGenerating 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : transactions.length === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                            : 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow'}`}
                            >
                                <FaDownload /> {isGenerating ? 'Generating...' : transactions.length === 0 ? 'No Data' : 'Download CSV'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            
            {transactions.length > 0 && (
                <div className="mt-6 text-sm text-gray-500 bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100">
                    <strong>Note:</strong> The export will contain {transactions.length} transactions from your database.
                </div>
            )}
        </div>
    );
};

export default Reports;

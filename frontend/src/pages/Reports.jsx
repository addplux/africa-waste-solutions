import React from 'react';
import Header from '../components/Header';
import { FaDownload, FaFilter } from 'react-icons/fa';

const Reports = () => {
    // Mock Data
    const reportData = [
        { level: 4, supply: 1200, disposal: 300, net: 900 },
        { level: 6, supply: 850, disposal: 800, net: 50 },
        { level: 10, supply: 500, disposal: 0, net: 500 },
        { level: 12, supply: 2000, disposal: 1500, net: 500 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Header />

            <main className="max-w-5xl mx-auto mt-6 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-700 uppercase">Waste Management Reports</h2>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        <FaDownload /> Export PDF
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex gap-4 items-center border border-gray-200">
                    <FaFilter className="text-gray-400" />
                    <select className="p-2 border border-gray-300 rounded text-sm bg-gray-50">
                        <option>All Accounts</option>
                        <option>Business Only</option>
                        <option>Consumer Only</option>
                    </select>
                    <input type="month" className="p-2 border border-gray-300 rounded text-sm bg-gray-50" defaultValue="2024-12" />
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-purple-50 text-purple-900 border-b border-purple-100">
                            <tr>
                                <th className="p-4 font-bold text-sm uppercase">Level / Series</th>
                                <th className="p-4 font-bold text-sm uppercase text-blue-700">Total Supply</th>
                                <th className="p-4 font-bold text-sm uppercase text-red-700">Total Disposal</th>
                                <th className="p-4 font-bold text-sm uppercase text-green-700">Net Waste (Impact)</th>
                                <th className="p-4 font-bold text-sm uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reportData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-700">Level {row.level}</td>
                                    <td className="p-4 text-blue-600 font-semibold">{row.supply.toLocaleString()}</td>
                                    <td className="p-4 text-red-600 font-semibold">{row.disposal.toLocaleString()}</td>
                                    <td className="p-4 text-green-600 font-bold">{row.net.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.net > 500 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {row.net > 500 ? 'HIGH SURPLUS' : 'MANAGED'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-bold text-gray-800">
                            <tr>
                                <td className="p-4">TOTALS</td>
                                <td className="p-4 text-blue-800">{reportData.reduce((acc, curr) => acc + curr.supply, 0).toLocaleString()}</td>
                                <td className="p-4 text-red-800">{reportData.reduce((acc, curr) => acc + curr.disposal, 0).toLocaleString()}</td>
                                <td className="p-4 text-green-800 border-t-2 border-green-500">{reportData.reduce((acc, curr) => acc + curr.net, 0).toLocaleString()}</td>
                                <td className="p-4"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Reports;

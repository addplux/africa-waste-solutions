import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaEdit, FaChartBar, FaClipboardList } from 'react-icons/fa';
import Header from '../components/Header';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-5xl mx-auto mt-10 p-6">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-purple-700 mb-2 uppercase">System Dashboard</h2>
                    <p className="text-gray-600">Welcome to the Waste Management & Tracking System.</p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Link to="/accounts/new" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <FaUserPlus size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Create Account</h3>
                        </div>
                        <p className="text-gray-500 text-sm">Register new suppliers, manufacturers, or households.</p>
                    </Link>

                    <Link to="/data-entry" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FaEdit size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Data Entry</h3>
                        </div>
                        <p className="text-gray-500 text-sm">Record package levels and waste disposal metrics.</p>
                    </Link>

                    <Link to="/reports" className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <FaChartBar size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">View Reports</h3>
                        </div>
                        <p className="text-gray-500 text-sm">Analyze net waste, supply trends, and performance.</p>
                    </Link>
                </div>

                {/* System Objectives / Status */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-black border-b border-gray-200 pb-2 mb-4 uppercase flex items-center gap-2">
                        <FaClipboardList className="text-green-600" />
                        System Status & Objectives
                    </h3>
                    <ul className="space-y-3">
                        {[
                            "Monitor waste supply vs. disposal levels.",
                            "Track manufacturer responsibility compliance.",
                            "Verify user identities via KYC integration.",
                            "Generate real-time environmental impact reports."
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                                <span className="text-green-500 font-bold">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

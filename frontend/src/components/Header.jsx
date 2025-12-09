import React from 'react';
import { FaRecycle } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="bg-white pt-4 pb-2 px-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="text-green-600 text-4xl">
                    <FaRecycle />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-black tracking-wide">AFRICA WASTE SOLUTIONS</h1>
                    <p className="text-sm text-gray-600">SUSTAINABLE WASTE MANAGEMENT SYSTEM</p>
                </div>
            </div>
            {/* Thin green horizontal line separator */}
            <div className="h-[2px] w-full bg-green-500"></div>
        </header>
    );
};

export default Header;

import React from 'react';

const BalanceDisplay = ({ balance }) => {
    const balanceColorClass = balance >= 0 ? 'text-green-700' : 'text-red-700';
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Balance:</h2>
            <p className={`text-3xl font-bold ${balanceColorClass}`}>Ksh. {balance.toFixed(2)}</p>
        </div>
    );
};

export default BalanceDisplay;
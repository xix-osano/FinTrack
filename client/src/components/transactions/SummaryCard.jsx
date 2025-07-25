import React from 'react';

const SummaryCard = ({ title, amount, type }) => {
    const textColorClass = type === 'expense' ? 'text-red-600' : 'text-green-600';
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
            <p className={`text-3xl font-bold ${textColorClass}`}>Ksh. {amount.toFixed(2)}</p>
        </div>
    );
};

export default SummaryCard; 
import React from 'react';

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }) => {
    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Expenses</h2>
            {expenses.length === 0 ? (
                <p className="text-gray-500 text-center">No expenses recorded yet. Add one above!</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Description</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense._id || expense.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">{expense.description}</td>
                                    <td className="py-3 px-4 text-gray-800">${expense.amount.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-gray-800">{expense.category}</td>
                                    <td className="py-3 px-4 text-gray-800">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => onEditExpense(expense._id || expense.id, { /* pass updated data */ })}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-200"
                                            title="Edit Expense"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDeleteExpense(expense._id || expense.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-200"
                                            title="Delete Expense"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
export default ExpenseList;
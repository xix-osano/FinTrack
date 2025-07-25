import React from 'react';
import { useState } from 'react';

const TransactionList = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
    const [transactionToDeleteDescription, setTransactionToDeleteDescription] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null); // Stores the transaction object being edited

    const handleDeleteClick = (transactionId, description) => {
        setTransactionToDeleteId(transactionId);
        setTransactionToDeleteDescription(description);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        onDeleteTransaction(transactionToDeleteId);
        setShowConfirmModal(false);
        setTransactionToDeleteId(null);
        setTransactionToDeleteDescription('');
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setTransactionToDeleteId(null);
        setTransactionToDeleteDescription('');
    };

    const handleEditClick = (transaction) => {
        setTransactionToEdit({ ...transaction, amount: transaction.amount.toString() }); // Convert amount to string for input field
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setTransactionToEdit(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!transactionToEdit.description || !transactionToEdit.amount || parseFloat(transactionToEdit.amount) <= 0) {
            // You might want to add a more visible error message here
            console.error("Description and a positive amount are required for editing.");
            return;
        }
        onEditTransaction(transactionToEdit._id || transactionToEdit.id, {
            description: transactionToEdit.description,
            amount: parseFloat(transactionToEdit.amount),
            category: transactionToEdit.category,
        });
        setShowEditModal(false);
        setTransactionToEdit(null);
    };

    const cancelEdit = () => {
        setShowEditModal(false);
        setTransactionToEdit(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">List of Incomes and Expenses</h2>
            {transactions.length === 0 ? (
                <p className="text-gray-500 text-center">No transactions yet. Add some above!</p>
            ) : (
                <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Description</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id || transaction.id} className={`border-b border-gray-200 last:border-b-0 hover:bg-gray-50 ${
                                    transaction.type === 'expense' ? 'bg-red-50' : 'bg-green-50'
                                }`}
                                >
                                    <td className="py-3 px-4 text-gray-800">{transaction.description}</td>
                                    <td className="py-3 px-4 text-gray-800">{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-gray-800">{transaction.category}</td>
                                    <td className={`font-semibold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>{transaction.type === 'expense' ? '-' : '+'}Ksh. {transaction.amount.toFixed(2)}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(transaction)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-200"
                                            title="Edit Transaction"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(transaction._id || transaction.id, transaction.description)}
                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-200"
                                            title="Delete Transaction"
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

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the transaction: <br />
                            <span className="font-bold">"{transactionToDeleteDescription}"</span>?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Expense Modal */}
            {showEditModal && transactionToEdit && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Transaction</h3>
                        <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={transactionToEdit.description}
                                onChange={handleEditChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={transactionToEdit.amount}
                                onChange={handleEditChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                step="0.01"
                                required
                            />
                            <select
                                name="category"
                                value={transactionToEdit.category}
                                onChange={handleEditChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Salary">Salary</option>
                                <option value="Rent">Rent</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
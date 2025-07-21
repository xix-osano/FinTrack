import React from 'react';
import { useState } from 'react';

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [expenseToDeleteId, setExpenseToDeleteId] = useState(null);
    const [expenseToDeleteDescription, setExpenseToDeleteDescription] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null); // Stores the expense object being edited

    const handleDeleteClick = (expenseId, description) => {
        setExpenseToDeleteId(expenseId);
        setExpenseToDeleteDescription(description);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        onDeleteExpense(expenseToDeleteId);
        setShowConfirmModal(false);
        setExpenseToDeleteId(null);
        setExpenseToDeleteDescription('');
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setExpenseToDeleteId(null);
        setExpenseToDeleteDescription('');
    };

    const handleEditClick = (expense) => {
        setExpenseToEdit({ ...expense, amount: expense.amount.toString() }); // Convert amount to string for input field
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setExpenseToEdit(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!expenseToEdit.description || !expenseToEdit.amount || parseFloat(expenseToEdit.amount) <= 0) {
            // You might want to add a more visible error message here
            console.error("Description and a positive amount are required for editing.");
            return;
        }
        onEditExpense(expenseToEdit._id || expenseToEdit.id, {
            description: expenseToEdit.description,
            amount: parseFloat(expenseToEdit.amount),
            category: expenseToEdit.category,
        });
        setShowEditModal(false);
        setExpenseToEdit(null);
    };

    const cancelEdit = () => {
        setShowEditModal(false);
        setExpenseToEdit(null);
    };

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
                                            onClick={() => handleEditClick(expense)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-200"
                                            title="Edit Expense"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(expense._id || expense.id, expense.description)}
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

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the expense: <br />
                            <span className="font-bold">"{expenseToDeleteDescription}"</span>?
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
            {showEditModal && expenseToEdit && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Expense</h3>
                        <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={expenseToEdit.description}
                                onChange={handleEditChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={expenseToEdit.amount}
                                onChange={handleEditChange}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                step="0.01"
                                required
                            />
                            <select
                                name="category"
                                value={expenseToEdit.category}
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
export default ExpenseList;
import React, { useState } from 'react';

const ExpenseForm = ({ onAddExpense }) => {
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'Food',
    });

    const handleNewExpenseChange = (e) => {
        const { name, value } = e.target;
        setNewExpense(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newExpense.description || !newExpense.amount) {
            console.error("Description and Amount are required.");
            // In a real app, you'd show a user-friendly error message
            return;
        }
        onAddExpense(newExpense);
        setNewExpense({ description: '', amount: '', category: 'Food' });
    };

    return (
        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={handleNewExpenseChange}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={handleNewExpenseChange}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    step="0.01"
                    required
                />
                <select
                    name="category"
                    value={newExpense.category}
                    onChange={handleNewExpenseChange}
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
                <button
                    type="submit"
                    className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                    Add Expense
                </button>
            </form>
        </div>
    );
};
export default ExpenseForm;
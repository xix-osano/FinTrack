import React, { useState, useEffect } from 'react';
import ExpenseForm from './expenses/ExpenseForm';
import ExpenseList from './expenses/ExpenseList';

const Dashboard = ({ navigate, token, onLogout }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Base URL for your backend API
    const API_BASE_URL = 'http://localhost:5000/api'; // Make sure this matches your backend URL

    // Function to fetch expenses from the backend
    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/expenses`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    onLogout(); // Token expired or invalid, force logout
                    throw new Error('Unauthorized. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to fetch expenses');
            }

            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError(err.message);
            setExpenses([]); // Clear expenses on error
        } finally {
            setLoading(false);
        }
    };

    // Fetch expenses when component mounts or token changes
    useEffect(() => {
        if (token) {
            fetchExpenses();
        } else {
            // If no token, navigate to login (handled by App.js)
            setExpenses([]);
            setLoading(false);
        }
    }, [token]); // Re-fetch if token changes

    // Handle adding a new expense
    const addExpense = async (newExpenseData) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description: newExpenseData.description,
                    amount: parseFloat(newExpenseData.amount),
                    category: newExpenseData.category,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    onLogout();
                    throw new Error('Unauthorized. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to add expense');
            }

            const addedExpense = await response.json();
            setExpenses(prev => [...prev, addedExpense]);
            console.log("Expense added:", addedExpense);
        } catch (err) {
            console.error('Error adding expense:', err);
            setError(err.message);
        }
    };

    // Handle deleting an expense
    const deleteExpense = async (id) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    onLogout();
                    throw new Error('Unauthorized. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to delete expense');
            }

            setExpenses(prev => prev.filter(expense => expense._id !== id)); // Use _id from MongoDB
            console.log("Deleted expense with ID:", id);
        } catch (err) {
            console.error('Error deleting expense:', err);
            setError(err.message);
        }
    };

    // Placeholder for edit expense (would typically open a modal or navigate to an edit form)
    const editExpense = async (id, updatedData) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    onLogout();
                    throw new Error('Unauthorized. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to update expense');
            }

            const updatedExpense = await response.json();
            setExpenses(prev => prev.map(exp => (exp._id === id ? updatedExpense : exp))); // Update in state
            console.log("Updated expense:", updatedExpense);
        } catch (err) {
            console.error('Error updating expense:', err);
            setError(err.message);
        }
    };

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-700">Loading expenses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-100 rounded-lg shadow-xl max-w-md w-full mx-auto my-8">
                <p className="text-xl text-red-700 mb-4">Error: {error}</p>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={fetchExpenses}
                >
                    Retry
                </button>
                <button
                    className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto my-8">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Expense Tracker Dashboard</h1>
            <p className="text-gray-700 mb-8 text-lg text-center">
                Manage your finances efficiently. Add, view, and track your expenses here.
            </p>

            {/* Total Expenses Summary */}
            <div className="w-full bg-indigo-100 p-4 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-indigo-800 mb-2">Total Expenses:</h2>
                <p className="text-4xl font-bold text-indigo-900">${totalExpenses}</p>
            </div>

            {/* Add New Expense Form */}
            <ExpenseForm onAddExpense={addExpense} />

            {/* Expense List */}
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} onEditExpense={editExpense} />

            {/* Logout Button */}
            <div className="mt-8 w-full max-w-md">
                <button
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                    onClick={onLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
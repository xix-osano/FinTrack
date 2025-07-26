import React, { useState, useEffect, useRef } from 'react';
import SummaryCard from './transactions/SummaryCard';
import InputSection from './transactions/InputSection';
import TransactionList from './transactions/TransactionList';
import BalanceDisplay from './transactions/BalanceDisplay';
import Navbar from './Navbar';

// Dashboard component containing the main application logic and UI
const Dashboard = ({ navigate, token, onLogout }) => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Track if we've already fetched transactions for this token
    const lastFetchedTokenRef = useRef(null);
    const isFetchingRef = useRef(false);

    // Separate states for expense input fields
    const [expenseCategory, setExpenseCategory] = useState('Other');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    // Separate states for income input fields
    const [incomeCategory, setIncomeCategory] = useState('Salary');
    const [incomeDescription, setIncomeDescription] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');

    // Calculate balance whenever expenses or income changes
    const balance = totalIncome - totalExpenses;

    // BASE URL for backend API
    const API_BASE_URL = 'http://localhost:5000/api';

    // Function to fetch transactions from the backend
    const fetchTransactions = async () => {
        // Prevent multiple simultaneous fetches
        if (isFetchingRef.current) {
            console.log('Dashboard: Fetch already in progress, skipping...');
            return;
        }

        setLoading(true);
        setError(null);
        isFetchingRef.current = true;

        try {
            console.log('Dashboard: Starting fetch transactions...');
            const response = await fetch(`${API_BASE_URL}/transactions`, {
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
                throw new Error(errorData.msg || 'Failed to fetch transactions');
            }

            const data = await response.json();
            setTransactions(data);
            lastFetchedTokenRef.current = token;
            console.log('Dashboard: Successfully fetched transactions');
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError(err.message);
            setTransactions([]); // Clear transactions on error
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    // Fetch transactions when component mounts or token changes
    useEffect(() => {
        console.log('Dashboard useEffect triggered. Token value in useEffect:', token);

        if (token) {
            // Only fetch if token is different from last fetched token
            if (token !== lastFetchedTokenRef.current) {
                console.log('Dashboard: Token is present and different, attempting to fetch transactions...');
                fetchTransactions();
            } else {
                console.log('Dashboard: Token unchanged, skipping fetch...');
                setLoading(false);
            }
        } else {
            console.log('Dashboard: No token, resetting transactions and loading state.');
            setTransactions([]);
            setLoading(false);
            lastFetchedTokenRef.current = null;
        }
    }, [token]); // Re-fetch if token changes

    // Recalculate total expenses and income whenever transactions change
    useEffect(() => {
        let expenses = 0;
        let income = 0;
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                expenses += transaction.amount;
            } else if (transaction.type === 'income') {
                income += transaction.amount;
            }
        });
        setTotalExpenses(expenses);
        setTotalIncome(income);
    }, [transactions]);

    // Handle adding a new transaction
    const handleAddTransaction = async (newTransactionData) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description: newTransactionData.description,
                    amount: parseFloat(newTransactionData.amount), // Ensure amount is a number
                    type: newTransactionData.type, // 'expense' or 'income'
                    category: newTransactionData.category,
                    date: new Date().toISOString(), // Use ISO format for date
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    onLogout();
                    throw new Error('Unauthorized. Please log in again.');
                }
                const errorData = await response.json();
                throw new Error(errorData.msg || `Failed to add ${newTransactionData.type}`);
            }

            const addedTransaction = await response.json();
            setTransactions(prev => [...prev, addedTransaction]);
            console.log("Transaction added:", addedTransaction);

            // Clear input fields after successful addition
            if (newTransactionData.type === 'expense') {
                setExpenseDescription('');
                setExpenseAmount('');
                setExpenseCategory('Other');
            } else if (newTransactionData.type === 'income') {
                setIncomeDescription('');
                setIncomeAmount('');
                setIncomeCategory('Salary');
            }
        } catch (err) {
            console.error('Error adding transaction:', err);
            setError(err.message);
        }
    };

    // Handle deleting a transaction
    const deleteTransaction = async (id) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
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
                throw new Error(errorData.msg || 'Failed to delete transaction');
            }

            setTransactions(prev => prev.filter(transaction => transaction._id !== id)); // Use _id from MongoDB
            console.log("Deleted transaction with ID:", id);
        } catch (err) {
            console.error('Error deleting transaction:', err);
            setError(err.message);
        }
    };

    // Edit transaction
    const editTransaction = async (id, updatedData) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
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
                throw new Error(errorData.msg || 'Failed to update transaction');
            }

            const updatedTransaction = await response.json();
            setTransactions(prev => prev.map(trn => (trn._id === id ? updatedTransaction : trn))); // Update in state
            console.log("Updated transaction:", updatedTransaction);
        } catch (err) {
            console.error('Error updating transaction:', err);
            setError(err.message);
        }
    };

    // Handlers for adding specific transaction types (expense/income)
    const handleAddExpense = () => {
        // Client-side validation for expense
        if (!expenseDescription.trim() || isNaN(parseFloat(expenseAmount)) || parseFloat(expenseAmount) <= 0) {
            setError("Please enter a valid description and a positive amount for the expense.");
            return;
        }
        setError(null); // Clear any previous errors
        handleAddTransaction({
            type: 'expense',
            description: expenseDescription,
            amount: expenseAmount,
            category: expenseCategory,
        });
    };

    const handleAddIncome = () => {
        // Client-side validation for income
        if (!incomeDescription.trim() || isNaN(parseFloat(incomeAmount)) || parseFloat(incomeAmount) <= 0) {
            setError("Please enter a valid description and a positive amount for the income.");
            return;
        }
        setError(null); // Clear any previous errors
        handleAddTransaction({
            type: 'income',
            description: incomeDescription,
            amount: incomeAmount,
            category: incomeCategory,
        });
    };

    if (loading) {
        return <div className="text-center p-6 text-gray-600">Loading transactions...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl">
            {/* Navbar Component */}
            <Navbar onLogout={onLogout} appName="FinTrack" />

            {/* Dashboard Title and Description */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">FinTrack Dashboard</h1>
            <p className="text-gray-700 mb-8 text-lg text-center">
                Manage your finances efficiently. Add, view, and track your expenses and income here.
            </p>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <SummaryCard title="Total Expenses" amount={totalExpenses} type="expense" />
                <SummaryCard title="Total Income" amount={totalIncome} type="income" />
            </div>

            {/* Input Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InputSection
                    title="Add Expense"
                    description={expenseDescription}
                    category={expenseCategory}
                    amount={expenseAmount}
                    onDescriptionChange={setExpenseDescription}
                    onAmountChange={setExpenseAmount}
                    onCategoryChange={setExpenseCategory}
                    onAdd={handleAddExpense}
                />
                <InputSection
                    title="Add Income"
                    description={incomeDescription}
                    category={incomeCategory}
                    amount={incomeAmount}
                    onDescriptionChange={setIncomeDescription}
                    onAmountChange={setIncomeAmount}
                    onCategoryChange={setIncomeCategory}
                    onAdd={handleAddIncome}
                />
            </div>

            {/* List of Incomes and Expenses */}
            <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} onEditTransaction={editTransaction} />

            {/* Balance Display */}
            <BalanceDisplay balance={balance} />
        </div>
    );
};

export default Dashboard;
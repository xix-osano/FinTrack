import React, { useState } from 'react';
import ExpenseForm from './expenses/ExpenseForm';
import ExpenseList from './expenses/ExpenseList';

const Dashboard = ({ navigate }) => {
    // State to manage expenses
    const [expenses, setExpenses] = useState([
        { id: '1', description: 'Groceries', amount: 75.50, category: 'Food', date: '2024-07-15' },
        { id: '2', description: 'Bus Fare', amount: 3.00, category: 'Transport', date: '2024-07-14' },
        { id: '3', description: 'Electricity Bill', amount: 120.00, category: 'Utilities', date: '2024-07-10' },
        { id: '4', description: 'Movie Ticket', amount: 15.00, category: 'Entertainment', date: '2024-07-12' },
    ]);

    // Handle adding a new expense
    const addExpense = (newExpenseData) => {
        const expenseToAdd = {
            id: Date.now().toString(), // Simple unique ID for now
            date: new Date().toISOString().slice(0, 10), // Current date
            ...newExpenseData, // Spread new expense data (description, amount, category)
            amount: parseFloat(newExpenseData.amount) // Ensure amount is a number
        };
        setExpenses(prev => [...prev, expenseToAdd]);
        console.log("Expense added:", expenseToAdd);
    };

    // Placeholder for delete expense
    const deleteExpense = (id) => {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
        console.log("Deleted expense with ID:", id);
    };

    // Placeholder for edit expense (would typically open a modal or navigate to an edit form)
    const editExpense = (id) => {
        console.log("Edit expense with ID:", id);
        // In a real application, you'd populate a form with the expense data for editing
    };

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);

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
                    onClick={() => {
                        navigate('login');
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
export default Dashboard; // Export Dashboard


// import React, { useState } from 'react';

// const Dashboard = ({ navigate }) => {
//     // State to manage expenses
//     const [expenses, setExpenses] = useState([
//         { id: '1', description: 'Groceries', amount: 75.50, category: 'Food', date: '2024-07-15' },
//         { id: '2', description: 'Bus Fare', amount: 3.00, category: 'Transport', date: '2024-07-14' },
//         { id: '3', description: 'Electricity Bill', amount: 120.00, category: 'Utilities', date: '2024-07-10' },
//         { id: '4', description: 'Movie Ticket', amount: 15.00, category: 'Entertainment', date: '2024-07-12' },
//     ]);

//     // State for new expense form
//     const [newExpense, setNewExpense] = useState({
//         description: '',
//         amount: '',
//         category: 'Food',
//     });

//     // Handle input changes for new expense form
//     const handleNewExpenseChange = (e) => {
//         const { name, value } = e.target;
//         setNewExpense(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle adding a new expense
//     const addExpense = (e) => {
//         e.preventDefault();
//         if (!newExpense.description || !newExpense.amount) {
//             // In a real app, you'd show a user-friendly error message
//             console.error("Description and Amount are required.");
//             return;
//         }

//         const expenseToAdd = {
//             id: Date.now().toString(), // Simple unique ID for now
//             description: newExpense.description,
//             amount: parseFloat(newExpense.amount),
//             category: newExpense.category,
//             date: new Date().toISOString().slice(0, 10), // Current date
//         };

//         setExpenses(prev => [...prev, expenseToAdd]);
//         setNewExpense({ description: '', amount: '', category: 'Food' }); // Reset form
//         console.log("Expense added:", expenseToAdd);
//     };

//     // Calculate total expenses
//     const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);

//     // Placeholder for delete expense
//     const deleteExpense = (id) => {
//         setExpenses(prev => prev.filter(expense => expense.id !== id));
//         console.log("Deleted expense with ID:", id);
//     };

//     // Placeholder for edit expense (would typically open a modal or navigate to an edit form)
//     const editExpense = (id) => {
//         console.log("Edit expense with ID:", id);
//         // In a real application, you'd populate a form with the expense data for editing
//     };

//     return (
//         <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto my-8">
//             <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Expense Tracker Dashboard</h1>
//             <p className="text-gray-700 mb-8 text-lg text-center">
//                 Manage your finances efficiently. Add, view, and track your expenses here.
//             </p>

//             {/* Total Expenses Summary */}
//             <div className="w-full bg-indigo-100 p-4 rounded-lg shadow-md mb-8">
//                 <h2 className="text-2xl font-semibold text-indigo-800 mb-2">Total Expenses:</h2>
//                 <p className="text-4xl font-bold text-indigo-900">${totalExpenses}</p>
//             </div>

//             {/* Add New Expense Form */}
//             <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md mb-8">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
//                 <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <input
//                         type="text"
//                         name="description"
//                         placeholder="Description"
//                         value={newExpense.description}
//                         onChange={handleNewExpenseChange}
//                         className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         required
//                     />
//                     <input
//                         type="number"
//                         name="amount"
//                         placeholder="Amount"
//                         value={newExpense.amount}
//                         onChange={handleNewExpenseChange}
//                         className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         step="0.01"
//                         required
//                     />
//                     <select
//                         name="category"
//                         value={newExpense.category}
//                         onChange={handleNewExpenseChange}
//                         className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                     >
//                         <option value="Food">Food</option>
//                         <option value="Transport">Transport</option>
//                         <option value="Utilities">Utilities</option>
//                         <option value="Entertainment">Entertainment</option>
//                         <option value="Shopping">Shopping</option>
//                         <option value="Salary">Salary</option> {/* Can be income too */}
//                         <option value="Rent">Rent</option>
//                         <option value="Other">Other</option>
//                     </select>
//                     <button
//                         type="submit"
//                         className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
//                     >
//                         Add Expense
//                     </button>
//                 </form>
//             </div>

//             {/* Expense List */}
//             <div className="w-full bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Expenses</h2>
//                 {expenses.length === 0 ? (
//                     <p className="text-gray-500 text-center">No expenses recorded yet. Add one above!</p>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Description</th>
//                                     <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Amount</th>
//                                     <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Category</th>
//                                     <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Date</th>
//                                     <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {expenses.map((expense) => (
//                                     <tr key={expense.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
//                                         <td className="py-3 px-4 text-gray-800">{expense.description}</td>
//                                         <td className="py-3 px-4 text-gray-800">${expense.amount.toFixed(2)}</td>
//                                         <td className="py-3 px-4 text-gray-800">{expense.category}</td>
//                                         <td className="py-3 px-4 text-gray-800">{expense.date}</td>
//                                         <td className="py-3 px-4 flex space-x-2">
//                                             <button
//                                                 onClick={() => editExpense(expense.id)}
//                                                 className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-200"
//                                                 title="Edit Expense"
//                                             >
//                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                     <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
//                                                 </svg>
//                                             </button>
//                                             <button
//                                                 onClick={() => deleteExpense(expense.id)}
//                                                 className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-200"
//                                                 title="Delete Expense"
//                                             >
//                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                                     <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                 </svg>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Logout Button */}
//             <div className="mt-8 w-full max-w-md">
//                 <button
//                     className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
//                     onClick={() => {
//                         // Simulate logout and navigate back to login
//                         navigate('login');
//                     }}
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
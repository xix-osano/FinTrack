import React from 'react';

const InputSection = ({ title, description, amount, category, onDescriptionChange, onAmountChange, onCategoryChange, onAdd }) => {
  const isExpense = title.toLowerCase().includes('expense');
  const categoryOptions = isExpense
    ? ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Rent', 'Other']
    : ['Salary', 'Freelancing', 'Investment', 'Gift', 'Other'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" 
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full p-2 mb-4 rounded border border-gray-300 rounded-lg"
      >
        <option value="">Select Category</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button
        onClick={onAdd}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
      >
        {title}
      </button>
    </div>
  );
};

export default InputSection;



// import React from 'react';

// const InputSection = ({ title, description, amount, onDescriptionChange, onAmountChange, onAdd }) => {
//     return (
//         <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
//             <textarea
//                 className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                 placeholder="Description (e.g., Groceries, Salary)"
//                 rows="2"
//                 value={description}
//                 onChange={(e) => onDescriptionChange(e.target.value)}
//             ></textarea>
//             <input
//                 type="number"
//                 className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Amount (Ksh.)"
//                 value={amount}
//                 onChange={(e) => onAmountChange(e.target.value)}
//             />
//             <button
//                 onClick={onAdd}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
//             >
//                 {title}
//             </button>
//         </div>
//     );
// };

// export default InputSection;
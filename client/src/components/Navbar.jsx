// src/components/Navbar.jsx
import React from 'react';
import PropTypes from 'prop-types'; // For prop type validation

const Navbar = ({ onLogout, appName = "FinTrack" }) => {
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-md w-full mb-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Application Name/Logo */}
                <h1 className="text-2xl font-bold text-white tracking-wide">
                    {appName}
                </h1>

                {/* Navigation Links (if any, currently none specified in wireframe) */}
                {/* You could add links here later, e.g., to different views or profile */}
                {/* <div className="hidden md:flex space-x-4">
                    <a href="#dashboard" className="text-white hover:text-blue-200 transition duration-300">Dashboard</a>
                    <a href="#settings" className="text-white hover:text-blue-200 transition duration-300">Settings</a>
                </div> */}

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300 ease-in-out border border-red-400"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

// Prop type validation for better development and error checking
Navbar.propTypes = {
    onLogout: PropTypes.func.isRequired,
    appName: PropTypes.string,
};

export default Navbar;
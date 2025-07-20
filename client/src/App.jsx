// App.js
import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import './index.css'; 

const App = () => {
    // State to manage the current path/route
    const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || 'login');
    // State to hold the authentication token
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Effect to listen for hash changes in the URL
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash.substring(1) || 'login');
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Effect to check for token on initial load and navigate to dashboard if present
    useEffect(() => {
        if (token) {
            setCurrentPath('dashboard');
        } else {
            setCurrentPath('login');
        }
    }, [token]);

    // Function to navigate to a new path
    const navigate = (path) => {
        window.location.hash = path;
    };

    // Function to handle successful login/registration
    const handleAuthSuccess = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        navigate('dashboard');
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('login');
    };

    // Render components based on the current path
    const renderContent = () => {
        switch (currentPath) {
            case 'login':
            case 'register':
                return <AuthForm navigate={navigate} initialPath={currentPath} onAuthSuccess={handleAuthSuccess} />;
            case 'dashboard':
                // Pass token and logout handler to Dashboard
                return <Dashboard navigate={navigate} token={token} onLogout={handleLogout} />;
            default:
                return <AuthForm navigate={navigate} initialPath="login" onAuthSuccess={handleAuthSuccess} />;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-blue-200">
            {renderContent()}
        </div>
    );
};

export default App;
import React, { useState, useEffect } from 'react';

const AuthForm = ({ navigate, initialPath, onAuthSuccess }) => {
    const [isRegisterActive, setIsRegisterActive] = useState(initialPath === 'register');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // For displaying success/error messages

    useEffect(() => {
        if (isRegisterActive) {
            navigate('register');
        } else {
            navigate('login');
        }
        setMessage(''); // Clear message on form switch
    }, [isRegisterActive, navigate]);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onAuthSuccess(data.token); // Pass token to App.js
            } else {
                setMessage(data.msg || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Network error. Please try again.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onAuthSuccess(data.token); // Pass token to App.js
            } else {
                setMessage(data.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Network error. Please try again.');
        }
    };

    const authFormStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        .container {
            position: relative;
            width: 850px;
            height: 550px;
            background: #fff;
            margin: 20px;
            border-radius: 30px;
            box-shadow: 0 0 30px rgba(0, 0, 0, .2);
            overflow: hidden;
            display: flex;
        }

        .container h1 {
            font-size: 36px;
            margin: -10px 0;
        }

        .container p {
            font-size: 14.5px;
            margin: 15px 0;
        }

        .form-box {
            position: absolute;
            right: 0;
            width: 50%;
            height: 100%;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #333;
            text-align: center;
            padding: 40px;
            z-index: 1;
            transition: .6s ease-in-out 1.2s, visibility 0s 1s;
        }

        .container.active .form-box { right: 50%; }

        .form-box.register { visibility: hidden; }
        .container.active .form-box.register { visibility: visible; }

        .input-box {
            position: relative;
            margin: 30px 0;
            width: 100%;
        }

        .input-box input {
            width: 100%;
            padding: 13px 50px 13px 20px;
            background: #eee;
            border-radius: 8px;
            border: none;
            outline: none;
            font-size: 16px;
            color: #333;
            font-weight: 500;
        }

        .input-box input::placeholder {
            color: #888;
            font-weight: 400;
        }

        .input-box i {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }

        .forgot-link { margin: -15px 0 15px; }
        .forgot-link a {
            font-size: 14.5px;
            color: #333;
        }

        .btn {
            width: 100%;
            height: 48px;
            background: #1f42a3ff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, .1);
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #fff;
            font-weight: 600;
            margin-top: 10px;
        }

        .social-icons {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .social-icons a {
            display: inline-flex;
            padding: 10px;
            border: 2px solid #ccc;
            border-radius: 8px;
            font-size: 24px;
            color: #333;
            margin: 0 8px;
        }

        .toggle-box {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .toggle-box::before {
            content: '';
            position: absolute;
            left: -250%;
            width: 300%;
            height: 100%;
            background: #1f42a3ff;
            border-radius: 150px;
            z-index: 2;
            transition: 1.8s ease-in-out;
        }

        .container.active .toggle-box::before { left: 50%; }

        .toggle-panel {
            position: absolute;
            width: 50%;
            height: 100%;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2;
            transition: .6s ease-in-out;
            pointer-events: auto;
        }

        .toggle-panel.toggle-left {
            left: 0;
            transition-delay: 1.2s;
        }
        .container.active .toggle-panel.toggle-left {
            left: -50%;
            transition-delay: .6s;
        }

        .toggle-panel.toggle-right {
            right: -50%;
            transition-delay: .6s;
        }
        .container.active .toggle-panel.toggle-right {
            right: 0;
            transition-delay: 1.2s;
        }

        .toggle-panel p { margin-bottom: 20px; }

        .toggle-panel .btn {
            width: 160px;
            height: 46px;
            background: transparent;
            border: 2px solid #fff;
            box-shadow: none;
        }

        /* Media Queries */
        @media screen and (max-width: 650px) {
            .container { height: calc(100vh - 40px); width: 100%; border-radius: 0; }
            .form-box {
                bottom: 0;
                width: 100%;
                height: 70%;
                right: 0 !important;
                transition: .6s ease-in-out 1.2s, visibility 0s 1s;
            }
            .container.active .form-box {
                bottom: 30%;
            }
            .form-box.register {
                visibility: hidden;
            }
            .container.active .form-box.register {
                visibility: visible;
            }

            .toggle-box::before {
                left: 0;
                top: -270%;
                width: 100%;
                height: 300%;
                border-radius: 20vw;
            }
            .container.active .toggle-box::before {
                left: 0;
                top: 70%;
            }

            .toggle-panel {
                width: 100%;
                height: 30%;
                left: 0 !important;
                right: 0 !important;
                transition-delay: 0s !important;
            }
            .toggle-panel.toggle-left { top: 0; }
            .toggle-panel.toggle-right { bottom: -30%; }
            .container.active .toggle-panel.toggle-left { top: -30%; }
            .container.active .toggle-panel.toggle-right { bottom: 0; }
        }

        @media screen and (max-width: 400px) {
            .form-box { padding: 20px; }
            .toggle-panel h1 { font-size: 30px; }
        }
    `;

    return (
        <div className={`container ${isRegisterActive ? 'active' : ''}`}>
            <style>{authFormStyles}</style>
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />

            <div className="form-box login">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Login</h1>
                    {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className='bx bxs-envelope'></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit" className="btn">Login</button>
                    <p>or login with social platforms</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google'></i></a>
                        <a href="#"><i className='bx bxl-facebook'></i></a>
                        <a href="#"><i className='bx bxl-github'></i></a>
                        <a href="#"><i className='bx bxl-linkedin'></i></a>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Registration</h1>
                    {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <i className='bx bxs-envelope'></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" className="btn">Register</button>
                    <p>or register with social platforms</p>
                    <div className="social-icons">
                        <a href="#"><i className='bx bxl-google'></i></a>
                        <a href="#"><i className='bx bxl-facebook'></i></a>
                        <a href="#"><i className='bx bxl-github'></i></a>
                        <a href="#"><i className='bx bxl-linkedin'></i></a>
                    </div>
                </form>
            </div>

            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                    <h1>Hello, Welcome!</h1>
                    <p>Don't have an account?</p>
                    <button className="btn register-btn" onClick={() => setIsRegisterActive(true)}>Register</button>
                </div>

                <div className="toggle-panel toggle-right">
                    <h1>Welcome Back!</h1>
                    <p>Already have an account?</p>
                    <button className="btn login-btn" onClick={() => setIsRegisterActive(false)}>Login</button>
                </div>
            </div>
        </div>
    );
};
export default AuthForm;
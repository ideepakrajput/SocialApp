import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">SocialApp</Link>
            </div>
            <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile" onClick={toggleMenu}>Profile</Link>
                        <Link to="/feed" onClick={toggleMenu}>Feed</Link>
                        <Link to="/users" onClick={toggleMenu}>Users</Link>
                        <button onClick={() => { handleLogout(); toggleMenu(); }} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={toggleMenu}>Login</Link>
                        <Link to="/signup" onClick={toggleMenu}>Signup</Link>
                    </>
                )}
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
};

export default Navbar;
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from '../assets/img/hoteru_logo.png';

function Navbar() {
    const token = localStorage.getItem('hoteru_login_token');
    const location = useLocation();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    // check logged in user
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
          try {
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
          } catch (error) {
            console.error("Error checking login status:", error);
            setIsLoggedIn(false);
          }
        };
    
        checkLoginStatus();
      }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('hoteru_login_token');
        localStorage.removeItem('hoteru_username');
        localStorage.removeItem('hoteru_user_email');
        localStorage.removeItem('hoteru_admin_key');
        setIsLoggedIn(false);
        navigate('/')
    }

    return (
        <>
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/"><img src={Logo} alt="" /></a>
            </div>
            <div className="nav-profile2">
                {isLoggedIn ? (
                    <div className="profile-dropdown">
                        <button>Profile</button>
                        <div className="dropdown-content">
                            <a href="/dashboard">Dashboard</a>
                            <a href="/reservations">My Reservations</a>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink> |
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
                <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            <ul className={`nav-links ${isOpen ? "active" : ""}`}>
                {location.pathname === "/" || location.pathname === '/login' || location.pathname === '/register' ? (
                    <>
                        <li><a href="/#hero">Home</a></li>
                        <li><a href="/#about">About</a></li>
                        <li><a href="/#rooms">Rooms</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                        <li><NavLink to="/rooms">Rooms</NavLink></li>
                        <li><NavLink to="/reservations">Reservations</NavLink></li>
                        <li><NavLink to="/transactions">Transactions</NavLink></li>
                    </>
                )}
            </ul>
            <div className="nav-profile">
                {isLoggedIn ? (
                    <div className="profile-dropdown">
                        <button>Profile</button>
                        <div className="dropdown-content">
                            <a href="/dashboard">Dashboard</a>
                            <a href="/reservations">My Reservations</a>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink> |
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
        </>
    );

};

export default Navbar;
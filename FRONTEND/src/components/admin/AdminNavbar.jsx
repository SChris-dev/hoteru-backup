import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const username = localStorage.getItem('hoteru_username');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('hoteru_admin_key');
        localStorage.removeItem('hoteru_login_token');
        localStorage.removeItem('hoteru_user_email');
        localStorage.removeItem('hoteru_username');
        navigate('/');
        window.location.reload();
    }

    return (
        <nav className="navbar navbar-dark bg-hoteru-nav fixed-top shadow-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="dashboard">
                    <img src="/hoteru_logo.png" alt="Hoteru Logo" />
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasDarkNavbar"
                    aria-controls="offcanvasDarkNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="offcanvas offcanvas-end bg-hoteru-nav text-light"
                    tabIndex="-1"
                    id="offcanvasDarkNavbar"
                    aria-labelledby="offcanvasDarkNavbarLabel"
                >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                            Settings
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <span className="nav-link">Username: {username}</span>
                            </li>
                            <li className="nav-item">
                                <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;

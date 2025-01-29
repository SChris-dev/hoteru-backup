import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './assets/css/Navbar.css';

import Footer from './components/Footer';
import Navbar from './components/Navbar';

const Master = () => {
    const adminKey = localStorage.getItem('hoteru_admin_key');
    const token = localStorage.getItem('hoteru_login_token');
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (adminKey) {
            navigate('/admin/dashboard');
        }
        
        if (!token && location.pathname !== '/register' && location.pathname !== '/') {
            navigate('/login');
        }

        let pathnaming;

        if (location.pathname === '/') {
            pathnaming = 'Main';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/login') {
            pathnaming = 'Login';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/register') {
            pathnaming = 'Register';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/dashboard') {
            pathnaming = 'Dashboard';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/rooms') {
            pathnaming = 'Rooms';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/reservations') {
            pathnaming = 'Reservations History';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/transactions') {
            pathnaming = 'Transactions History';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/reservations/:id') {
            pathnaming = 'Reservation Process';
            document.title = 'Hoteru | ' + pathnaming;
        } else if (location.pathname === '/transactions/:id') {
            pathnaming = 'Transaction Process';
            document.title = 'Hoteru | ' + pathnaming;
        }


    }, [location.pathname]);

    return(
        <>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
        </>
    );
}

export default Master;
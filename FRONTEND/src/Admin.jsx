import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import AdminNavbar from './components/admin/AdminNavbar';

const Admin = () => {


    const location = useLocation();
    const navigate = useNavigate();
    const adminKey = localStorage.getItem('hoteru_admin_key');
    const token = localStorage.getItem('hoteru_login_token');

    const routesWithBootstrap = [
        '/admin/dashboard',
        '/admin/users',
        '/admin/rooms',
        '/admin/reservations',
        '/admin/transactions'
    ];

    useEffect(() => {
        if (!adminKey && !token) {
            window.location.reload();
            navigate('/');
        }
    
        if (adminKey !== token) {
            window.location.reload();
            navigate('/');
        }

        if (location.pathname === '/admin') {
            window.location.reload();
            navigate('/')
        }
    
        let pathadmin;
        if (routesWithBootstrap.includes(location.pathname)) {
            if (location.pathname === '/admin/dashboard') {
                pathadmin = 'Admin Dashboard';
            } else if (location.pathname === '/admin/rooms') {
                pathadmin = 'Rooms Table';
            } else if (location.pathname === '/admin/users') {
                pathadmin = 'Users Table';
            } else if (location.pathname === '/admin/reservations') {
                pathadmin = 'Reservations Table';
            } else if (location.pathname === '/admin/transactions') {
                pathadmin = 'Transactions Table';
            }
            document.title = 'Hoteru | ' + pathadmin;
    
            // // Dynamically import Bootstrap CSS and JS (always load and remove on route change)
            // const linkBootstrap1 = document.createElement('link');
            // linkBootstrap1.rel = 'stylesheet';
            // linkBootstrap1.href = '/bootstrap/bootstrap.min.css';
            // document.head.appendChild(linkBootstrap1);
    
            // const scriptBootstrap1 = document.createElement('script');
            // scriptBootstrap1.src = '/bootstrap/bootstrap.bundle.min.js';
            // scriptBootstrap1.async = true;
            // document.body.appendChild(scriptBootstrap1);
    
            // // Dynamically import Admin CSS (always load and remove on route change)
            // const linkAdminCss1 = document.createElement('link');
            // linkAdminCss1.rel = 'stylesheet';
            // linkAdminCss1.href = '/Admin.css';
            // document.head.appendChild(linkAdminCss1);
    
            // Dynamically import Bootstrap CSS and JS (only once, persists across pages)
            let linkBootstrap2 = document.querySelector('link[data-persistent="bootstrap"]');
            if (!linkBootstrap2) {
                linkBootstrap2 = document.createElement('link');
                linkBootstrap2.rel = 'stylesheet';
                linkBootstrap2.href = '/bootstrap/bootstrap.min.css';
                linkBootstrap2.setAttribute('data-persistent', 'bootstrap');
                document.head.appendChild(linkBootstrap2);
            }
    
            let scriptBootstrap2 = document.querySelector('script[data-persistent="bootstrap"]');
            if (!scriptBootstrap2) {
                scriptBootstrap2 = document.createElement('script');
                scriptBootstrap2.src = '/bootstrap/bootstrap.bundle.min.js';
                scriptBootstrap2.async = true;
                scriptBootstrap2.setAttribute('data-persistent', 'bootstrap');
                document.body.appendChild(scriptBootstrap2);
            }
    
            // Dynamically import Admin CSS (only once, persists across pages)
            let linkAdminCss2 = document.querySelector('link[data-persistent="admin"]');
            if (!linkAdminCss2) {
                linkAdminCss2 = document.createElement('link');
                linkAdminCss2.rel = 'stylesheet';
                linkAdminCss2.href = '/Admin.css';
                linkAdminCss2.setAttribute('data-persistent', 'admin');
                document.head.appendChild(linkAdminCss2);
            }
    
            // Cleanup function to remove the first set of resources (Bootstrap & Admin CSS) when leaving these pages
            // return () => {
            //     document.head.removeChild(linkBootstrap1);
            //     document.body.removeChild(scriptBootstrap1);
            //     document.head.removeChild(linkAdminCss1);
            // };
        }
    
    }, [location.pathname]);
    

    return(
        <>
        <div className="admin-bg">
            <AdminNavbar></AdminNavbar>
            <main>
                <div className="row g-0">
                    <div className="col-md-2 bg-hoteru">
                    <div className="nav flex-column nav-pills m-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <NavLink className="nav-link bg-hoteru-link my-1 text-light"  to='dashboard' role="tab">Home</NavLink>
                    <NavLink className="nav-link bg-hoteru-link my-1 text-light" to='users' role="tab">Users</NavLink>
                    <NavLink className="nav-link bg-hoteru-link my-1 text-light" to="rooms" role="tab">Rooms</NavLink>
                    <NavLink className="nav-link bg-hoteru-link my-1 text-light" to="reservations" role="tab">Reservations</NavLink>
                    <NavLink className="nav-link bg-hoteru-link my-1 text-light" to="transactions" role="tab">Transactions</NavLink>
                    </div>
                    </div>
                    <div className="col-md-10">
                        <div className="card mt-4 mx-4">
                            <div className="card-body">
                                <Outlet></Outlet>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        
        </>
    );
}

export default Admin;
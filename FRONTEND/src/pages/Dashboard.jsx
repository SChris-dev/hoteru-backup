import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Api from "../Api";
import '../assets/css/User.css';

const Dashboard = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const contentRef = useRef(null);
    
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const ApiResponse = await Api.get('v1/user/self');
    
            const userData = ApiResponse.data.data;
            setUsersData(userData);
          }
          catch (error) {
            console.log(error.response);
            setErrorMessage('Failed to fetch data, please try again.')
          }
          finally {
            setLoading(false);
          }
        }
    
        fetchUser();
      }, []);

    return(
        <>
        <section className="dashboard-user">
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                {usersData && (
                    <>
                    <div className="user-info">
                        <p>Good to see you, <b>{usersData.name}</b></p>
                        <div className="user-details-container">
                            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? "Hide Details ▲" : "Show Details ▼"}
                            </button>

                            <div 
                                className="user-details-wrapper" 
                                style={{
                                    height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
                                }}
                            >
                                <div className="user-details" ref={contentRef}>
                                    <h2>User Detail</h2>
                                    <p><b>Email:</b> {usersData.email}</p>
                                    <p><b>Phone:</b> {usersData.phone_number}</p>
                                    <p><b>Address:</b> {usersData.address}</p>
                                    <a href="/dashboard/updateprofile"><button className="btn-dash">Update Profile</button></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    </>
                )}

                <div className="dashboard-cards">
                    <div className="card-dash">
                        <h3>View Rooms</h3>
                        <p>Browse available rooms and make a booking.</p>
                        <NavLink to="/rooms" className="btn-dash">View Rooms</NavLink>
                    </div>
                    <div className="card-dash">
                        <h3>Reservations</h3>
                        <p>Check your active and past reservations.</p>
                        <NavLink to="/reservations" className="btn-dash">View Reservations</NavLink>
                    </div>
                    <div className="card-dash">
                        <h3>Transaction History</h3>
                        <p>View your past payment history and invoices.</p>
                        <NavLink to="/transactions" className="btn-dash">View Transactions</NavLink>
                    </div>
                </div>
            </div>
        </section>

        </>
    );
}

export default Dashboard;
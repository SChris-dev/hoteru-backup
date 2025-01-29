import React, { useState, useEffect } from 'react';
import Api from '../../Api';
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {

    const username = localStorage.getItem('hoteru_username');
    const [usersData, setUsersData] = useState([]);
    const [roomsData, setRoomsData] = useState([]);
    const [reservationsData, setReservationsData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [usersRes, roomsRes, reservationsRes, transactionsRes] =
            await Promise.all([
              Api.get("v1/users"),
              Api.get("v1/rooms"),
              Api.get("v1/reservations"),
              Api.get("v1/transaction/all"),
            ]);

          setUsersData(usersRes.data.data); // Users
          setRoomsData(roomsRes.data.rooms); // Rooms
          setReservationsData(reservationsRes.data.data); // Reservations
          setTransactionsData(transactionsRes.data.data); // Transactions
        } catch (error) {
          console.log(error.response);
          setErrorMessage("Failed to fetch data, please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const availableRooms = roomsData.filter(room => room.is_available === true);
    
    const pendingReservations = reservationsData.filter(reservation => reservation.status !== "pending");

    const failedTransactions = transactionsData.filter(transaction => transaction.payment_status !== "pending");


    return (
      <>
        <div className="card-header">
          <h3>Welcome, {username}</h3>
        </div>
        <div className="row">
          <div className="col-lg-3 linking pt-3">
            <NavLink to="../users">
              <div className="card bg-card-1 text-light">
                <div className="card-body">
                  <h3 className="card-title"><b>Users</b></h3>
                  {loading ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h4 className="card-text"><b><i className="fas fa-user"></i> {usersData.length}</b></h4>
                  )}
                </div>
                <div className="card-footer">
                  <i className="fas fa-list"></i> Details
                </div>
              </div>
            </NavLink>
          </div>
    
          <div className="col-lg-3 linking pt-3">
            <NavLink to="../rooms">
              <div className="card bg-card-2 text-light">
                <div className="card-body">
                  <h3 className="card-title"><b>Rooms</b></h3>
                  {loading ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h4 className="card-text">
                      <i className="fas fa-bed fa-xs fa-fw"></i>
                      <b> {availableRooms.length} / {roomsData.length}</b>
                    </h4>
                  )}
                </div>
                <div className="card-footer">
                  <i className="fas fa-list"></i> Details
                </div>
              </div>
            </NavLink>
          </div>
    
          <div className="col-lg-3 linking pt-3">
            <NavLink to="../reservations">
              <div className="card bg-card-3 text-light">
                <div className="card-body">
                  <h3 className="card-title"><b>Reservations</b></h3>
                  {loading ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h4 className="card-text">
                      <i className="fas fa-book-open"></i>
                      <b> {pendingReservations.length} / {reservationsData.length}</b>
                    </h4>
                  )}
                </div>
                <div className="card-footer">
                  <i className="fas fa-list"></i> Details
                </div>
              </div>
            </NavLink>
          </div>
    
          <div className="col-lg-3 linking pt-3">
            <NavLink to="../transactions">
              <div className="card bg-card-4 text-light">
                <div className="card-body">
                  <h3 className="card-title"><b>Transactions</b></h3>
                  {loading ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h4 className="card-text">
                      <i className="fas fa-receipt"></i>
                      <b> {failedTransactions.length} / {transactionsData.length}</b>
                    </h4>
                  )}
                </div>
                <div className="card-footer">
                  <i className="fas fa-list"></i> Details
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </>
    );
      
}

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation
import Api from "../Api";
import "../assets/css/User.css";

const ReservationsHistory = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await Api.get("v1/reservation/user");
                setReservations(response.data.reservations);
            } catch (error) {
                console.log("Error fetching reservations:", error);
                setErrorMessage("Failed to load reservations. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        try {
            await Api.put(`v1/reservation/${id}`);
            setReservations((prevReservations) =>
                prevReservations.map((res) =>
                    res.id === id ? { ...res, status: "cancelled" } : res
                )
            );
        } catch (error) {
            console.log("Error canceling reservation:", error);
            setErrorMessage("Failed to cancel reservation. Please try again.");
        }
    };

    const activeReservations = reservations.filter((res) => res.status === "pending");
    const inactiveReservations = reservations.filter((res) => res.status !== "pending");

    return (
        <div className="reservation-history">
            <section className="reservations">
                <div className="reservations-content">
                    <h1>My Reservations</h1>
                    {loading ? (
                        <p>Loading reservations...</p>
                    ) : (
                        <>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <div className="reservation-section">
                                <h2>Active Reservations</h2>
                                {activeReservations.length > 0 ? (
                                    <ul className="reservation-list">
                                        {activeReservations.map((reservation) => (
                                            <li key={reservation.id} className="reservation-card active">
                                                <p><strong>Room Code:</strong> {reservation.room_code}</p>
                                                <p><strong>Check-in:</strong> {reservation.check_in}</p>
                                                <p><strong>Check-out:</strong> {reservation.check_out}</p>
                                                <p><strong>Status:</strong> {reservation.status}</p>
                                                <p><strong>Notes:</strong> {reservation.notes}</p>
                                                <div className="group-buttons">
                                                    <button className="cancel-btn" onClick={() => handleCancel(reservation.id)}>
                                                        Cancel
                                                    </button>
                                                    <Link className="transaction-btn" to={`/transactions/${reservation.id}`}>
                                                        Complete Transaction
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No active reservations.</p>
                                )}
                            </div>

                            <div className="reservation-section">
                                <h2>Past Reservations</h2>
                                {inactiveReservations.length > 0 ? (
                                    <ul className="reservation-list">
                                        {inactiveReservations.map((reservation) => (
                                            <li key={reservation.id} className="reservation-card inactive">
                                                <p><strong>Room Code:</strong> {reservation.room_code}</p>
                                                <p><strong>Check-in:</strong> {reservation.check_in}</p>
                                                <p><strong>Check-out:</strong> {reservation.check_out}</p>
                                                <p><strong>Status:</strong> {reservation.status}</p>
                                                <p><strong>Notes:</strong> {reservation.notes}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No past reservations.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>

    );
};

export default ReservationsHistory;

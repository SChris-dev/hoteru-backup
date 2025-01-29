import React from 'react';
import Api from "../Api";
import "../assets/css/User.css";

const Reservations = () => {
    return(
        <>
        <section className="reservations">
            <div className="reservations-content">
                <h1>This is reservation Page</h1>
                <p>User can select dates to check in and check out, also add notes.</p>
                <p>The process is finished on BACKEND</p>
                <p>FRONTEND Will be finished soon.</p>
            </div>
        </section>
        </>
    );
}

export default Reservations;
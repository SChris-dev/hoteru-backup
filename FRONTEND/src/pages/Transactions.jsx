import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from "../Api";
import "../assets/css/User.css";

const Transactions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            setErrorMessage("Please select a payment method.");
            return;
        }

        try {
            await Api.post(`v1/transaction/${id}`, { payment_method: paymentMethod });

            navigate('../transactions');
        } catch (error) {
            console.log(error.response);
            if (error.response) {
                const { status, message } = error.response.data;

                if (status === "Unavailable") {
                    setErrorMessage(message);
                } else if (status === "Pending") {
                    setErrorMessage("A transaction already exists but is not complete. Please retry or confirm the payment.");
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
            } else {
                setErrorMessage("Unable to connect with the server. Please try again later.");
            }
        }
    };

    return (
        <section className="transactions-page-first">
            <div className="transactions-content-first">
                <h1>Complete Your Payment</h1>
                <p>Select a payment method and complete your transaction.</p>
                
                <form onSubmit={handlePaymentSubmit}>
                    <label>Choose Payment Method:</label>
                    <select value={paymentMethod} onChange={handlePaymentChange} required>
                        <option value="">-- Select Payment Method --</option>
                        <option value="card">Credit Card</option>
                        <option value="QRIS">QRIS</option>
                        <option value="cash">Pay Upfront</option>
                    </select>

                    <button type="submit" className="btn-pay">Pay Now</button>
                </form>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <p className="admin-note">After you finish your payment process, please contact an Admin for immediate response.</p>
            </div>
        </section>
    );
};

export default Transactions;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For getting the transaction ID from URL
import Api from "../Api";
import "../assets/css/User.css";

const TransactionsDetail = () => {
    const { transactionId } = useParams(); // Extract transaction ID from the URL
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const response = await Api.get(`v1/transaction/get/${transactionId}`);
                setTransaction(response.data.data);
            } catch (error) {
                console.log("Error fetching transaction details:", error);
                setErrorMessage("Failed to load transaction details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [transactionId]);

    if (loading) {
        return <p>Loading transaction details...</p>;
    }

    if (errorMessage) {
        return <p className="error-message">{errorMessage}</p>;
    }

    return (
        <div className="transaction-detail-page">
            <section className="transaction-detail-content">
                <h1>Transaction Details</h1>

                {transaction ? (
                    <div className="transaction-detail-info">
                        <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
                        <p><strong>Reservation ID:</strong> {transaction.reservation_id}</p>
                        <p><strong>Payment Method:</strong> {transaction.payment_method}</p>
                        <p><strong>Amount:</strong> ${transaction.amount}</p>
                        <p><strong>Payment Status:</strong> 
                            <span className={`transaction-status ${transaction.payment_status.toLowerCase()}`}>
                                {transaction.payment_status}
                            </span>
                        </p>
                        <p><strong>Transaction Date:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
                    </div>
                ) : (
                    <p>No transaction details found.</p>
                )}
            </section>
        </div>

    );
};

export default TransactionsDetail;

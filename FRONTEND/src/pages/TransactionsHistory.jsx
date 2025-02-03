import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Use Link for navigation if you want to link to a transaction details page
import Api from "../Api";
import "../assets/css/User.css";

const TransactionsHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await Api.get("v1/transaction/user");
                setTransactions(response.data.transactions);
            } catch (error) {
                console.log("Error fetching transactions:", error);
                setErrorMessage("Failed to load transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleCancel = async (id) => {
        try {
            await Api.put(`v1/transaction/${id}`);
            setTransactions((prevTransactions) =>
                prevTransactions.map((tx) =>
                    tx.id === id ? { ...tx, status: "cancelled" } : tx
                )
            );
        } catch (error) {
            console.log("Error canceling transaction:", error);
            setErrorMessage("Failed to cancel transaction. Please try again.");
        }
    };

    const activeTransactions = transactions.filter((tx) => tx.status === "pending");
    const pastTransactions = transactions.filter((tx) => tx.status !== "pending");

    return (
        <div className="transaction-history">
            <section className="transactions">
                <div className="transactions-content">
                    <h1>My Transactions</h1>
                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : (
                        <>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <div className="transaction-section">
                                <h2>Active Transactions</h2>
                                {activeTransactions.length > 0 ? (
                                    <ul className="transaction-list">
                                        {activeTransactions.map((tx) => (
                                            <li key={tx.id} className="transaction-card active">
                                                <p><strong>Reservation ID:</strong> {tx.reservation_id}</p>
                                                <p><strong>Amount:</strong> Rp.{tx.amount}</p>
                                                <p><strong>Status:</strong> {tx.status}</p>
                                                <div className="group-buttons">
                                                    <button className="cancel-btn" onClick={() => handleCancel(tx.id)}>
                                                        Cancel
                                                    </button>
                                                    {/* If needed, link to transaction details page */}
                                                    <Link className="details-btn" to={`/transactions/details/${tx.id}`}>
                                                        View Details
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No active transactions.</p>
                                )}
                            </div>

                            <div className="transaction-section">
                                <h2>Past Transactions</h2>
                                {pastTransactions.length > 0 ? (
                                    <ul className="transaction-list">
                                        {pastTransactions.map((tx) => (
                                            <li key={tx.id} className="transaction-card inactive">
                                                <p><strong>Reservation ID:</strong> {tx.reservation_id}</p>
                                                <p><strong>Amount:</strong> Rp.{tx.amount}</p>
                                                <p><strong>Status:</strong> {tx.status}</p>
                                                <div className="group-buttons">
                                                    <Link className="details-btn" to={`/transactions/details/${tx.id}`}>
                                                        View Details
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No past transactions.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default TransactionsHistory;

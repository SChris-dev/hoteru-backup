import React, { useEffect, useState } from 'react';
import Api from '../../Api';

const AdminTransactions = () => {

  // fetched transaction data
  const [transactionsData, setTransactionsData] = useState([]);
  
  // search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // fetch edit transaction
  const [editTransactions, setEditTransactions] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchtransactions = async () => {
      try {
        const ApiResponse = await Api.get('v1/transaction/all');

        const transactionsData = ApiResponse.data.data;
        setTransactionsData(transactionsData);
        setFilteredTransactions(transactionsData);
      }
      catch (error) {
        console.log(error.response);
        setErrorMessage('Failed to fetch data, please try again.')
      }
      finally {
        setLoading(false);
      }
    }

    fetchtransactions();
  }, []);

  // handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = transactionsData.filter((transaction) => {
      return (
        transaction.reservation_id.toString().toLowerCase().includes(value) ||
        transaction.status.toLowerCase().includes(value)
      );
    });
  
    setFilteredTransactions(filtered);
  };

  // handle edit
  const handleEditTransaction = (transaction) => {
      setEditTransactions(transaction);
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditTransactions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e, transactionId) => {
    e.preventDefault();
    try {
      await Api.put(`v1/transaction/admin/${transactionId}`, editTransactions);

      setTransactionsData((prevData) => 
        prevData.map((transaction) => 
          transaction.id === transactionId ? { ...transaction, ...editTransactions } : transaction
        )
      );

      const modalElement = document.getElementById('editTransactionModal');
      const modal = new window.bootstrap.Modal(modalElement);
      modal.hide();
      
      setEditTransactions(null);
      setSuccessMessage('Transaction updated successfully!');
      
      try {
        const ApiResponse = await Api.get('v1/transaction/all');

        const transactionsData = ApiResponse.data.data;
        setTransactionsData(transactionsData);
        setFilteredTransactions(transactionsData);
      }
      catch (error) {
        console.log(error.response);
        setErrorMessage('Failed to fetch data, please try again.')
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Failed to update transaction, please try again.');
    }
  };
  
    // handle delete
    const handleDeleteTransaction = async (e, transactionId) => {
      e.preventDefault();
      try {
        // Send the DELETE request to the backend
        await Api.delete(`/v1/transaction/${transactionId}`);
        
        setTransactionsData((prevData) => prevData.filter((transaction) => transaction.id !== transactionId));
        setFilteredTransactions((prevData) => prevData.filter((transaction) => transaction.id !== transactionId));
        
        setSuccessMessage('transaction deleted successfully!');

      } catch (error) {
        console.error("Failed to delete transaction:", error);
        setErrorMessage('Something went wrong.')
      }
    };
  
  const clearMessage = () => {
    setSuccessMessage('');
  }


  return (
    <div className="card">
      <div className="card-header">
        {/* Success message (if any) */}
        {successMessage.length > 0 && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>{successMessage}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={clearMessage}></button>
          </div>
        )}
        {/* Error messages (if any) */}
        {errorMessage.length > 0 && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <ul>
                {errorMessage.split(' | ').map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        <h3>Transactions Table</h3>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-lg-8">
              {/* <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userCreateModal">
                <i className="fas fa-plus"></i> Add
              </button> */}
              <b>Transactions are made by the users.</b>
          </div>
          <div className="col-lg-4">
            <form className="form-inline my-2 my-lg-0 float-right" onSubmit={handleSearch}>
              <div className="container-searching">
                <div className="row justify-content-center align-items-center g-2">
                  <div className="col-lg-10">
                    <input
                      className="form-control mr-sm-2 float-end"
                      type="text"
                      placeholder="Search Reservation ID..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button className="btn btn-primary my-2 my-sm-0 float-end" type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Reservation ID</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.transaction_id}</td>
                  <td>{u.reservation_id}</td>
                  <td>{u.payment_method}</td>
                  <td>{u.amount}</td>
                  <td>{u.payment_status}</td>
                  <td>{new Date(u.created_at).toISOString().split('T')[0]}</td>
                  <td>{new Date(u.updated_at).toISOString().split('T')[0]}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editTransactionModal"
                      onClick={() => handleEditTransaction(u)} 
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target={`#infoModal${u.transaction_id}`}
                    >
                      <i class="fas fa-info-circle    "></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No transactions found.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
        </div>
      </div>

      {/* Edit transaction Modals */}
        <div className="modal fade" id="editTransactionModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editTransactionModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editTransactionModalLabel">Edit transaction</h1>
              </div>
                <div className="modal-body">
                {editTransactions && (
                  <form onSubmit={(e) => handleSubmitEdit(e, editTransactions.transaction_id)}>
                    <div className="mb-3">
                      <label htmlFor="payment_status" className="form-label">Payment Status</label>
                      <select
                        name="payment_status"
                        id="payment_status"
                        className="form-select"
                        defaultValue={editTransactions.payment_status}
                        onChange={handleChangeEdit}
                      >
                        <option value="pending">Pending</option>
                        <option value="successful">Successful</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label"><b>Transaction qualified as successful is the user has done the following steps:</b>
                        <ul>
                          <li>After making the transaction, the user should contact an Admin.</li>
                          <li>Send proof of payment to an Admin within 24 hours (There are exceptions below)</li>
                          <li>Confirming using their credentials (logged in account).</li>
                        </ul>
                      </label>
                    </div>
                    <hr></hr>
                    <div className="mb-3">
                      <label className="form-label"><b>If the user uses credit card / QRIS, make sure that it is legitimate before changing the status to Successful.</b></label>
                    </div>
                    <hr></hr>
                    <div className="mb-3">
                      <label className="form-label"><b>If the user uses cash and the Check In date is in 3 days after they made the transaction, the user should confirm payment to an Admin within 24 hours or the transaction will be cancelled.</b></label>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                      onClick={() => setEditTransactions(null)}>
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                        Save changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      
      {/* delete modal */}
      {transactionsData.map((u) => (
        <div key={u.transaction_id} className="modal fade" id={`infoModal${u.transaction_id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`infoModalLabel${u.id}`} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id={`infoModalLabel${u.transaction_id}`}>Transaction Details</h1>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label">Transaction ID: <b>{u.transaction_id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reservation_id" className="form-label">Reservation ID: <b>{u.reservation_id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="payment_method" className="form-label">Payment Method: <b>{u.payment_method}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount: <b>{u.amount}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="payment_status" className="form-label">Payment Status: <b>{u.payment_status}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="created_at" className="form-label">Created at: <b>{new Date(u.created_at).toISOString().split('T')[0]}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="updated_at" className="form-label">Updated at: <b>{new Date(u.updated_at).toISOString().split('T')[0]}</b></label>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ))}


    </div>
  );
}

export default AdminTransactions;

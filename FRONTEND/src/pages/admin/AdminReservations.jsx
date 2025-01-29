import React, { useEffect, useState } from 'react';
import Api from '../../Api';

const AdminReservations = () => {

  // fetched reservation data
  const [reservationsData, setReservationsData] = useState([]);
  
  // search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReservations, setFilteredReservations] = useState([]);

  // fetch edit reservation
  const [editReservations, setEditReservations] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const ApiResponse = await Api.get('v1/reservations');

        const ReservationsData = ApiResponse.data.data;
        setReservationsData(ReservationsData);
        setFilteredReservations(ReservationsData);
      }
      catch (error) {
        console.log(error.response);
        setErrorMessage('Failed to fetch data, please try again.')
      }
      finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);


  // handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = reservationsData.filter((reservation) => {
      return (
        reservation.user_id.toString().toLowerCase().includes(value) ||
        reservation.status.toLowerCase().includes(value)
      );
    });
  
    setFilteredReservations(filtered);
  };

  // handle edit
  const handleEditReservation = (reservation) => {
      setEditReservations(reservation);
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditReservations((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e, reservationId) => {
    e.preventDefault();
    try {
      await Api.put(`v1/reservation/admin/${reservationId}`, editReservations);

      setReservationsData((prevData) => 
        prevData.map((reservation) => 
          reservation.id === reservationId ? { ...reservation, ...editReservations } : reservation
        )
      );

      const modalElement = document.getElementById('editReservationModal');
      const modal = new window.bootstrap.Modal(modalElement);
      modal.hide();
      
      setEditReservations(null);
      setSuccessMessage('Reservation updated successfully!');
      
      try {
        const ApiResponse = await Api.get('v1/reservations');

        const ReservationsData = ApiResponse.data.data;
        setReservationsData(ReservationsData);
        setFilteredReservations(ReservationsData);
      }
      catch (error) {
        console.log(error.response);
        setErrorMessage('Failed to fetch data, please try again.')
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Failed to update user, please try again.');
    }
  };
  
    // handle delete
    const handleDeleteReservation = async (e, reservationId) => {
      e.preventDefault();
      try {
        // Send the DELETE request to the backend
        await Api.delete(`/v1/reservation/${reservationId}`);
        
        setReservationsData((prevData) => prevData.filter((reservation) => reservation.id !== reservationId));
        setFilteredReservations((prevData) => prevData.filter((reservation) => reservation.id !== reservationId));
        
        setSuccessMessage('Reservation deleted successfully!');

      } catch (error) {
        console.error("Failed to delete reservation:", error);
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

        <h3>Reservations Table</h3>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-lg-8">
              <b>Reservations are made by the users.</b>
          </div>
          <div className="col-lg-4">
            <form className="form-inline my-2 my-lg-0 float-right" onSubmit={handleSearch}>
              <div className="container-searching">
                <div className="row justify-content-center align-items-center g-2">
                  <div className="col-lg-10">
                    <input
                      className="form-control mr-sm-2 float-end"
                      type="text"
                      placeholder="Search User ID..."
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
                <th>User ID</th>
                <th>Room ID</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Notes</th>
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
            ) : filteredReservations && filteredReservations.length > 0 ? (
              filteredReservations.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.id}</td>
                  <td>{u.user_id}</td>
                  <td>{u.room_id}</td>
                  <td>{u.check_in}</td>
                  <td>{u.check_out}</td>
                  <td>{u.total_amount}</td>
                  <td>{u.status}</td>
                  <td>{u.notes}</td>
                  <td>{new Date(u.created_at).toISOString().split('T')[0]}</td>
                  <td>{new Date(u.updated_at).toISOString().split('T')[0]}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editReservationModal"
                      onClick={() => handleEditReservation(u)} 
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#deleteModal${u.id}`}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No Reservations found.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
        </div>
      </div>

      {/* Edit Reservation Modals */}
        <div className="modal fade" id="editReservationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editReservationModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editReservationModalLabel">Edit Reservation</h1>
              </div>
                <div className="modal-body">
                {editReservations && (
                  <form onSubmit={(e) => handleSubmitEdit(e, editReservations.id)}>
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">Status</label>
                      <select
                        name="status"
                        id="status"
                        className="form-select"
                        defaultValue={editReservations.status}
                        onChange={handleChangeEdit}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label"><b>Only Cancel, when the user haven't done the transaction(s) within 24 hour / already cancelled their transaction(s).</b></label>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                      onClick={() => setEditReservations(null)}>
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
      {reservationsData.map((u) => (
        <div key={u.id} className="modal fade" id={`deleteModal${u.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`deleteModalLabel${u.id}`} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id={`deleteModalLabel${u.id}`}>Confirm Delete</h1>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => handleDeleteReservation(e, u.id)}
                >
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label">Reservation ID: <b>{u.id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="user_id" className="form-label">User ID: <b>{u.user_id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="room_id" className="form-label">Room ID: <b>{u.room_id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="check_in" className="form-label">Check In: <b>{u.check_in}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="check_out" className="form-label">Check Out: <b>{u.check_out}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="total_amount" className="form-label">Total Amount: <b>{u.total_amount}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status: <b>{u.status}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Notes: <b>{u.notes}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="created_at" className="form-label">Created at: <b>{new Date(u.created_at).toISOString().split('T')[0]}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="updated_at" className="form-label">Updated at: <b>{new Date(u.updated_at).toISOString().split('T')[0]}</b></label>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
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

export default AdminReservations;

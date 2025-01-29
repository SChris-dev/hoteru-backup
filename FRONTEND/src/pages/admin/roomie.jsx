import React, { useState, useEffect } from 'react';
import Api from '../../Api';

const roomie = () => {
  // Placeholder data for users
  const users = [
    { id: 1, fullName: 'John Doe', email: 'john@example.com', username: 'johndoe', phoneNumber: '1234567890', role: 'admin', createdAt: '2023-01-01', updatedAt: '2023-01-02' },
    { id: 2, fullName: 'Jane Doe', email: 'jane@example.com', username: 'janedoe', phoneNumber: '0987654321', role: 'user', createdAt: '2023-02-01', updatedAt: '2023-02-02' },
  ];

  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const ApiResponse = await Api.get('v1/rooms');

        const roomData = ApiResponse.data.rooms;
        setRoomsData(roomData);
      }
      catch (error) {
        console.log(error.response);
        setErrorMessage('Failed to fetch data, please try again.')
      }
      finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality (you can filter based on `searchQuery`)
  };

  const handleDeleteUser = (userId) => {
    // Delete user logic
  };

  const handleEditUser = (user) => {
    // Edit user logic
  };

  return (
    <div className="card">
      <div className="card-header">
        {/* Success message (if any) */}
        {successMessage.length > 0 && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>{successMessage}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
        {/* Error messages (if any) */}
        {errorMessage.length > 0 && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <ul>
              {errorMessage.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        <h3>Rooms Table</h3>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-lg-8">
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#roomCreateModal">
              <i className="fas fa-plus"></i> Add
            </button>
          </div>
          <div className="col-lg-4">
            <form className="form-inline my-2 my-lg-0 float-right" onSubmit={handleSearch}>
              <div className="container-searching">
                <div className="row justify-content-center align-items-center g-2">
                  <div className="col-lg-10">
                    <input
                      className="form-control mr-sm-2 float-end"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                <th>Room Code</th>
                <th>Room Category</th>
                <th>Price Per Night (Rp.)</th>
                <th>Room State</th>
                <th>Images</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : roomsData && roomsData.length > 0 ? (
              roomsData.map((room, index) => (
                <tr key={room.id}>
                  <td>{index + 1}</td>
                  <td>{room.id}</td>
                  <td>{room.room_code}</td>
                  <td>{room.room_category_id}</td>
                  <td>{room.price_per_night}</td>
                  <td>{room.is_available == true ? 'Available' : 'Unavailable'}</td>
                  <td>
                    {Array.isArray(JSON.parse(room.image_urls)) && JSON.parse(room.image_urls).length > 0 ? (
                      JSON.parse(room.image_urls).map((image, index) => (
                        <img 
                          key={index}
                          src={image}
                          alt={`Room Image ${index + 1}`}
                          style={{ width: '100px', height: 'auto', marginRight: '5px' }}
                        />
                      ))
                    ) : (
                      'No images provided'
                    )}
                  </td>
                  <td>{new Date(room.updated_at).toISOString().split('T')[0]}</td>
                  <td>
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#editModal${room.id}`}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#deleteModal${room.id}`}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No room found.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination (optional) */}
        <div className="pagination">
          {/* Pagination links go here */}
        </div>
      </div>

      {/* Create Room Modal */}
      <div className="modal fade" id="roomCreateModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="roomCreateModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="roomCreateModalLabel">Create Room</h1>
            </div>
            <div className="modal-body">
              <form action="/admin/users">
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">Full Name</label>
                  <input type="text" className="form-control" id="full_name" name="full_name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" name="email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" className="form-control" id="username" name="username" />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" name="password" />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">Phone Number</label>
                  <input type="number" className="form-control" id="phone_number" name="phone_number" />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select name="role" id="role" className="form-select" required>
                    <option value="0" disabled>-- Select Role --</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modals */}
      {users.map((u) => (
        <div key={u.id} className="modal fade" id={`editModal${u.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`editModalLabel${u.id}`} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id={`editModalLabel${u.id}`}>Edit User</h1>
              </div>
              <div className="modal-body">
                <form action={`/admin/users/${u.id}`} method="POST">
                  <div className="mb-3">
                    <label htmlFor="full_name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="full_name" name="full_name" defaultValue={u.fullName} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" defaultValue={u.email} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" defaultValue={u.username} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" defaultValue={u.password} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="phone_number" name="phone_number" defaultValue={u.phoneNumber} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select name="role" id="role" className="form-select" required defaultValue={u.role}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Save changes</button>
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

export default roomie;

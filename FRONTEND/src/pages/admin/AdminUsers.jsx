import React, { useEffect, useState } from 'react';
import Api from '../../Api';

const AdminUsers = () => {

  // fetched user data
  const [usersData, setUsersData] = useState([]);
  
  // search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // create user
  const [createUser, setCreateUser] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: ''
  });

  // fetch edit user
  const [editUser, setEditUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ApiResponse = await Api.get('v1/users');

        const userData = ApiResponse.data.data;
        setUsersData(userData);
        setFilteredUsers(userData);
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

  // create user
  const handleChangeCreate = (e) => {
    setCreateUser({
      ...createUser, [e.target.name]: e.target.value
    })
  }

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/v1/user/create', createUser);

      setUsersData(prevUsers => [...prevUsers, response.data.data]);


      setSuccessMessage('User created successfully!');
      setErrorMessage('');
      try {
        const response = await Api.get('/v1/users');
        const userData = response.data.data;
        setUsersData(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.log(error.response);
      }
    }
    catch (error) {
        console.log(error.response);
        console.log('Error:', error);
        if (error.response) {
            const errors = error.response.data.errors;

            const errorMessages = Object.entries(errors).map(([field, messages]) => {
                return `${field}: ${messages.join(', ')}`;
            });

            setErrorMessage(errorMessages.join(' | '));
        } else {
            setErrorMessage('Unable to connect with the server. Please try again later.');
        }
    }
  }

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();

  };

  // handle edit
  const handleEditUser = (user) => {
      setEditUser(user);
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e, userId) => {
    e.preventDefault();
    try {
      await Api.put(`v1/user/${userId}`, editUser);

      setUsersData((prevData) => 
        prevData.map((user) => 
          user.id === userId ? { ...user, ...editUser } : user
        )
      );

      const modalElement = document.getElementById('editUserModal');
      const modal = new window.bootstrap.Modal(modalElement);
      modal.hide();
      
      setEditUser(null);
      setSuccessMessage('User updated successfully!');
      
      try {
        const response = await Api.get('/v1/users');
        const userData = response.data.data;
        setUsersData(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.log(error.response);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Failed to update user, please try again.');
    }
  };
  
    // handle delete
    const handleDeleteUser = async (e, userId) => {
      e.preventDefault();
      try {
        // Send the DELETE request to the backend
        await Api.delete(`/v1/user/${userId}`);
        
        // Remove the deleted user from the frontend state
        setUsersData((prevData) => prevData.filter((user) => user.id !== userId));
        
        console.log("User deleted successfully!");
        setSuccessMessage('User deleted successfully!');
        try {
          const response = await Api.get('/v1/users');
          const userData = response.data.data;
          setUsersData(userData);
          setFilteredUsers(userData);
        } catch (error) {
          console.log(error.response);
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
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

        <h3>Users Table</h3>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-lg-8">
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userCreateModal">
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
                      type="text"
                      placeholder="Search users..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        const filtered = usersData.filter(user =>
                          user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          user.email.toLowerCase().includes(e.target.value.toLowerCase())
                        );
                        setFilteredUsers(filtered);
                      }}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Address</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone_number}</td>
                  <td>{u.role}</td>
                  <td>{u.address}</td>
                  <td>{new Date(u.created_at).toISOString().split('T')[0]}</td>
                  <td>{new Date(u.updated_at).toISOString().split('T')[0]}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editUserModal"
                      onClick={() => handleEditUser(u)} 
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#deleteModal${u.id}`}
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No users found.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
        </div>
      </div>

      {/* Create User Modal */}
      <div className="modal fade" id="userCreateModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="userCreateModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="userCreateModalLabel">Create User</h1>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmitCreate}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className="form-control" name="name" placeholder='Name'
                  value={createUser.name}
                  onChange={handleChangeCreate}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" placeholder='user@email.com'
                  value={createUser.email}
                  onChange={handleChangeCreate}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" name="password" 
                  value={createUser.password}
                  onChange={handleChangeCreate}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">Phone Number</label>
                  <input type="text" className="form-control" id="phone_number" name="phone_number" placeholder='XXXX-XXXX-XXXX'
                  value={createUser.phone_number}
                  onChange={handleChangeCreate}/>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address (Optional)</label>
                  <input type="text" className="form-control" id="address" name="address" placeholder=''
                  value={createUser.address}
                  onChange={handleChangeCreate}/>
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
        <div className="modal fade" id="editUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="editUserModalLabel">Edit User</h1>
              </div>
                <div className="modal-body">
                {editUser && (
                  <form onSubmit={(e) => handleSubmitEdit(e, editUser.id)}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        defaultValue={editUser.name}
                        onChange={handleChangeEdit}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        defaultValue={editUser.email}
                        onChange={handleChangeEdit}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone_number" className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone_number"
                        name="phone_number"
                        defaultValue={editUser.phone_number}
                        onChange={handleChangeEdit}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">Role</label>
                      <select
                        name="role"
                        id="role"
                        className="form-select"
                        defaultValue={editUser.role}
                        onChange={handleChangeEdit}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        defaultValue={editUser.address}
                        onChange={handleChangeEdit}
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                      onClick={() => setEditUser(null)}>
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
      {usersData.map((u) => (
        <div key={u.id} className="modal fade" id={`deleteModal${u.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`deleteModalLabel${u.id}`} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id={`deleteModalLabel${u.id}`}>Confirm Delete</h1>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => handleDeleteUser(e, u.id)}
                >
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label">User ID: <b>{u.id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name: <b>{u.name}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email: <b>{u.email}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label">Phone Number: <b>{u.phone_number}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role: <b>{u.role}</b></label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address: <b>{u.address}</b></label>
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

export default AdminUsers;

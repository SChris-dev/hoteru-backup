import React, { useEffect, useState } from 'react';
import Api from '../../Api';

const AdminRooms = () => {

  // fetched rooms data
  const [roomsData, setRoomsData] = useState([]);
  
  // search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);

  // create room
  const [createRoom, setCreateRoom] = useState({
    room_code: '',
    room_category_id: 1,
    price_per_night: '',
    is_available: 1,
    images: []
  });

  // fetch edit room
  const [editRoom, setEditRoom] = useState(null);

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
        setFilteredRooms(roomData);
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

  // create room
  const handleChangeCreate = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      setCreateRoom((prev) => ({
        ...prev,
        [name]: files,
      }));
    } else {
      setCreateRoom((prev) => ({
        ...prev,
        [name]: name === 'is_available' ? Number(value) : name === 'room_category_id' ? Number(value) : value,
      }));
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
  
    // Prepare FormData to send the data including files
    const formData = new FormData();
    Object.keys(createRoom).forEach((key) => {
      if (key === 'images') {
        Array.from(createRoom.images).forEach((file) => {
          formData.append('images[]', file); // Append each image to the form data
        });
      } else {
        formData.append(key, createRoom[key]);
      }
    });
  
    try {
      const response = await Api.post('/v1/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Ensure we send form-data
      });
  
      setRoomsData((prevRooms) => [...prevRooms, response.data.room]);
      setSuccessMessage('Room created successfully!');
      setErrorMessage('');
  
      // Fetch the rooms again after creating a new one
      const fetchRoomsResponse = await Api.get('/v1/rooms');
      setRoomsData(fetchRoomsResponse.data.rooms);
      setFilteredRooms(fetchRoomsResponse.data.rooms);
    } catch (error) {
      console.log(error.response);
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
  };

  // handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  
    const filtered = roomsData.filter((room) => {
      const availabilityText = room.is_available === 1 ? 'available' : 'unavailable';
  
      return (
        room.room_code.toLowerCase().includes(value) ||
        availabilityText.includes(value)
      );
    });
  
    setFilteredRooms(filtered);
  };
  

  // handle edit
  const handleEditRoom = (room) => {
      setEditRoom(room);
  };

  const handleChangeEdit = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'images') {
      if (files.length > 0) {
        setEditRoom((prev) => ({
          ...prev,
          [name]: files,
        }));
      } else {
        setEditRoom((prev) => ({
          ...prev,
          [name]: prev.images,
        }));
      }
    } else {
      setEditRoom((prev) => ({
        ...prev,
        [name]: name === 'is_available' ? (value === 'true' ? 1 : 0) : name === 'room_category_id' ? Number(value) : value,
      }));
    }
  };
  
  const handleSubmitEdit = async (e, roomId) => {
    e.preventDefault();
  
    const formData = new FormData();
    
    // Add fields to formData
    formData.append('room_code', editRoom.room_code);
    formData.append('room_category_id', editRoom.room_category_id);
    formData.append('price_per_night', editRoom.price_per_night);
    formData.append('is_available', editRoom.is_available);

    if (editRoom.images && editRoom.images.length > 0) {
      Array.from(editRoom.images).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    formData.append('_method', 'PUT');
  
    try {
      const response = await Api.post(`v1/rooms/${roomId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log('Room updated successfully', response.data);
      setSuccessMessage('Room updated successfully!');
      setErrorMessage('');
  
      const fetchRoomsResponse = await Api.get('/v1/rooms');
      setRoomsData(fetchRoomsResponse.data.rooms);
      setFilteredRooms(fetchRoomsResponse.data.rooms);

    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.errors) {
        const errorMessages = Object.entries(error.response.data.errors).map(
          ([field, messages]) => `${field}: ${messages.join(', ')}`
        );
        setErrorMessage(errorMessages.join(' | '));
      } else {
        setErrorMessage('Failed to update room, please try again.');
      }
    }
  };
  
  
    // handle delete
    const handleDeleteRoom = async (e, roomId) => {
      e.preventDefault();
      try {
        // 1. Delete room from backend
        await Api.delete(`/v1/rooms/${roomId}`);
    
        // 2. Remove from frontend state
        setRoomsData((prevData) => prevData.filter((room) => room.id !== roomId));
        setFilteredRooms((prevData) => prevData.filter((room) => room.id !== roomId));
    
        setSuccessMessage('Room deleted successfully!');
      } catch (error) {
        console.error("Failed to delete room:", error);
        setErrorMessage('Something went wrong.');
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
                      type="text"
                      placeholder="Search rooms..."
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
            ) : filteredRooms && filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
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
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editRoomModal"
                      onClick={() => handleEditRoom(room)} 
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#deleteModal${room.id}`}
                    >
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

        {/* Pagination */}
        <div className="pagination">
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
              <form onSubmit={handleSubmitCreate}>
                <div className="mb-3">
                  <label htmlFor="room_code" className="form-label">Room Code</label>
                  <input type="text" className="form-control" name="room_code" placeholder='XXX'
                  value={createRoom.room_code}
                  onChange={handleChangeCreate}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="room_category_id" className="form-label">Room Category ID</label>
                    <select
                      name="room_category_id"
                      id="room_category_id"
                      className="form-select"
                      value={createRoom.room_category_id}
                      onChange={handleChangeCreate}
                    >
                      <option value="1">[1] Standard (Max cap: 2)</option>
                      <option value="2">[2] Family (Max cap: 5)</option>
                      <option value="3">[3] Solo (Max cap: 1)</option>
                    </select>
                  </div>
                <div className="mb-3">
                  <label htmlFor="price_per_night" className="form-label">Price Per Night</label>
                  <input type="text" className="form-control" id="price_per_night" name="price_per_night" 
                  value={createRoom.price_per_night}
                  onChange={handleChangeCreate}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="is_available" className="form-label">Room State</label>
                    <select
                      name="is_available"
                      id="is_available"
                      className="form-select"
                      value={createRoom.is_available}
                      onChange={handleChangeCreate}
                    >
                      <option value="1">Available</option>
                      <option value="0">Not Available</option>
                    </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="images" className="form-label">Images (Max: 3)</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="images" 
                    name="images" 
                    placeholder=""
                    multiple
                    onChange={handleChangeCreate}
                  />
                  {/* Image Preview Section */}
                  {createRoom.images && Array.from(createRoom.images).map((file, index) => (
                      <div key={index} className="image-preview mt-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="img-thumbnail"
                          width="100"
                          height="100"
                        />
                      </div>
                    ))}
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

      {/* Edit Room Modals */}
      <div className="modal fade" id="editRoomModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editRoomModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editRoomModalLabel">Edit Room</h1>
            </div>
            <div className="modal-body">
              {editRoom && (
                <form onSubmit={(e) => handleSubmitEdit(e, editRoom.id)}>
                  <div className="mb-3">
                    <label htmlFor="room_code" className="form-label">Room Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="room_code"
                      name="room_code"
                      value={editRoom.room_code}
                      onChange={handleChangeEdit}
                      placeholder="XXX"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="room_category_id" className="form-label">Room Category ID</label>
                    <select
                      name="room_category_id"
                      id="room_category_id"
                      className="form-select"
                      value={editRoom.room_category_id}
                      onChange={handleChangeEdit}
                    >
                      <option value="1">[1] Standard (Max cap: 2)</option>
                      <option value="2">[2] Family (Max cap: 5)</option>
                      <option value="3">[3] Solo (Max cap: 1)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price_per_night" className="form-label">Price Per Night</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price_per_night"
                      name="price_per_night"
                      value={editRoom.price_per_night}
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="is_available" className="form-label">Room State</label>
                    <select
                      name="is_available"
                      id="is_available"
                      className="form-select"
                      value={editRoom.is_available}
                      onChange={handleChangeEdit}
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="images" className="form-label">Images (Max: 3)</label>
                    <input
                      type="file"
                      className="form-control"
                      id="images"
                      name="images"
                      multiple
                      onChange={handleChangeEdit}
                    />
                    {/* Image Preview Section */}
                    {editRoom.images && Array.from(editRoom.images).map((file, index) => (
                      <div key={index} className="image-preview mt-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="img-thumbnail"
                          width="100"
                          height="100"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => setEditRoom(null)}>
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
      {roomsData.map((room) => (
        <div key={room.id} className="modal fade" id={`deleteModal${room.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={`deleteModalLabel${room.id}`} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id={`deleteModalLabel${room.id}`}>Confirm Delete</h1>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => handleDeleteRoom(e, room.id)}>
                  <div className="mb-3">
                    <label className="form-label">Room ID: <b>{room.id}</b></label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Room Code: <b>{room.room_code}</b></label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price per Night: <b>{room.price_per_night}</b></label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Room State: <b>{room.is_available ? "Available" : "Unavailable"}</b></label>
                  </div>
                  {room.image_urls && JSON.parse(room.image_urls).length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">Images:</label>
                      <div>
                        {JSON.parse(room.image_urls).map((img, index) => (
                          <img key={index} src={img} alt={`Room Image ${index + 1}`} style={{ width: '100px', height: 'auto', marginRight: '5px' }} />
                        ))}
                      </div>
                    </div>
                  )}
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

export default AdminRooms;

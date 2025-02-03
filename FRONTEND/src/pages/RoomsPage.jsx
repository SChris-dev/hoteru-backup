import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Api from "../Api";
import "../assets/css/User.css";

const RoomsPage = () => {
    const [roomsData, setRoomsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [openIndex, setOpenIndex] = useState(null); // Track which room is expanded
    const contentRef = useRef([]);
    
    const roomTypes = {
        1: "Standard Room",
        2: "Family Room",
        3: "Solo Room"
    };
    

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const ApiResponse = await Api.get("v1/rooms");
                const roomData = ApiResponse.data.rooms;
                setRoomsData(roomData);
            } catch (error) {
                console.error(error.response);
                setErrorMessage("Failed to fetch data, please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, []);

    // Toggle room details
    const toggleDetails = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    return (
        <section className="rooms-selection">
            <h1>Available Rooms</h1>
            {loading ? (
                <p className="loading-message">Loading rooms...</p>
            ) : errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : roomsData.filter(room => room.is_available).length === 0 ? (
                <p className="no-rooms">No available rooms.</p>
            ) : (
                <div className="rooms-grid">
                    {roomsData
                        .filter(room => room.is_available) // Only show available rooms
                        .map((room, index) => {
                            // Parse image_urls string into an array
                            const roomImages = JSON.parse(room.image_urls || "[]");

                            return (
                                <div key={room.id} className="room-card">
                                    {/* Display room images */}
                                    {roomImages.length > 0 ? (
                                        roomImages.map((image, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={image}
                                                alt={`Room ${imgIndex + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "300px",
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <p>No images available</p>
                                    )}

                                    <div className="room-info">
                                        <h3>Room {room.room_code}</h3>
                                        <p>Type: {roomTypes[room.room_category_id] || "Unknown"}</p>
                                        <p>Price: Rp.{room.price_per_night}/night</p>
                                        <button
                                            onClick={() => toggleDetails(index)}
                                            className="toggle-details"
                                        >
                                            {openIndex === index ? "Hide Details ▲" : "Show Details ▼"}
                                        </button>

                                        {/* Collapsible room details */}
                                        <div
                                            className="room-details-wrapper"
                                            style={{
                                                height:
                                                    openIndex === index
                                                        ? `${contentRef.current[index]?.scrollHeight}px`
                                                        : "0px",
                                            }}
                                        >
                                            <div
                                                className="room-details"
                                                ref={(el) => (contentRef.current[index] = el)}
                                            >
                                                <p><b>Status:</b> Available</p>
                                                <p>{room.room_category.description}</p>
                                                <NavLink className="btn-dash" to={`/reservations/${room.id}`}>
                                                    Book This Room!
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}

        </section>
    );
};

export default RoomsPage;

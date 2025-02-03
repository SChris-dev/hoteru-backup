import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import "../assets/css/User.css";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await Api.get("/v1/user/self");
                setUserData(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setErrorMessage("Failed to load user data. Please try again later.");
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.put("/v1/user", userData);
            navigate("/dashboard");
        } catch (error) {
            console.error(error.response);
            setErrorMessage("Failed to update profile. Please try again.");
        }
    };

    return (
        <section className="update-profile-section">
            <div className="update-profile-content">
                <h2>Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Name" 
                        required 
                        className="update-input"
                        value={userData.name}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required 
                        className="update-input"
                        value={userData.email} 
                        onChange={handleChange}
                    />

                    <label htmlFor="phone_number">Phone Number</label>
                    <input 
                        type="text" 
                        name="phone_number" 
                        placeholder="Phone Number" 
                        required 
                        className="update-input"
                        value={userData.phone_number} 
                        onChange={handleChange}
                    />

                    <label htmlFor="address">Address</label>
                    <input 
                        type="text" 
                        name="address" 
                        placeholder="Address" 
                        required 
                        className="update-input"
                        value={userData.address} 
                        onChange={handleChange}
                    />

                    <input 
                        type="submit" 
                        name="submit" 
                        className="update-btn" 
                        value="Update Profile"
                    />
                </form>
                {errorMessage && <p className="update-error-message">{errorMessage}</p>}
            </div>
        </section>

    );
};

export default UpdateProfile;

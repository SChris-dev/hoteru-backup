import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Api from "../Api";
import "../assets/css/User.css";

const Reservations = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const [reservationData, setReservationData] = useState({
        check_in: '',
        check_out: '',
        notes: ''
    });

    const handleChange = (e) => {
        setReservationData({
            ...reservationData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Api.post(`v1/reservation/${id}`, reservationData);

            navigate('../reservations');
        } catch (error) {
            console.log(error.response);
            if (error.response) {
                const { status, message } = error.response.data;
        
                if (status === "Unavailable") {
                    setErrorMessage(message);
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
            } else {
                setErrorMessage("Unable to connect with the server. Please try again later.");
            }
            // console.log('Error:', error);
            // if (error.response) {
            //     const errors = response.data.message;

            //     const errorMessages = Object.entries(errors).map(([field, messages]) => {
            //         return `${field}: ${messages.join(', ')}`;
            //     });

            //     setErrorMessage(errorMessages.join(' | '));
            // } else {
            //     setErrorMessage('Unable to connect with the server. Please try again later.');
            // }
        }
    }

    return(
        <>
        <section className="reservations-first">
            <div className="reservations-content-first">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="check_in">Check In</label>
                    <input type="date" name='check_in' placeholder='Check In Date' required className='date-input'
                    value={reservationData.check_in}
                    onChange={handleChange}/>
                    <label htmlFor="check_out">Check Out</label>
                    <input type="date" name='check_out' placeholder='Check Out Date' required className='date-input'
                    value={reservationData.check_out}
                    onChange={handleChange}/>
                    <label htmlFor="notes">Notes</label>
                    <input type="text" name='notes' placeholder='Leave note for Admin' className='text-input'
                    value={reservationData.notes}
                    onChange={handleChange}/>
                    <input type="submit" name='submit' className='btn-dash'/>
                </form>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
            </div>
        </section>
        </>
    );
}

export default Reservations;
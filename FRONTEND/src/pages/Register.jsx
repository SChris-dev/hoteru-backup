import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../assets/css/Auth.css';

const Register = () => {
    const token = localStorage.getItem('hoteru_login_token');
    const navigate = useNavigate();
    const [message, setMessage] = useState();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    })

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        address: ''
    });

    const handleChange = (e) => {
        setRegisterData({
            ...registerData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!registerData.name || !registerData.email || !registerData.password || !registerData.phone_number ) {
            setMessage('You must fill the necessary fields!');
            return;
        }

        try {
            const response = await Api.post('/v1/auth/register', registerData);

            localStorage.setItem('hoteru_login_token', response.data.token);
            localStorage.setItem('hoteru_username', response.data.name);

            if (response.data.role !== 'admin') {
                navigate('/');
            } else {
                navigate('/admin/dashboard');
            }

        }
        catch (error) {
            console.log(error.response);
            
            if (error.response) {
                if (error.response.data.errors.email[0] === 'The email has already been taken.') {
                    setMessage('Email has been used, try with another Email.');
                }
                else if (error.response.data.errors.phone_number[0] === 'The phone number field format is invalid.') {
                    setMessage('Phone number format is Invalid.');
                }
                else if (error.response.status === 400) {
                    setMessage('Bad request. Please check if your input is appropriate.')
                }
                else {
                    setMessage('Something went wrong. Please try again.')
                }
            }
            else {
                setMessage('Unable to connect with the server. Please try again later.')
            }
        }
    }

    return(
        <>
        <div className="bg-register"></div>
        <section className="register" id="hero">
            <div className="register-content" data-aos="fade-up">
                <form onSubmit={handleSubmit}>
                    <div className="header-card">
                        <h1>Register</h1>
                        <p className='error-message'>{message}</p>
                    </div>
                    <div className="input-card">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input className="form-input" type="text" name='name' placeholder='Enter Full Name / Username' autoFocus
                            value={registerData.name}
                            onChange={handleChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input className="form-input" type="email" name='email' placeholder='example@email.com'
                            value={registerData.email}
                            onChange={handleChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input className="form-input" type="password" name='password' placeholder='Enter Password'
                            value={registerData.password}
                            onChange={handleChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input className="form-input" type="text" name='phone_number' placeholder='08XX-XXXX-XXXX'
                            value={registerData.phone_number}
                            onChange={handleChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea className="form-input" name='address' placeholder='(Optional)' rows='5'
                            value={registerData.address}
                            onChange={handleChange}></textarea>
                        </div>

                    </div>
                    <div className="footer-card">
                        <input className="cta-button" type='submit' name='Submit'/>
                    </div>
                </form>
            </div>
        </section>
        
        </>
    );
}

export default Register;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import '../assets/css/Auth.css';

const Login = () => {
    const token = localStorage.getItem('hoteru_login_token');
    const navigate = useNavigate();
    const [message, setMessage] = useState();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    })

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            setMessage('You must fill the Email and Password field!');
            return;
        }

        try {
            const response = await Api.post('/v1/auth/login', loginData);

            localStorage.setItem('hoteru_login_token', response.data.token);
            localStorage.setItem('hoteru_username', response.data.name);
            localStorage.setItem('hoteru_user_email', response.data.email);

            if (response.data.role !== 'admin') {
                navigate('/');
            } else {
                localStorage.setItem('hoteru_admin_key', response.data.token);
                navigate('/admin/dashboard');
            }

        }
        catch (error) {
            console.log(error.response);
            
            if (error.response) {
                if (error.response.data.message === 'Email not found!') {
                    setMessage('Email does not exist, have you registered?');
                }
                else if (error.response.data.message === 'Incorrect password!') {
                    setMessage('Wrong password!');
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
        <section className="login" id="hero">
            <div className="login-content" data-aos="fade-up">
                <form onSubmit={handleSubmit}>
                    <div className="header-card">
                        <h1>Login</h1>
                        <p className='error-message'>{message}</p>
                    </div>
                    <div className="input-card">
                    <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input className="form-input" type="email" name='email' placeholder='Enter Email'
                            value={loginData.email}
                            onChange={handleChange}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input className="form-input" type="password" name='password' placeholder='Enter Password'
                            value={loginData.password}
                            onChange={handleChange}/>
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

export default Login;
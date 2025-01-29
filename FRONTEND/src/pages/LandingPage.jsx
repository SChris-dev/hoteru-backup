import React, { useEffect } from 'react';
import Hero from '../components/Landing/Hero';
import About from '../components/Landing/About';
import Rooms from '../components/Landing/Rooms';
import Contact from '../components/Landing/Contact';
import '../assets/css/Landing.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const adminKey = localStorage.getItem('hoteru_admin_key');
  const navigate = useNavigate();

  useEffect(() => {
    if (adminKey) {
      navigate('/admin/dashboard');
    }
  }, []);

  return (
    <>
      <div className='landing'>
      <Hero></Hero>
      <About></About>
      <Rooms></Rooms>
      <Contact></Contact>
      </div>
    </>
  );
}

export default LandingPage;
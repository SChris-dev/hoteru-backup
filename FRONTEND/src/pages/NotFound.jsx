import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/NotFound.css';

const NotFoundPage = () => {
  return (
    <>
    <div className='not-found-container'>
        <div className='the-container'>
          <h1>Page Not Found.</h1>
          <br/>
          <p>Oops! It seems the page you're trying to access doesn't exist. Let's get you out from this page.</p>
          <br/>
          <br/>
          <NavLink to='/' className='back'>&#8617; Home</NavLink>
        </div>
    </div>
    </>
  )
}

export default NotFoundPage
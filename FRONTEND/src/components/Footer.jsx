import React from 'react';
import '../assets/css/Footer.css';

function Footer() {
  return (
    <footer className="footer" id='footer'>
      <div className="footer-container">
        <div className="footer-section">
          <h3>Hoteru</h3>
          <p>Experience luxury and comfort at the heart of the city.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/#hero">Home</a></li>
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#rooms">Rooms</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: hoteru@gmail.com</p>
          <p>Phone: +62 771 7749 9999</p>
          <p>Address: Tuban, East Java, Indonesia</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#footer"><i className="fab fa-facebook-f"></i></a>
            <a href="#footer"><i className="fab fa-twitter"></i></a>
            <a href="#footer"><i className="fab fa-instagram"></i></a>
            <a href="#footer"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Hoteru. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

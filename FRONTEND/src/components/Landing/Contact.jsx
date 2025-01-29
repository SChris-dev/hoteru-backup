import React, { useState, useEffect } from 'react';
import '../../assets/css/Landing.css';

function Contact() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  useEffect(() => {
    const storedEmail = localStorage.getItem('hoteru_user_email');
    
    if (storedEmail) {
      setFormData({ email: storedEmail });
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // nanti dimasukin sini API
  };

  return (
    <section className="contact" id='contact'>
    <div data-aos="fade-up">
      <h2>Contact Us</h2>
      <p>Please provide the correct email so that we can reply back to you.</p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder='Your Name'
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder='Your Email'
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message || ''}
            onChange={handleChange}
            placeholder=''
            rows="5"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="submit-button">Send Message</button>
      </form>
    </div>
    </section>
  );
};

export default Contact;

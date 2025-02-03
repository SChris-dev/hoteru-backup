import React from "react";
import '../../assets/css/Landing.css';

const Hero = () => {

    return(
        <section className="hero" id="hero">
            <div className="hero-content" data-aos="fade-up">
                <h1>Experience Elegance & Comfort</h1>
                <p>Discover the perfect blend of luxury and warmth at our hotel, 
                    where every stay is designed to rejuvenate and inspire. 
                    Let us make your next getaway unforgettable.</p>
                <a href="#about" alt="about-us-button" className="cta-button">Learn More!</a>
            </div>
        </section>
    );
};

export default Hero
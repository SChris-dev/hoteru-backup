import React from "react";
import '../../assets/css/Landing.css';
import Carousel from "./Carousel.jsx";

const About = () => {

    const images = [
        "/1.png",
        "/2.png",
        "/3.png",
    ];

    return (
        <section className="about" id="about">
            <div className="about-content" data-aos="fade-up">
                <h2>About Us</h2>
                <p>
                Nestled in the heart of Indonesia, our hotel blends timeless charm with modern luxury. 
                </p>
                <br/>
                <p>
                With elegant rooms, world-class amenities, and a team dedicated to personalized service, 
                we create unforgettable experiences tailored to your every need. 
                Whether you're here for relaxation, adventure, or business, our hotel is your perfect haven.
                </p>
                <br/>
                <br/>
                <a href="#rooms" className="btnAbout">Check out our rooms!</a>
            </div>
            <Carousel images={images} />

        </section>
    );
};

export default About;
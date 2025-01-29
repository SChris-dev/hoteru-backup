import React, { useState, useEffect } from "react";
import '../../assets/css/Landing.css';

const Carousel = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false); // Add pause state

    // function untuk next image
    function nextSlide() {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // function untuk previous image
    function prevSlide() {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // change images otomatis
    useEffect(() => {
        if (!isPaused) {
          const interval = setInterval(() => {
            nextSlide();
          }, 3000);
          return () => clearInterval(interval);
        }
      }, [isPaused, images.length]);

    //   html structure
    return (
        <div data-aos="fade-up" className="carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <button className="carousel-control prev" onClick={prevSlide}>&lt;</button>
          
            <div className="carousel-image" style={{ transform: `translateX(-${currentIndex * 100}%)`}}>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`About-image ${index}`}/>
                ))}
            </div>
          <button className="carousel-control next" onClick={ nextSlide }>&gt;</button>
        </div>
    );
};

export default Carousel;
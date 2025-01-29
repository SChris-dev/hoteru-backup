import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/Landing.css';

const Rooms = () => {
  const rooms = [
    {
      id: 1,
      name: "Family Room",
      description: "Family sized bed, perfect for you and your family.",
      price: "260,000 IDR/night",
      image: "/uploads/4KEE1a1GtxivKqDe1ktGc3sJbmqggPxR4g4dgix7.png"
    },
    {
      id: 2,
      name: "Standard Room",
      description: "Best Seller and Most Popular",
      price: "105,000 IDR/night",
      image: "/uploads/HrDcRkWqNpexMnQFt7Mz5VU6riMO6xQoL2TI5L89.png"
    },
    {
      id: 3,
      name: "Solo Room",
      description: "For business purposes, or simply enjoying the views alone.",
      price: "90,000 IDR/night",
      image: "/uploads/gORrdw28JcXRfvBOBkomnGd6Jo311sFFWKzPewPq.png"
    },
    {
      id: 4,
      name: "Secret Room",
      description: "If you somehow read this, then I have failed in programming.",
      price: "1/night",
      image: "/uploads/4KEE1a1GtxivKqDe1ktGc3sJbmqggPxR4g4dgix7.png"
    },
  ];

  return (
    <section className="rooms" id='rooms'>
      <div data-aos="fade-up">
      <h2>Featured Rooms</h2>
      <div className="rooms-showcase">
        {rooms.slice(0, 3).map((room) => (
          <div key={room.id} className="room-card">
            <img src={room.image} alt={room.name} />
            <div className="room-info">
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <span>{room.price}</span>
            </div>
          </div>
        ))}
      </div>
      <a href="/rooms" className='see-more-button'>See more in details!</a>
      </div>
    </section>
  );
};

export default Rooms;

import React, { useEffect, useState } from 'react';
import './ImageCarousel.css';

const images = [
  '/project_image.webp',
  '/project_image2.jpg',
  '/project_image3.jpg'
];

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4500); // 4.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={images[current]} alt={`Slide ${current + 1}`} className="carousel-image" />
      <div className="carousel-indicators">
        {images.map((_, idx) => (
          <span key={idx} className={current === idx ? 'active' : ''}></span>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

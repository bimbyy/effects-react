import React from 'react';

function Card({ image, alt, style }) {
  return (
    <div style={{ ...style }}>
      <img src={image} alt={alt} style={{ width: '100px', height: 'auto' }} />
    </div>
  );
}

export default Card;
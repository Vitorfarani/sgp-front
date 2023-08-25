import React, { useState, useEffect } from 'react';

const ContainImage = ({ imageUrl }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadImageSize = () => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
      };
    };

    loadImageSize();
  }, [imageUrl]);

  const calculateImageStyle = () => {
    const aspectRatio = imageSize.width / imageSize.height;
    const windowAspectRatio = window.innerWidth / window.innerHeight;

    if (aspectRatio > windowAspectRatio) {
      return { height: '100%', width: 'auto' };
    } else {
      return { width: '100%', height: 'auto' };
    }
  };

  return (
    // <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={imageUrl}
        className='opened-image'
        alt="Image"
        // style={{ ...calculateImageStyle(), objectFit: 'contain' }}
      />
    // </div>
  );
};

export default ContainImage;


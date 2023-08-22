import React, { useState } from 'react';
import { Image, Form } from 'react-bootstrap';

const ThumbnailUploader = ({ url, size = 40, readonly, onImageChange, roundedCircle = true }) => {
  const [selectedImage, setSelectedImage] = useState(url);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      if (!!onImageChange) {
        onImageChange(file);
      }
    }
  };

  return (
    <div style={{ padding: '2px', border: '2px solid grey', width: size + 3, height: size + 3, borderRadius: roundedCircle ? '50%' : null }}>
      <Image
        src={selectedImage}
        alt="Thumbnail"
        style={{
          objectFit: 'cover',
          objectposition: 'center',
          borderRadius: '50%',
          width: '100%',
          height: '100%',
        }}
        onClick={() => !readonly && document.getElementById('imageInput').click()}
      />
      {!readonly && (
        <>
          <Form.Control
            id="imageInput"
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        
        </>
      )}
    </div>
  );
};

export default ThumbnailUploader;

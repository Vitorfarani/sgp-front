import React, { useState } from 'react';
import { Image, Form } from 'react-bootstrap';
import { CircleAvatar } from '..';
import PropTypes from 'prop-types';
import './style.scss'

const ThumbnailUploader = ({ url, size = 40, readonly, onImageChange, roundedCircle = true, placeholder }) => {
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
    <div className="rounded-circle" style={{ width: size + 3, height: size + 3, borderRadius: roundedCircle ? '50%' : null }}>
      {selectedImage ? (
        <Image
          src={selectedImage}
          alt="Thumbnail"
          className="thumbnail-rounded"
          onClick={() => !readonly && document.getElementById('imageInput').click()}
        />
      ) : (
        <CircleAvatar name={placeholder} size={'100%'} sm={size < 40}/>
      )}
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

ThumbnailUploader.propTypes = {
  url: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.number,
  readonly: PropTypes.bool,
  onImageChange: PropTypes.func,
  roundedCircle: PropTypes.bool,
};

export default ThumbnailUploader;

import React, { useRef, useState } from 'react';
import { Image, Form } from 'react-bootstrap';
import { CircleAvatar } from '..';
import PropTypes from 'prop-types';
import './style.scss'
import { validateImageFileType } from '@/utils/helpers/validators';
import { toBase64 } from '@/utils/helpers/format';
import { useTheme } from '@/utils/context/ThemeProvider';
import { FiInfo } from 'react-icons/fi';

const ThumbnailUploader = ({ url, size = 40, readonly, onImageChange, roundedCircle = true, placeholder }) => {
  const [selectedImage, setSelectedImage] = useState(url);
  const {callGlobalAlert} = useTheme();
  const input = useRef()
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // setSelectedImage(URL.createObjectURL(file));
      if (!!onImageChange) {
        if(validateImageFileType(file.name)) {
          toBase64(file).then((base64) => {
            onImageChange(base64)
            setSelectedImage(base64)
          });
        } else {
          callGlobalAlert({icon: FiInfo, message: "Apenas os formatos .jpg .jpeg e .png são permitidos!", color: 'var(--bs-yellow)'})
        }
      }
    }
  };

  return (
    <div className="rounded-circle" style={{ width: size + 3, height: size + 3, borderRadius: roundedCircle ? '50%' : null }}  
    onClick={() => {
      if(!readonly){
        console.log('click')
        input.current.click()

      } 
    }}>
      {selectedImage ? (
        <Image
          src={selectedImage}
          alt="Thumbnail"
          className="thumbnail-rounded"
         
        />
      ) : (
        <CircleAvatar name={placeholder} size={'100%'} sm={size < 40}/>
      )}
      {!readonly && (
        <>
          <Form.Control
            ref={input}
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
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

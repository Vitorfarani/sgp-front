
import React, { memo, useEffect, useRef, useState } from 'react';
import { Image, Form, ProgressBar } from 'react-bootstrap';
import { CircleAvatar } from '..';
import PropTypes from 'prop-types';
import './style.scss'
import { validateImageFileType } from '@/utils/helpers/validators';
import { toBase64 } from '@/utils/helpers/format';
import { useTheme } from '@/utils/context/ThemeProvider';
import { FiInfo } from 'react-icons/fi';
import { isString } from '@/utils/helpers/is';
import { ENV } from '@/constants/ENV';

const ThumbnailUploader = ({ file, size = 40, readonly, noBorder, onImageChange, className, roundedCircle = true, onPress, placeholder = "/assets/standart-icon-user.png" }) => {
  const {callGlobalAlert} = useTheme();
  const input = useRef()
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setshowProgressBar] = useState(false);
  const onProgressExtract = (value) => {
    setProgress(value);
    
  }
  useEffect(() => {
    if(progress == 100) {
      setTimeout(() => {
        setshowProgressBar(false)
        setProgress(0)
      }, 1300)
    }
  }, [progress]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!!onImageChange) {
          setshowProgressBar(true)

          toBase64(file, onProgressExtract).then((base64) => {
            onImageChange({path: base64, filename: file.name, mime_type: file.type, isNew: true})
          });
        } else {
          callGlobalAlert({icon: FiInfo, message: "Apenas os formatos .jpg .jpeg e .png são permitidos!", color: 'var(--bs-yellow)'})
        }
    }
  };
  return (
    <div className={"rounded-circle "+className} style={{ borderRadius: roundedCircle ? '50%' : null, border: noBorder ? 0 : null }}  
      onClick={() => {
        if(!readonly){
          
          input.current.click()
        } else if(!!onPress) {
          onPress()
        }
      }}>
      {!!file ? (
        <Image
        style={{width: size + 3, height: size + 3, marginBottom: 0}}
          src={isString(file) ? file : file.path}
          title={file.filename}
          alt="Thumbnail"
          className="thumbnail-rounded"
         
        />
      ) : (
        <pre className='circle-avatar-rounded' style={{width: size + 3, height: size + 3, marginBottom: 0}}>
          <CircleAvatar name={placeholder} size={'100%'} sm={size < 40}/>
        </pre>
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
       {showProgressBar && (
          <div style={{ position: 'absolute', bottom : -12, width: size +2, left: 2}}>
            <ProgressBar style={{height: 5 }} now={progress} variant={progress === 100 ? 'success' : 'info'} />
        </div>
      )}
    </div>
  );
};

ThumbnailUploader.propTypes = {
  // file: PropTypes.object ?? PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.number,
  readonly: PropTypes.bool,
  onImageChange: PropTypes.func,
  roundedCircle: PropTypes.bool,
};

export default ThumbnailUploader;

import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaFilePdf, FaImage, FaFile } from 'react-icons/fa';
import { ContainImage, Overlay } from '..';
import './style.scss'
import { FiX, FiXCircle } from 'react-icons/fi';

const AnexoItem = ({ title, type, url, onRemove }) => {
  const [imageOpened, setImageOpened] = useState(false);
  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FaFilePdf />;
      case 'image':
        return <FaImage />;
      case 'file':
        return <FaFile />;
      default:
        return <FaFile />;
    }
  };

  const handleImageClick = () => {
    if(!url) return;
    if (type === 'imagem') {
      console.log(url)
      setImageOpened(true)
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      {!!onRemove && (
        <a onClick={onRemove}>
          <FiXCircle color='red' />
        </a>
      )}
      <button type='button' className="anexo-button" onClick={handleImageClick}>

        <div>
          {getIcon(type)}

        </div>
        <div>
          <span title={title ?? type.toUpperCase()}>
            {!!title ? title : type.toUpperCase()}
          </span>
        </div>
      </button>
      {imageOpened && type == 'imagem' && (
        <Overlay onClick={() => setImageOpened(false)}>
          <ContainImage imageUrl={url} />
        </Overlay>
      )}
    </>
  );
};

export default AnexoItem;
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BtnSimple, ThumbnailUploader } from '@/components/index';
import { Stack } from 'react-bootstrap';
import { FiTrash } from 'react-icons/fi';
import { dateEnToPt } from '@/utils/helpers/date';

const CardResponsavel = ({ onOpen, title,thumbnail, subtitle, dataInicio, dataFim, onEdit, onRemove, size = '13rem' }) => {
  return (
    <Card  className='card-responsavel' style={{ }}>
      <Card.Header>
        <Stack 
          onClick={onOpen} 
          direction='horizontal' className="my-auto" gap={2}>
          <ThumbnailUploader size={36} placeholder={title} readonly url={thumbnail}/>
          <Card.Title style={{ fontSize: 16, marginBottom: 0}}>{title}
          {!!subtitle && <span style={{ fontSize: 12, color: 'var(--bs-warning)'}}><br />{"\n"}{subtitle}</span>}
          </Card.Title>
        </Stack>
      {!!onRemove && (
        <a onClick={onRemove} style={{position: 'absolute', right: 10, top: 10}}>
          <FiTrash color='red'/>
        </a>
      )}
      </Card.Header>
      {/* <Card.Body>
        <Card.Text>Início: {dateEnToPt(dataInicio)}</Card.Text>
        <Card.Text>Fim: {dataFim ? dateEnToPt(dataFim) : 'Até o momento'}</Card.Text>
      </Card.Body> */}
      <Card.Body>
        <strong>Desde</strong>
        <p>{dateEnToPt(dataInicio)}</p>
        <strong>Até</strong>
        <p>{dataFim ? dateEnToPt(dataFim) : 'O momento'}</p>
      </Card.Body>
      {!!onEdit && (
        <Card.Footer>
        <BtnSimple onClick={onEdit}>Editar</BtnSimple>
        {/* <Button variant="primary" onClick={onEdit}>Editar</Button>{' '} */}
      </Card.Footer>
      )}
    </Card>
  );
};

export default CardResponsavel;

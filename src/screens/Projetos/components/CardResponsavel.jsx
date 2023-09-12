import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BtnSimple, ThumbnailUploader } from '@/components/index';
import { Stack } from 'react-bootstrap';
import { FiTrash } from 'react-icons/fi';
import { dateEnToPt } from '@/utils/helpers/date';

const CardResponsavel = ({ title, dataInicio, dataFim, onEdit, onRemove, size = '13rem' }) => {
  return (
    <Card  className='card-responsavel' style={{ }}>
      <Card.Header>
        <Stack direction='horizontal' gap={2}>
          <ThumbnailUploader size={36} placeholder={title} />
          <Card.Title style={{ fontSize: 16 }}>{title}</Card.Title>
        </Stack>
        <a onClick={onRemove} style={{position: 'absolute', right: 10, top: 10}}>
          <FiTrash color='red'/>
        </a>
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
      <Card.Footer>
        <BtnSimple onClick={onEdit}>Editar</BtnSimple>
        {/* <Button variant="primary" onClick={onEdit}>Editar</Button>{' '} */}
      </Card.Footer>
    </Card>
  );
};

export default CardResponsavel;

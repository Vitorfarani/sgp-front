import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BtnSimple, ThumbnailUploader } from '@/components/index';
import { Col, Row, Stack } from 'react-bootstrap';
import { FiStar, FiTrash } from 'react-icons/fi';
import { dateEnToPt } from '@/utils/helpers/date';
import { FaStar } from 'react-icons/fa';

const CardSetor = ({ title, dataInicio, dataFim, isMain, onEdit, onRemove, onMainChange, size = '13rem' }) => {
  return (
    <Card className='card-responsavel' style={{flex: '0 0 178px'}}>
      <Card.Header>
        <Row>
          <Col xs={2} md={2}>
            <a onClick={onMainChange}>
              {!isMain ? (
                <FiStar color='var(--bs-body-color)'/>
                ) : (
                <FaStar color='var(--bs-warning)' />
              )}
            </a>
          </Col>
          <Col xs={8} md={8} className='d-flex justify-content-center align-items-center'>
            <Card.Title style={{ fontSize: 16, textAlign: 'center' }}>{title}</Card.Title>
          </Col>

          <Col xs={2} md={2}>
            <a onClick={onRemove}>
              <FiTrash color='red' />
            </a>
          </Col>
        </Row>
      </Card.Header>
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

export default CardSetor;

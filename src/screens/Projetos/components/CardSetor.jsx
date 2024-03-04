import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BtnSimple, ThumbnailUploader } from '@/components/index';
import { Col, Row, Stack } from 'react-bootstrap';
import { FiStar, FiTrash } from 'react-icons/fi';
import { dateEnToPt } from '@/utils/helpers/date';
import { FaStar } from 'react-icons/fa';

const CardSetor = ({ title, dataInicio, dataFim, isMain, historico, onEdit, onRemove, onMainChange, size = '13rem' }) => {
  return (
    <Card className='card-responsavel' style={{}}>
      <Card.Header>
        <Row className="my-auto">
          <Col xs={2} md={2}>
            <a onClick={onMainChange}>
              {!isMain ? (
                <FiStar color='var(--bs-body-color)' />
              ) : (
                <FaStar color='var(--bs-warning)' />
              )}
            </a>
          </Col>
          <Col xs={8} md={8} className='d-flex justify-content-center align-items-center'>
            <Card.Title style={{ fontSize: 16, textAlign: 'center', marginBottom: 0 }}>{title}</Card.Title>
          </Col>
          {!!onRemove && (
            <Col xs={2} md={2}>
              <a onClick={onRemove}>
                <FiTrash color='red' />
              </a>
            </Col>
          )}
        </Row>
      </Card.Header>
      <Card.Body>
        <strong>Desde</strong>
        <p>{dateEnToPt(dataInicio)}</p>
        <strong>Até</strong>
        <p>{dataFim ? dateEnToPt(dataFim) : 'O momento'}</p>
        {!!historico && historico.length > 0 && (
          <>
            <strong>Período Responsável</strong>
            {historico.toReversed().map((item, index) => (
              <div key={index}>
                <p>{dateEnToPt(item.inicio)} ⬌ {item.fim ? dateEnToPt(item.fim) : 'O momento'}</p>
              </div>
            ))}
          </>
        )}
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

export default CardSetor;

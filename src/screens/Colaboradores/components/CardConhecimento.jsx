import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BadgeColor, BtnSimple, PuzzleIcon, ThumbnailUploader } from '@/components/index';
import { Col, Row, Stack } from 'react-bootstrap';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { dateEnToPt } from '@/utils/helpers/date';
import { dot } from '@/components/Selectables/theme';

const CardConhecimento = ({ title, titleColor, nivel, nivelColor, onEdit, onRemove, size = '13rem' }) => {
  return (
    <Card  className='card-conhecimento' style={{ }}>
      <Card.Header>
        <Row className='px-2'>
          <Col className='px-0' xs={1} sm={1} onClick={onEdit}>
            <PuzzleIcon color={nivelColor}/>
          </Col>
          <Col onClick={onEdit}>
            <BadgeColor color={titleColor}>
            {title}
            </BadgeColor>
          </Col>
          <Col xs={1} sm={1}>
            <a onClick={onRemove}>
              <FiTrash color='var(--bs-danger)'/>
            </a>
          </Col>
        </Row>
      </Card.Header>
    </Card>
  );
};

export default CardConhecimento;

import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BtnSimple, ThumbnailUploader } from '@/components/index';
import { Stack } from 'react-bootstrap';
import { FiTrash } from 'react-icons/fi';
import { dateEnToPt } from '@/utils/helpers/date';

const CardResponsavel = ({ onOpen, title, thumbnail, subtitle, dataInicio, dataFim, historico, onEdit, onRemove, isMain, onMainChange, size = '13rem' }) => {
  return (
    <Card className='card-responsavel' style={{}}>
      <Card.Header className={`${!!onMainChange ? 'main-block-change ' : ''} ${isMain ? 'main-block' : ''}`}>
        <Stack
          direction='horizontal' className="my-auto" gap={2}>
          <ThumbnailUploader size={36} placeholder={title} readonly file={thumbnail} onPress={onMainChange} className={`${!!onMainChange ? 'main-can-change ' : ''} ${isMain ? 'yellow-solid' : ''}`} />
          <Card.Title onClick={onOpen} style={{ fontSize: 16, marginBottom: 0 }}>{title}
            {!!subtitle && <span className='setor-responsavel'><br />{"\n"}{subtitle}</span>}
          </Card.Title>
        </Stack>
        {!!onRemove && (
          <a onClick={onRemove} style={{ position: 'absolute', right: 10, top: 10 }}>
            <FiTrash color='red' />
          </a>
        )}
      </Card.Header>
      <Card.Body onClick={onOpen}>
        <strong>Envolvido Desde</strong>
        <p>{dateEnToPt(dataInicio)}</p>
        <strong>Envolvido Até</strong>
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
        </Card.Footer>
      )}
    </Card>
  );
};

export default CardResponsavel;

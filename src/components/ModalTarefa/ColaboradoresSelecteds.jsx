import React, { memo, useState } from 'react';
import { Badge, CloseButton, Col, Container, Row } from 'react-bootstrap';
import './style.scss';
import { HorizontalScrollview, ThumbnailUploader } from '..';
import { useProjetoContext } from '@/screens/Projetos/ProjetoContext';

const ColaboradoresSelecteds = ({ tarefa, onRemove, title, size = 39, alingEnd }) => {
  const { projeto } = useProjetoContext();

  const Colaborador = memo(({ data }) => {
    const [closeShow, setCloseShow] = useState(false);
    return (
      <div
        onClick={() => {
          onRemove(data)
        }}
        title={data.colaborador?.nome + (!!data.colaborador?.setor ? (' - ' + data.colaborador.setor?.nome) : '')}
        onMouseEnter={() => setCloseShow(true)}
        onMouseLeave={() => setCloseShow(false)}
        style={{ display: 'flex', justifyContent: 'center' }} className='me-2 my-1'>
        {closeShow && !!onRemove && <CloseButton style={{ width: 20, position: 'absolute', alignSelf: 'center', borderRadius: 50 }} />}
        <ThumbnailUploader
          size={size}
          readonly
          file={data.colaborador?.user?.thumbnail}
          placeholder={data.colaborador?.nome}
        />
      </div>
    )
  })

  if(!tarefa.tarefa_colaborador) return null
  return (
    <>
    <Row>{(!!tarefa.tarefa_colaborador.length && !!title) && <h6>{title}</h6>}</Row>
    <Row>
      <Col className={`d-flex flex-wrap ${alingEnd ? 'justify-content-end' : ''}`}>
        {tarefa.tarefa_colaborador.map((tc, i) => (
          <Colaborador key={i} data={tc} />
        ))}
      </Col>
    </Row>
    </>
  );
}

export default React.memo(ColaboradoresSelecteds);
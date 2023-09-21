import React, { useState } from 'react';
import { Badge, CloseButton, Col, Container, Row } from 'react-bootstrap';
import './style.scss';
import { HorizontalScrollview, ThumbnailUploader } from '..';
import { useProjetoContext } from '@/screens/Projetos/ProjetoContext';

const ColaboradoresSelecteds = ({ tarefa, onRemove }) => {
  const { projeto } = useProjetoContext();

  const Colaborador = ({ data }) => {
    const [closeShow, setCloseShow] = useState(false);
    return (
      <div
        onClick={() => {
          onRemove(data)
        }}
        title={data.colaborador.nome + (!!data.colaborador.setor ? (' - ' + data.colaborador.setor.nome) : '')}
        onMouseEnter={() => setCloseShow(true)}
        onMouseLeave={() => setCloseShow(false)}
        style={{ display: 'flex', justifyContent: 'center' }} className='mx-2 my-1'>
        {closeShow && <CloseButton style={{ width: 20, position: 'absolute', alignSelf: 'center', borderRadius: 50 }} />}
        <ThumbnailUploader
          size={39}
          readonly
          url={data.colaborador.user?.thumbnail}
          placeholder={data.colaborador.nome}
        />
      </div>
    )
  }

  if(!tarefa.tarefa_colaborador) return null
  return (
    <>
    <Row>{!!tarefa.tarefa_colaborador.length && <h6>Executores</h6>}</Row>
    <Row>
      <Col className='d-flex flex-wrap'>
        {tarefa.tarefa_colaborador.map((tc, i) => (
          <Colaborador key={i} data={tc} />
        ))}
      </Col>
    </Row>
    </>
  );
}

export default React.memo(ColaboradoresSelecteds);
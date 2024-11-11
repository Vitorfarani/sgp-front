import React, { memo, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './style.scss';
import { FaCheckSquare, FaLandmark, FaStop, FaStopCircle, FaStopwatch, FaUsers } from 'react-icons/fa';
import { Col, Form, Overlay, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { ButtonWithPopover, DateInput, SelectAsync, SimpleSelect, ThumbnailUploader } from '..';
import { listColaboradores } from '@/services/colaborador/colaboradores';
import { useProjetoContext } from '@/screens/Projetos/projetoContext';
import { FiClock, FiDroplet, FiPlus, FiStopCircle, FiUser, FiUsers } from 'react-icons/fi';
import moment from 'moment';

const SideButtons = ({ tarefa, addTarefaColaborador, onStart, onEnd, onCreateChecklist, onInterruption, onRestore }) => {
  const { projeto } = useProjetoContext();


  //Ainda não selecionados
  const colaboradoresOptions = useMemo(() => projeto?.projeto_responsavel?.filter((pr, k) => {
    return !tarefa.tarefa_colaborador?.find(tc => pr.responsavel.id === tc.colaborador_id) ?? [];
  }), [tarefa.tarefa_colaborador?.length]);

  const Executores = () => (
    <ButtonWithPopover
      width={400}
      title={'Selecione colaboradores'}
      labelButton="Executores"
      Icon={FiUsers}
    >
      {colaboradoresOptions.map((c, i) => (
        <Row key={Math.random().toString(12)}
          onClick={() => addTarefaColaborador(c.responsavel)}
          className={'colaborador-list-select-popover mb-1 py-2 ' + (i !== colaboradoresOptions.length - 1 ? 'border-bottom' : 'mb-2')}>
          <Col md={'auto'}>
            <ThumbnailUploader
              size={39}
              readonly
              file={c.responsavel.user?.thumbnail}
              placeholder={c.responsavel.nome}
            />
          </Col>
          <Col className="m-auto">
            <strong style={{ fontSize: 16, marginBottom: 0 }}>{c.responsavel.nome}</strong>
          </Col>
        </Row>
      ))}
    </ButtonWithPopover>
  )

  const Interromper = () => {
    const [data, setData] = useState({
      interrompido_motivo: '',
      interrompido_at: null
    });
    return (
      <ButtonWithPopover
        width={400}
        title={'Interrupção'}
        variant={"danger"}
        labelButton="Interromper"
        Icon={FaStopCircle}
      >
        <Form.Group className='mb-4'>
          <Form.Label>Motivo</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={data.interrompido_motivo}
            onChange={({ target: { value } }) => setData(prev => ({
              ...prev,
              ['interrompido_motivo']: value
            }))} />
        </Form.Group>
        <Form.Group className='mb-4'>
          <Form.Label>Data Interrupção</Form.Label>
          <DateInput
            type={"datetime-local"}
            value={data.interrompido_at}
            onChangeValid={date => setData(prev => ({
              ...prev,
              ['interrompido_at']: date
            }))} />
        </Form.Group>
        <Button variant="danger" onClick={() => onInterruption(data)}>
          <FaStopCircle />
          Interromper
        </Button>
      </ButtonWithPopover>
    )
  }

  const Restaurar = () => {
    return (
      <ButtonWithPopover
        width={400}
        title={'Interrompido'}
        variant={"success"}
        labelButton="Restaurar"
        Icon={FaStopCircle}
      >
        <Form.Group className='mb-4'>
          <Form.Label>Motivo</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            readOnly

            value={tarefa.interrompido_motivo}
          />
        </Form.Group>
        <Form.Group className='mb-4'>
          <Form.Label>Data Interrupção</Form.Label>
          <DateInput
            type={"datetime-local"}
            readOnly

            value={tarefa.interrompido_at} />
        </Form.Group>
        <Button variant="success" onClick={() => onRestore()}>
          <FaStopCircle />
          Restaurar
        </Button>
      </ButtonWithPopover>
    )
  }

  if (!tarefa) return null;
  return (
    <ButtonGroup className='sidebuttons-group' vertical>
      {!tarefa.deleted_at ? (
        <>
          <Executores />
          {/* {!!!tarefa.data_inicio_real && (
            <Button variant="warning" onClick={onStart}>
              <FaStopwatch />
              Iniciar
            </Button>
          )}
          {!!!tarefa.data_fim_real && (
            <Button variant="success" onClick={onEnd}>
              <FiDroplet />
              Entregar
            </Button>
          )} */}
          {!!!tarefa.checklist && (
            <Button variant="primary" onClick={onCreateChecklist}>
              <FaCheckSquare />
              Checklist
            </Button>
          )}
          {/* {!!tarefa.id && (
            <Interromper />
          )} */}
        </>
      ) : !!tarefa.id && (
        // <Button variant="success" onClick={onRestore}>
        //       <FaStopCircle />
        //       Restaurar
        //     </Button>
        <Restaurar />
      )}
    </ButtonGroup>
  );
}

export default SideButtons;
import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

export default function TooltipTarefas({ tasks, icon: Icon, type }) {

  const formatTasks = () => {
    if (tasks.length === 0) {
      switch (type) {
        case 'atrasadoTarefa':
          return <div>Não possui tarefas entregues atrasadas</div>;
        case 'naoFinalizadaForaPrazoTarefa':
          return <div>Não possui tarefas não finalizadas fora do prazo</div>;
        default:
          return <div>Não possui tarefas</div>;
      }
    }
    
    return tasks.map((task, index) => (
      <div key={index}>
        Tarefa {index + 1}: {task}
      </div>
    ));
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="tasks-tooltip">{formatTasks()}</Tooltip>}
    >
      <Button variant="secondary">
        <Icon /> {/* Renderiza o ícone dinamicamente */}
      </Button>
    </OverlayTrigger>
  );
}

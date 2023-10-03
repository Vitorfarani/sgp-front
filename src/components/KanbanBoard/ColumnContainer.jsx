import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import TaskCard from "./DraggableCard";
import { FiPlus, FiTrash } from "react-icons/fi";
import "./style.scss"; // Certifique-se de substituir pelo nome real do seu arquivo CSS
import { Badge } from "react-bootstrap";
import DraggableCard from "./DraggableCard";
import { CSS } from "@dnd-kit/utilities";

function ColumnContainer({
  column,
  tasks,
  onAddClick,
  onEditClick,
  disabled
}) {

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: '_' + column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: true,
  });
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="column-container">
      <div className="column-title shadow">
        <div className="d-flex gap-2">
          <Badge>{tasks.length}</Badge> {column.nome}
        </div>
      </div>
      <div className="column-single h-auto overflow-y-auto" style={{ minHeight: 100 }}>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <DraggableCard
              key={task.id}
              disabled={disabled}
              task={task}
              onClick={onEditClick}
            />
          ))}
        </SortableContext>
      </div>
      {!disabled && (
        <button
          className="add-task-button shadow"
          onClick={() => {
            onAddClick(column);
          }}
        >
          <FiPlus />
          <strong> Criar Tarefa</strong>
        </button>

      )}
    </div>
  );
}

export default ColumnContainer;

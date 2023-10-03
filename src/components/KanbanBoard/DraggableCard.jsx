import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiTrash } from "react-icons/fi";
import './style.scss';
import TaskCard from "./TaskCard";

function DraggableCard({ task, onClick,disabled }) {

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: disabled
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };


  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="task-container dragging"
      />
    );
  }

  return (
    <div ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      
      onClick={() => onClick(task)}>
      {!!task && (
        <TaskCard
          data={task}
         ></TaskCard>
      )}
    </div>

  );
}

export default DraggableCard;
{/* <p className="task-content">
        {task.content}
      </p> */}
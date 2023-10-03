import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { FiPlus } from "react-icons/fi";
import './style.scss';
import HorizontalScrollView from "../HorizontalScrollView";
import DraggableCard from "./DraggableCard";

function checkIsColumn(str) {
  if (str.startsWith('_')) {
    return Number(str.substring(1)); // Retorna o restante da string sem o '_'
  } else {
    return false; // Retorna false se não começar com '_'
  }
}
const KanbanBoard = forwardRef(({
  fieldColumnPivot = 'id',
  fieldTaskPivot = 'status_id',
  onAddClick,
  onEditClick,
  disabled,
  onChangeTask
}, ref) => {

  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => '_'+col[fieldColumnPivot]), [columns]);
  const [tasks, setTasks] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const tarefaActive = useRef()
  function handleTasks(task) {
    setTasks(task)
  }

  function handleColumns(column) {
    setColumns(column)
  }
  
  useImperativeHandle(ref, () => ({
    handleColumns,
    handleTasks
  }));


  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  return (
    <div className="wrapper-kanban">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <ColumnContainer
              key={col[fieldColumnPivot]}
              disabled={disabled}
              column={col}
              onAddClick={onAddClick}
              onEditClick={onEditClick}
              tasks={tasks.filter((task) => task[fieldTaskPivot] === col[fieldColumnPivot])}
            />
          ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
              disabled={disabled}

                onAddClick={onAddClick}
                onEditClick={onEditClick}
                tasks={tasks.filter((task) => task[fieldTaskPivot] === activeColumn.id)}
              />
            )}
            {activeTask && (

              <DraggableCard
                task={activeTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>

  );

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
   
    if (!over || disabled) return;
    
    const activeId = active.id;
    const overId = over.id;
    let indexDropped = tasks.filter((task) => task[fieldTaskPivot] === activeTask[fieldTaskPivot]).findIndex(e => e.id === activeTask.id);
    let changed = structuredClone(activeTask);
    changed.order = indexDropped;
    onChangeTask(changed)
    if (activeId === overId) return;
    

    const isActiveAColumn = active.data.current?.type === "Column";
    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveAColumn) return;


    setColumns((columns) => {
      console.log('aa')
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask || disabled) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((_tasks) => {
        const activeIndex = _tasks.findIndex((t) => t.id === activeId);
        const overIndex = _tasks.findIndex((t) => t.id === overId);
        if (_tasks[activeIndex][fieldTaskPivot] != _tasks[overIndex][fieldTaskPivot]) {
          // Fix introduced after video recording
          _tasks[activeIndex][fieldTaskPivot] = _tasks[overIndex][fieldTaskPivot];
          return arrayMove(_tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(_tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((_tasks) => {
        const activeIndex = _tasks.findIndex((t) => t.id === activeId);
        if(checkIsColumn(overId)) {
          _tasks[activeIndex][fieldTaskPivot] = checkIsColumn(overId);
        }
        _tasks[activeIndex].order = activeIndex;

        tarefaActive.current = _tasks[activeIndex]
        return arrayMove(_tasks, activeIndex, activeIndex);
      });
    }
  }

})

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;

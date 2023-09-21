import { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiTrash } from "react-icons/fi";
import './style.scss';
import { Col, Row } from "react-bootstrap";
import { FaAlignLeft, FaCheckSquare } from "react-icons/fa";
import { dateDiffWithLabels } from "@/utils/helpers/date";

function TaskCard({ data, ...props }) {
  const prazoLabels = useMemo(() => {
    return dateDiffWithLabels(data.data_fim_programado, data.data_fim_real)
  }, [data.data_fim_programado, data.data_fim_real]);
  return (
    <div className="task-container">
      <Row>
        <p className="task-content">
          {data.nome}
        </p>
      </Row>
      <Row>
        {data.descricao && <Col md={"auto"}><FaAlignLeft/></Col>}
        {!!data.checklist && <Col md={"auto"}><FaCheckSquare title={data.checklist.filter.length}/></Col>}
        {prazoLabels && <Col md={"auto"}><prazoLabels.Icon title={prazoLabels.label} color={prazoLabels.color}/> </Col>}
      </Row>
    </div>
  );
}

export default TaskCard;

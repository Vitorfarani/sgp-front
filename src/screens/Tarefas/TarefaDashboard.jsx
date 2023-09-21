import { Background, HeaderTitle, Section, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

const MOCK = {

}

export default function TarefasDashBoard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  return (
    <Background>
      <HeaderTitle title="Tarefas dashboard" optionsButtons={[
          {
            label: 'Relatório',
            onClick: () => {},
            icon: FiPlus,
          }
      ]}/>
      <Section>
       
      </Section>
    </Background>
  );
}
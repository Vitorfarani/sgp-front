import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { listGerencias } from "@/services/gerencias";
import { useAuth } from "@/utils/context/AuthProvider";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function Tarefas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filtersState, setFiltersState] = useState({
    search: '',
    perPage: 20,
    selectedRows: [],
    gerencia: null,
    page: 1,
    sortedColumn: 'id',
    sortOrder: 'asc',
  });
  const [debouncedSearch] = useDebounce(filtersState.search, 500);
  const [isLoading, setIsLoading] = useState(false);

  const [collumns, setCollumns] = useState([
    { field: 'id', label: 'ID', order: true, style: { width: 100 } },
    { field: 'name', label: 'Name', order: true },
    { field: 'age', label: 'Age', order: true },
    { field: 'subn', label: 'subn', order: false },
  ]);

  const [rows, setRows] = useState([
    { id: 1, name: 'Alice', age: 25, subn: <FiEdit /> },
    { id: 2, name: 'Bob', age: 32, subn: <FiTrash /> },
    { id: 3, name: 'Charlie', age: 28, subn: true },
    { id: 4, name: 'Charlie', age: 28, subn: true },
    { id: 5, name: 'Charlie', age: 28, subn: true },
    { id: 6, name: 'Charlie', age: 28, subn: true },
    { id: 7, name: 'Charlie', age: 28, subn: true },
    { id: 8, name: 'Charlie', age: 28, subn: true },
    { id: 9, name: 'Charlie', age: 28, subn: true },
    { id: 10, name: 'Charlie', age: 28, subn: true },
    { id: 11, name: 'Charlie', age: 28, subn: true },
    { id: 12, name: 'Charlie', age: 28, subn: true },
    { id: 13, name: 'Charlie', age: 28, subn: true },
    { id: 14, name: 'Charlie', age: 28, subn: true },
    { id: 15, name: 'Charlie', age: 28, subn: true },
    { id: 16, name: 'Charlie', age: 28, subn: true },
    { id: 17, name: 'Charlie', age: 28, subn: true },
    { id: 18, name: 'Charlie', age: 28, subn: true },
    { id: 19, name: 'Charlie', age: 28, subn: true },
    { id: 20, name: 'Charlie', age: 28, subn: true },
  ]);

  function handleForm(propertyName, newValue) {
    setFiltersState((prevState) => ({
      ...prevState,
      [propertyName]: newValue
    }));
  }
return (
  <Background>
    <HeaderTitle title="Tarefas" optionsButtons={[
      {
        label: 'cadastrar',
        onClick: () => console.log('cadastrar'),
        icon: FiPlus,
      },
      // {
      //   label: 'Relatório',
      //   onClick: () => { },
      //   icon: FiPlus,
      // }
    ]} />
    <Section>
      <Table
        columns={collumns}
        rows={rows}
        isLoading={isLoading}
        filtersState={filtersState}
        searchPlaceholder="Pesquisar Tarefa"
        setFiltersState={setFiltersState}
        filtersComponentes={[
          <Col md={3}>
              <SelectAsync
                placeholder="Gerencias"
                loadOptions={listGerencias}
                value={filtersState.gerencia}
                onChange={(gerencia) => handleForm('gerencia', gerencia)}
              />
          </Col>
        ]}
        actions={[
          {
            label: 'Editar',
            onClick: (row) => console.log(row),
            icon: FiEdit,
          },
          {
            label: 'Excluir',
            onClick: (row) => console.log(row),
            icon: FiTrash,
          },
        ]}>
      </Table>
    </Section>
  </Background>
);
}
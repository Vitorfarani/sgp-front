import { Background, HeaderTitle, Section, Table } from "@/components/index";
import { deleteProjeto } from "@/services/projetos";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function Projetos() {
  const navigate = useNavigate();
  const { isLoaded, isLogged } = useAuth();
  const { callGlobalDialog, handleGlobalLoading } = useTheme();
  const [isLoading, setisLoading] = useState(false);

  const [filtersState, setFiltersState] = useState({
    search: '',
    perPage: 20,
    selectedRows: [],
    page: 1,
    sortedColumn: 'nome',
    sortOrder: 'asc',
  });

  const [collumns, setCollumns] = useState([
    { field: 'nome', label: 'Projeto', order: true },
    { field: 'responsavel', label: 'Responsável', order: true },
    { field: 'fase', label: 'Fase', order: true },
    { field: 'situacao', label: 'Situação', order: true },
  ]);

  const [rows, setRows] = useState([
    { id: 1, nome: 'Projeto A', responsavel: 'João', fase: 1, situacao: 0 },
    { id: 2, nome: 'Projeto B', responsavel: 'Maria', fase: 3, situacao: 3 },
    { id: 3, nome: 'Projeto C', responsavel: 'Carlos', fase: 2, situacao: 1 },
    { id: 4, nome: 'Projeto D', responsavel: 'Ana', fase: 4, situacao: 2 },
    { id: 5, nome: 'Projeto E', responsavel: 'Pedro', fase: 1, situacao: 0 },
    { id: 6, nome: 'Projeto F', responsavel: 'Sofia', fase: 3, situacao: 3 },
    { id: 7, nome: 'Projeto G', responsavel: 'Lucas', fase: 2, situacao: 1 },
    { id: 8, nome: 'Projeto H', responsavel: 'Mariana', fase: 4, situacao: 2 },
    { id: 9, nome: 'Projeto I', responsavel: 'Rafael', fase: 1, situacao: 0 },
    { id: 10, nome: 'Projeto J', responsavel: 'Camila', fase: 3, situacao: 3 },
    { id: 11, nome: 'Projeto K', responsavel: 'Gustavo', fase: 2, situacao: 1 },
    { id: 12, nome: 'Projeto L', responsavel: 'Larissa', fase: 4, situacao: 2 },
    { id: 13, nome: 'Projeto M', responsavel: 'Thiago', fase: 1, situacao: 0 },
    { id: 14, nome: 'Projeto N', responsavel: 'Fernanda', fase: 3, situacao: 3 },
    { id: 15, nome: 'Projeto O', responsavel: 'Vitor', fase: 2, situacao: 1 },
    { id: 16, nome: 'Projeto P', responsavel: 'Isabela', fase: 4, situacao: 2 },
    { id: 17, nome: 'Projeto Q', responsavel: 'Eduardo', fase: 1, situacao: 0 },
    { id: 18, nome: 'Projeto R', responsavel: 'Juliana', fase: 3, situacao: 3 },
    { id: 19, nome: 'Projeto S', responsavel: 'Marcelo', fase: 2, situacao: 1 },
    { id: 20, nome: 'Projeto T', responsavel: 'Amanda', fase: 4, situacao: 2 },
    { id: 21, nome: 'Projeto U', responsavel: 'Rodrigo', fase: 1, situacao: 0 },
    { id: 22, nome: 'Projeto V', responsavel: 'Luiza', fase: 3, situacao: 3 },
    { id: 23, nome: 'Projeto W', responsavel: 'Felipe', fase: 2, situacao: 1 },
  ]);

  function handleDelete(row) {
    callGlobalDialog({
      title: 'Excluir Projeto',
      color: 'red',
      subTitle: 'Tem certeza que deseja excluir o projeto <strong>' + row.nome + '</strong>?',
      forms: [
        {
          name: 'compra',
          label: 'compra',
          placeholder: 'compra',
        }
      ],
      labelSuccess: 'Excluir',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        console.log(result)
        handleGlobalLoading.show()
        setTimeout(() => {
          handleGlobalLoading.hide()
        }, 1000);
        // deleteProjeto(row.id)
        //   .catch(() => {
        //   })
      })
      .catch(() => {

      })
  }
  return (
    <Background>
      <HeaderTitle title="Projetos" optionsButtons={[
        {
          label: 'cadastrar',
          onClick: () => navigate('/projetos/cadastrar'),
          icon: FiPlus,
        },
        // {
        //   label: 'Relatório',
        //   onClick: () => {},
        //   icon: FiPlus,
        // }
      ]} />
      <Section>
        <Table
          columns={collumns}
          rows={rows}
          isLoading={isLoading}
          filtersState={filtersState}
          searchPlaceholder="Pesquisar Projeto"
          setFiltersState={setFiltersState}
          actions={[
            {
              label: 'Editar',
              visible: true,
              onClick: (row) => navigate('/projetos/editar/' + row.id),
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              visible: true,
              onClick: (row) => handleDelete(row),
              icon: FiTrash,
            },
          ]}>
        </Table>
      </Section>

    </Background>
  );
}
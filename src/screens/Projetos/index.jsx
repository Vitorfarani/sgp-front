import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { listClientes } from "@/services/clientes";
import { deleteProjeto, listProjetos } from "@/services/projeto/projetos";
import { listSetores } from "@/services/setores";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listTarefas } from "@/services/tarefa/tarefas";
import { Breadcrumb, Button, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { FiEdit, FiEye, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: '',
  sortOrder: 'asc',
  cliente: null,
  setor: null,
};

const columnsFields = [
  { field: 'nome', label: 'Projeto', enabledOrder: true },
  { field: 'cliente', label: 'Cliente', enabledOrder: true, piper: (field) => field ? field.nome : '' },
  { field: 'projeto_setor', label: 'Setor Responsável', enabledOrder: true, piper: (field) => field.find(s => !!s.principal)?.setor.sigla || field[0]?.setor.sigla || '' },
  //{ field: 'cliente_setor', label: 'Setor do Cliente', enabledOrder: true, piper: (field) =>  field.nome},
  { field: 'projeto_fase', label: 'Fase', enabledOrder: true, piper: (field) => field.nome },
  { field: 'projeto_status', label: 'Status', enabledOrder: true, piper: (field) => field.nome }

];

export default function Projetos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();

  const {
    rows,
    columns,
    load,
    filtersState,
    isTableLoading,
    handleChangeFilters,
    resetFilters,
    isEmpty,
  } = useTable(columnsFields, listProjetos, basefilters, (results) => {
    return results.data
  });

  async function handleDelete(row) {
    let tarefas = await listTarefas('?projeto=' + row.id)
    
    
    let subtitle = tarefas.length > 0 ? 'Tem certeza que deseja excluir o projeto <strong>' + row.nome + '</strong>? O projeto possui <strong>' + tarefas.length + '</strong> tarefas' : 'Tem certeza que deseja excluir o projeto <strong>' + row.nome + '</strong>?';


    callGlobalDialog({
        title: 'Excluir Projeto',
        color: 'red',
        subTitle: subtitle,
        forms: [{
            name: 'projectName', 
            label: 'Para excluir, digite o nome do projeto:', 
            placeholder: 'Insira o nome do projeto',
        }, ],
        labelSuccess: 'Excluir',
        labelCancel: 'Cancelar',
    }).then(async(result) => {
        if (result.projectName && result.projectName === row.nome) { 
            handleGlobalLoading.show();
            deleteProjeto(row.id)
                .then(() => {
                    load();
                    handleGlobalLoading.hide();
                    callGlobalNotify({ message: 'Projeto excluído com sucesso', variant: 'success' })
                })
                .catch((error) => {
                    handleGlobalLoading.hide();
                });
        } else {
            callGlobalAlert({ title: 'Erro no Preenchimento do Nome do Projeto', message: 'Projeto não excluído. O nome do projeto inserido não corresponde.', color: 'var(--bs-danger)' })
            handleGlobalLoading.hide();
        }
    }).catch(() => {
        // Handle cancel or other errors
        handleGlobalLoading.hide();
    });
}


  useEffect(() => {
    load();
  }, []);

  return (
    <Background>
      <HeaderTitle title="Projetos" optionsButtons={
        user.nivel_acesso === 2 || user.id === 2 ?
          [{
            label: 'cadastrar',
            onClick: () => navigate('/projetos/cadastrar'),
            icon: FiPlus,
          }]
        :
        []
      } />
      <Section>
        <Table
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          searchPlaceholder="Pesquisar Projeto"
          searchOffiline
          filtersComponentes={
            <>
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                  onChange={(setor) => {
                    handleChangeFilters('setor_id', setor ? setor.id : null);
                  }}
                  isClearable
                />
              </Col>
              <Col md={3}>
                <SelectAsync
                  placeholder="Filtrar por Cliente"
                  loadOptions={(search) => listClientes('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(cliente) => {
                    handleChangeFilters('cliente_id', cliente ? cliente.id : null);
                  }}
                  isClearable
                />
              </Col>
            </>
          }
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Abrir',
              visibled: true,
              onClick: (row) => navigate('/projetos/visualizar/' + row.id),
              icon: FiEye,
            },
            {
              label: 'Excluir',
              visibled: user.nivel_acesso === 2 || user.id === 2,
              onClick: (row) => handleDelete(row),
              icon: FiTrash,
            },
          ]}>
        </Table>
      </Section>

    </Background>
  );
}
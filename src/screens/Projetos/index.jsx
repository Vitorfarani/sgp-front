import { Background, HeaderTitle, Section, Table } from "@/components/index";
import { deleteProjeto, listProjetos } from "@/services/projetos";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Container, Row, Spinner, Stack } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: '',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Projeto', enabledOrder: true },
  { field: 'responsavel', label: 'Responsável', enabledOrder: true, piper: (field) => !!field && field.nome },
  { field: 'fase', label: 'Fase',  enabledOrder: true, piper: (field) =>  !!field && field.nome  },
  { field: 'situacao', label: 'Situação', enabledOrder: true, piper: (field) => !!field && field.nome  }
];

export default function Projetos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert } = useTheme();

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

  function handleDelete(row) {
    callGlobalDialog({
      title: 'Excluir Projeto',
      color: 'red',
      subTitle: 'Tem certeza que deseja excluir o projeto <strong>' + row.nome + '</strong>?',
      forms: [
        {
          name: 'trash',
          label: 'Para excluir digite "excluir projeto"',
          placeholder: '',
        },
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
  
  useEffect(() => {
    load();
  }, []);

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
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          searchPlaceholder="Pesquisar Projeto"
          searchOffiline
          handleFilters={handleChangeFilters}
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
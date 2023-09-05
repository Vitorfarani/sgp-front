import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { standartResponseApiError } from "@/services/index";
import { deleteColaborador, listColaboradores } from "@/services/colaboradores";

const basefilters = {
  // search: '',
  // perPage: 20,
  // selectedRows: [],
  // page: 1,
  // sortedColumn: 'id',
  // sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', order: true, style: { width: 100 } },
  { field: 'pr', label: 'PR', order: false},
  { field: 'email', label: 'Email', order: false },
  { field: 'telefone', label: 'Telefone', order: false, piper: (field) => field},
  { field: 'nascimento', label: 'Idade', order: false, piper: (field) => field },
  { field: 'setor', label: 'Setor', order: false, piper: (field) => !!field ? field.nome : '' },
];

export default function Conhecimentos() {
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
  } = useTable(columnsFields, listColaboradores, basefilters, (results) => {
    return results.data
  });

  function handleDelete(data) {
    callGlobalDialog({
      title: 'Excluir Colaborador',
      subtitle: 'Para confirmar a exclusão digite "<strong>excluir colaborador</strong>"!',
      forms: [
        {
          name: 'confirm',
          required: true,
          label: '',
        },
      ],
      color: 'red',
      labelSuccess: 'Excluir',
      labelCancel: 'Cancelar',
    })
      .then((result) => {
        if(result.confirm !== "excluir colaborador") callGlobalAlert(standartResponseApiError('Confirmação inválida'))
        handleGlobalLoading.show()
         deleteColaborador(data.id)
           .then((result) => {
             callGlobalAlert({title: 'Sucesso', message: 'Conhecimento excluido com sucesso', color: 'green'})
           })
           .catch(() =>
           callGlobalAlert(standartResponseApiError('Erro de comunicação')))
           .finally(handleGlobalLoading.hide)
      })

  }
  useEffect(() => {
    load();
  }, []);

  return (
    <Background>
      <HeaderTitle title="Colaboradores" optionsButtons={[
        {
          label: 'Cadastrar',
          onClick: () => navigate('/colaborador/cadastrar'),
          icon: FiPlus,
        },
      ]} />
      <Section>
        <Table
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          searchPlaceholder="Buscar Colaborador"
          searchOffiline
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                navigate('/colaborador/editar/'+row.id)
              },
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              onClick: handleDelete,
              icon: FiTrash,
            },
          ]}>
        </Table>
      </Section>
    </Background>
  );
}
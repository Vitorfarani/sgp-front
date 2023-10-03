import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { standartResponseApiError } from "@/services/index";
import { deleteColaborador, listColaboradores } from "@/services/colaborador/colaboradores";
import { celularMask } from "@/utils/helpers/mask";
import { dateEnToPt, getIdade } from "@/utils/helpers/date";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  active: true,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true, style: { width: 100 }, piper: (field, row) => !!row.afastamento.length ?   `${field} - afastado` : field},
  { field: 'pr', label: 'PR', enabledOrder: false},
  { field: 'email', label: 'Email', enabledOrder: false },
  { field: 'telefone', label: 'Telefone', enabledOrder: false, piper: (field) => field && celularMask(field)},
  { field: 'nascimento', label: 'Idade', enabledOrder: false, piper: (field) => field && getIdade(field) + ' anos' },
  { field: 'setor', label: 'Setor', enabledOrder: false, piper: (field) => !!field ? field.nome : '' },
];

export default function Conhecimentos() {
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
  } = useTable(columnsFields, listColaboradores, basefilters, (results) => {
    return results.data
  });

  function handleDelete(data) {
    callGlobalDialog({
      title: 'Excluir Colaborador',
      subTitle: 'Para confirmar a exclusão digite "<strong>excluir colaborador</strong>"!',
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
        if(result.confirm !== "excluir colaborador") return callGlobalNotify({message: 'Confirmação inválida', variant: 'warning'})
        handleGlobalLoading.show()
         deleteColaborador(data.id)
           .then((result) => {
            callGlobalNotify({message: result.message, variant: 'danger'})
            load()
           })
           .catch(callGlobalAlert)
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
          onClick: () => navigate('/colaboradores/cadastrar'),
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
                navigate('/colaboradores/editar/'+row.id)
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
import { memo, useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Background, BadgeColor, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { createConhecimentoNivel, deleteConhecimentoNivel, listConhecimentoNivels, updateConhecimentoNivel } from "@/services/conhecimento/conhecimentoNivel";
import useTable from "@/utils/hooks/useTable";
import { conhecimentoNivelSchema } from "./validations";

const basefilters = {
  search: '',
  perPage: 20,
  // selectedRows: [],
  page: 1,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'grau', label: 'Grau', enabledOrder: true },
  { field: 'multiplicador', label: 'Multiplicador', enabledOrder: true },
  { field: 'color', label: 'Color', enabledOrder: false ,piper: (field) => <BadgeColor color={field}>{field ?? "Sem cor"}</BadgeColor>},
];

const cadastroInitialValue = {
  grau: '',
  multiplicador: 1,
  color: '',
};

function ConhecimentoNivel() {
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
  } = useTable(columnsFields, listConhecimentoNivels, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Nível',
      yupSchema: conhecimentoNivelSchema,
      data,
      forms: [
        {
          name: 'grau',
          label: 'Grau',
          placeholder: '',
        },
        {
          name: 'multiplicador',
          label: 'Multiplicador',
          type: 'number',
        },
        {
          name: 'color',
          label: 'Color',
          type: 'color',
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createConhecimentoNivel : updateConhecimentoNivel;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success'})
            resetFilters()
          })
          .catch((erro) => {
            callGlobalAlert(erro)

          })
          .finally(handleGlobalLoading.hide)
      })

  }
  useEffect(() => {
    load();
  }, []);

  return (
    <Background>
      <HeaderTitle title="Nível de conhecimento" optionsButtons={[
        {
          label: 'Cadastrar',
          onClick: () => callModalCadastro(cadastroInitialValue),
          icon: FiPlus,
        },
      ]} />
      <Section>
        <Table
          columns={columns}
          rows={rows}
          isLoading={isTableLoading}
          filtersState={filtersState}
          searchPlaceholder="Pesquisar Nível"
          searchOffiline
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                callModalCadastro(row)
              },
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              onClick: (row) =>{
                 handleGlobalLoading.show()
                  deleteConhecimentoNivel(row.id)
                    .then((result) => {
                      callGlobalNotify({ message: 'Nível excluído com sucesso', variant: 'danger'})
                      load()
                    })
                    .catch(callGlobalAlert)
                    .finally(handleGlobalLoading.hide)
              },
              icon: FiTrash,
            },
          ]}>
        </Table>
      </Section>
    </Background>
  );
}
export default memo(ConhecimentoNivel);
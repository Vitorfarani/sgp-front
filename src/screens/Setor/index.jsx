import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { createSetor, deleteSetor, listSetores, updateSetor } from "@/services/setores";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { setorSchema } from "./validations";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { formatForm } from "@/utils/helpers/forms";
import { Col } from "react-bootstrap";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  subordinacao: null,
  page: 1,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true, style: { width: 300 } },
  { field: 'sigla', label: 'Sigla', enabledOrder: true },
  { field: 'responsavel', label: 'Responsável', enabledOrder: true, piper: (field) => !!field ? field.nome : '' },
  { field: 'subordinacao', label: 'Subordinação', enabledOrder: true, piper: (field) => !!field ? field.sigla : '' },
];

const cadastroInitialValue = {
  nome: '',
  sigla: '',
  responsavel: null,
  setor: null,
};

export default function Setor() {
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
  } = useTable(columnsFields, listSetores, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Setor',
      yupSchema: setorSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: '',
        },
        {
          name: 'sigla',
          label: 'Sigla',
          placeholder: '',
        },
        {
          name: 'responsavel',
          label: 'Responsável',
          type: 'selectAsync',
          loadOptions: listColaboradores
        },
        {
          name: 'subordinacao',
          label: 'Subordinação',
          type: 'selectAsync',
          loadOptions: listSetores
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then((result) => {
        return formatForm(result).rebaseIds(['responsavel', 'subordinacao']).getResult()
      })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createSetor : updateSetor;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success' })
            resetFilters()
            handleGlobalLoading.hide()

          })
          .catch((error) => {
            callGlobalAlert(error)
            handleGlobalLoading.hide()
          })
      })
      .catch(console.log)

  }
  useEffect(() => {
    load();
  }, []);

  return (
    <Background>
      <HeaderTitle title="Setores" optionsButtons={[
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
          searchPlaceholder="Pesquisar Setor"
          filtersComponentes={
            <>
            <Col md={3}>
            <SelectAsync
              placeholder="Subordinados de um setor"
              loadOptions={(search) => listSetores(`?search=${search}`)}
              getOptionLabel={(option) => option.sigla}
              onChange={(setor) => handleChangeFilters('subordinacao', setor.id)} />
            </Col>
            </>
          }
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
              onClick: (row) => {
                handleGlobalLoading.show()
                deleteSetor(row.id)
                  .then((result) => {
                    callGlobalNotify({ message: result.message, variant: 'danger' })
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
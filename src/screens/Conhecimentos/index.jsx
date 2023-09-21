import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { Background, BadgeColor, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import { getDificuldade } from "@/constants/index";
import { createConhecimento, deleteConhecimento, listConhecimentos, updateConhecimento } from "@/services/conhecimento/conhecimentos";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import { formatForm } from "@/utils/helpers/forms";
import useTable from "@/utils/hooks/useTable";
import { conhecimentoSchema } from "./validations";
import { standartResponseApiError } from "@/services/index";
import { listConhecimentoClasses } from "@/services/conhecimento/conhecimentoClasse";
import { listConhecimentoNivels } from "@/services/conhecimento/conhecimentoNivel";

const basefilters = {
  search: '',
  perPage: 20,
  selectedRows: [],
  page: 1,
  sortedColumn: 'id',
  sortOrder: 'asc',
};

const columnsFields = [
  { field: 'nome', label: 'Nome', enabledOrder: true, style: { width: 100 } },
  { field: 'descricao', label: 'Descricão', enabledOrder: true },
  { field: 'dificuldade', label: 'Dificuldade', enabledOrder: true, piper: (field) => getDificuldade(field)},
  { field: 'color', label: 'Color', enabledOrder: true, piper: (field) => <BadgeColor color={field}>{field ?? "sem cor"}</BadgeColor>},
  { field: 'conhecimento_classe', label: 'Classe', enabledOrder: true, piper: (field) =>  !!field && field.nome },
  { field: 'conhecimento_nivel', label: 'Nível', enabledOrder: true, piper: (field) => !!field && field.grau },
];
const cadastroInitialValue = {
  nome: '',
  descricao: '',
  color: null,
  dificuldade: 5,
  conhecimento_classe: null,
  conhecimento_nivel: null,
  link: '',
};

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
  } = useTable(columnsFields, listConhecimentos, basefilters, (results) => {
    return results.data
  });

  function callModalCadastro(data = {}) {
    callGlobalDialog({
      title: 'Novo Conhecimento',
      yupSchema: conhecimentoSchema,
      data,
      forms: [
        {
          name: 'nome',
          label: 'Nome',
          placeholder: 'Javascript , PHP , GIT ...etc',
        },
        {
          name: 'descricao',
          label: 'Descrição',
          placeholder: '',
        },
       
        {
          name: 'dificuldade',
          label: 'Dificuldade',
          type: 'select',
          options: [
            { value: 0, label: 'Muito Fácil' },
            { value: 2.5, label: 'Fácil' },
            { value: 5, label: 'Normal' },
            { value: 7.5, label: 'Difícil' },
            { value: 10, label: 'Muito Difícil' },
          ]
        },
        {
          name: 'color',
          label: 'Color',
          type: 'color',
        },
        {
          name: 'conhecimento_classe',
          label: 'Classe',
          type: 'selectAsync',
          loadOptions: listConhecimentoClasses,
          required: true,
        },
        {
          name: 'conhecimento_nivel',
          label: 'Nível',
          type: 'selectAsync',
          getOptionLabel: (option) => option.grau,
          loadOptions: listConhecimentoNivels
        },
        {
          name: 'link',
          label: 'Link para documentação',
          placeholder: '',
        },
      ],
      labelSucessColor: 'green',
      labelSuccess: 'Salvar',
      labelCancel: 'Cancelar',
    })
      .then((result) => {
        return formatForm(result).rebaseIds(['conhecimento_classe', 'conhecimento_nivel']).trimTextInputs().getResult()
      })
      .then(async (result) => {
        handleGlobalLoading.show()
        let method = !result.id ? createConhecimento : updateConhecimento;
        method(result)
          .then((res) => {
            callGlobalNotify({ message: res.message, variant: 'success' })
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
      <HeaderTitle title="Conhecimentos" optionsButtons={[
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
          searchPlaceholder="Pesquisar Conhecimento"
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
                console.log(row)
                 handleGlobalLoading.show()
                  deleteConhecimento(row.id)
                    .then((result) => {
                      callGlobalAlert({title: 'Sucesso', message: 'Conhecimento excluido com sucesso', color: 'green'})
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
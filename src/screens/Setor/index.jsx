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
import { FaDrawPolygon } from "react-icons/fa";
import SetorTree from "./components/SetorTree";

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
  const [showCanvasTree, setshowCanvasTree] = useState(false);
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();
  const [setoresSimple, setSetoresSimple] = useState();
  const [responsaveisFields, setResponsaveisFields] = useState([{}]); // Estado para armazenar campos dinâmicos

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

  function loadSetores() {
    // handleGlobalLoading.show()
    listSetores()
      .then(setSetoresSimple)
      .catch(callGlobalAlert)
    // .finally(handleGlobalLoading.hide)
  }


  function callModalCadastro(data = {}) {
  
    const addResponsavelField = () => {
      setResponsaveisFields((prevFields) => [...prevFields, {}]); // Adiciona mais um conjunto de campos
    };
  
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
          name: 'dataInicio', 
          label: 'Data Início',
          type: 'date', 
        },
        {
          name: 'dataFim', 
          label: 'Data Fim',
          type: 'date', 
        },
        // Campos dinâmicos para mais responsáveis
        ...responsaveisFields.map((_, index) => ({
          name: `responsavel_${index}`,
          label: `Responsável ${index + 2}`, // Responsável 2, 3, 4, etc.
          type: 'selectAsync',
          loadOptions: listColaboradores
        })),
        ...responsaveisFields.map((_, index) => ({
          name: `dataInicio_${index}`,
          label: `Data Início ${index + 2}`,
          type: 'date', // Campo de data
        })),
        ...responsaveisFields.map((_, index) => ({
          name: `dataFim_${index}`,
          label: `Data Fim ${index + 2}`,
          type: 'date', // Campo de data
        })),
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
      buttons: [
        {
          label: 'Mais responsáveis',
          onClick: addResponsavelField, // Função para adicionar mais campos
        }
      ],
    })
      .then((result) => {
        return formatForm(result).rebaseIds(['responsavel', 'subordinacao']).getResult()
      })
      .then(async (result) => {
        handleGlobalLoading.show();
        let method = !result.id ? createSetor : updateSetor;
        method(result)
          .then((res) => {
            loadSetores();
            callGlobalNotify({ message: res.message, variant: 'success' });
            resetFilters();
            handleGlobalLoading.hide();
          })
          .catch((error) => {
            callGlobalAlert(error);
            handleGlobalLoading.hide();
          });
      })
      .catch(console.log);
  }
  
  useEffect(() => {
    load();
    loadSetores()
  }, []);

  return (
    <Background>
      <HeaderTitle title="Setores" optionsButtons={[
        {
          label: 'Cadastrar',
          onClick: () => callModalCadastro(cadastroInitialValue),
          icon: FiPlus,
        },
        {
          label: 'Ver Organograma desenhado',
          onClick: () => setshowCanvasTree(!showCanvasTree),
          icon: FaDrawPolygon,
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
                  loadOptions={(search) => listSetores('?search=' + search)}
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
      {showCanvasTree && <SetorTree onClose={() => setshowCanvasTree(!showCanvasTree)} data={setoresSimple} />}
    </Background>
  );
}
import { Background, HeaderTitle, Section, SelectAsync, Table, TooltipConhecimentos } from "@/components/index";
import { useAuth } from "@/utils/context/AuthProvider";
import { useTheme } from "@/utils/context/ThemeProvider";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiEdit, FiPlus, FiTrash, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { standartResponseApiError } from "@/services/index";
import { deleteColaborador, listColaboradores } from "@/services/colaborador/colaboradores";
import { celularMask } from "@/utils/helpers/mask";
import { dateEnToPt, getIdade } from "@/utils/helpers/date";
import { listSetores } from "@/services/setores";
import { Col } from "react-bootstrap";
import { listConhecimentos } from "@/services/conhecimento/conhecimentos";
import { listConhecimentoNivels } from "@/services/conhecimento/conhecimentoNivel";
import { FaBrain, FaUserSlash, FaBriefcaseMedical, FaPlaneDeparture } from "react-icons/fa6";

const basefilters = {
  search: '',
  perPage: 100,
  selectedRows: [],
  setor: null,
  page: 1,
  active: true,
  afastado: false,
  sortedColumn: 'id',
  sortOrder: 'asc',
  conhecimento: null,
  conhecimento_nivel: null,
};

const columnsFields = [
  {
    field: 'nome',
    label: 'Nome',
    enabledOrder: true,
    style: { width: 100 },
    piper: (field, row) => {
      // Verifica se o colaborador está ativo (row.active != 0) antes de exibir o ícone
      if (row.active === 0) {
        return field; // Se o colaborador estiver inativo, apenas retorna o nome sem o ícone
      }
  
      // Verificar se há afastamentos e se o afastamento está ativo baseado na data atual
      if (row.afastamento && row.afastamento.length > 0) {
        // Obter o afastamento mais recente
        const ultimoAfastamento = row.afastamento[row.afastamento.length - 1];
        const tipoAfastamento = ultimoAfastamento.tipo_afastamento.nome;
  
        // Verificar se a data atual está dentro do intervalo de início e fim do afastamento
        const dataAtual = new Date();
        const dataInicio = new Date(ultimoAfastamento.inicio);
        const dataFim = new Date(ultimoAfastamento.fim);
  
        // Verifica se a data atual está entre o inicio e o fim do afastamento
        if (dataAtual >= dataInicio && dataAtual <= dataFim) {
          let icon;
  
          // Define o ícone com base no tipo de afastamento
          switch (tipoAfastamento) {
            case 'Licença Médica':
              icon = <FaBriefcaseMedical />;
              break;
            case 'Férias Formais':
              icon = <FaPlaneDeparture />;
              break;
            case 'Férias Informais':
              icon = <FaUserSlash />;
              break;
            default:
              icon = <FaUserSlash />;
              break;
          }
  
          return <>{field} {icon}</>; // Exibe o nome e o ícone
        } else {
          return field; // Se não estiver no intervalo, apenas retorna o nome
        }
      } else {
        return field; // Se não houver afastamento, apenas retorna o nome
      }
    }
  },  
  {
    field: 'afastado',
    label: 'Situação',
    enabledOrder: false,
    piper: (field, row) => {
      // Verifica se o colaborador está inativo (row.active == 0)
      if (row.active === 0) {
        return 'Inativo'; // Se o colaborador estiver inativo, retorna "Inativo"
      }
  
      // Verificar se há afastamento e se está ativo com base na data atual
      if (row.afastamento && row.afastamento.length > 0) {
        // Obter o afastamento mais recente
        const ultimoAfastamento = row.afastamento[row.afastamento.length - 1];
        const tipoAfastamento = ultimoAfastamento.tipo_afastamento.nome;
  
        // Verificar se a data atual está dentro do intervalo de início e fim do afastamento
        const dataAtual = new Date();
        const dataInicio = new Date(ultimoAfastamento.inicio);
        const dataFim = new Date(ultimoAfastamento.fim);
  
        // Verifica se a data atual está entre o inicio e o fim do afastamento
        if (dataAtual >= dataInicio && dataAtual <= dataFim) {
          return tipoAfastamento; // Retorna o tipo de afastamento se estiver no intervalo
        }
      }
  
      // Se não houver afastamento ativo ou o afastamento já passou, retorna "Afastado" ou "Ativo"
      return field ? 'Afastado' : 'Ativo'; // Se houver afastamento ativo, exibe "Afastado", caso contrário "Ativo"
    }
  },  
  { field: 'email', label: 'Email', enabledOrder: false },
  { field: 'telefone', label: 'Telefone', enabledOrder: false, piper: (field) => field && celularMask(field) },
  { field: 'nascimento', label: 'Idade', enabledOrder: false, piper: (field) => field && getIdade(field) + ' anos' },
  { field: 'setor', label: 'Setor', enabledOrder: false, piper: (field) => !!field ? field.sigla : '' },
  { field: 'colaborador_conhecimento', label: 'Conhecimentos', enabledOrder: false, piper: (field, colaborador, filters) => <TooltipConhecimentos colaborador={colaborador} style={{ maxWidth: 300 }} title={<FaBrain></FaBrain>} showOnlyId={filters.conhecimento} /> },
];

export default function Conhecimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();

  const [conhecimento, setConhecimento] = useState(null);
  const [conhecimentoNivel, setConhecimentoNivel] = useState(null);

  console.log(user)

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

  // Filtragem customizada para o filtro "Inativos"
  return results.data.filter(colaborador => {
    if (rows.active === 0) {
      // Quando o filtro é "Inativo", devemos incluir apenas colaboradores inativos e afastados
      return colaborador.active === 0 && colaborador.afastado === 1;
    }
    
    // Caso contrário, aplica a filtragem normal
    return !filtersState.conhecimento || (colaborador.colaborador_conhecimento && colaborador.colaborador_conhecimento.length > 0);
  });
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
        if (result.confirm !== "excluir colaborador") return callGlobalNotify({ message: 'Confirmação inválida', variant: 'warning' })
        handleGlobalLoading.show()
        deleteColaborador(data.id)
          .then((result) => {
            callGlobalNotify({ message: result.message, variant: 'danger' })
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
      <HeaderTitle title="Colaboradores" optionsButtons={
        user.nivel_acesso === 2 ?
          [{
            label: 'Cadastrar',
            onClick: () => navigate('/colaboradores/cadastrar'),
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
          searchPlaceholder="Buscar Colaborador"
          searchOffiline
          filtersComponentes={
            <>
              <Col md={2} style={{
                opacity: filtersState.conhecimento == null ? 0.5 : 1
              }}>
                <SelectAsync
                  placeholder="Filtrar por Nivel"
                  loadOptions={(search) => listConhecimentoNivels('?search=' + search)}
                  getOptionLabel={(option) => option.grau}
                  onChange={(nivel) => {
                    // Resetando o filtro de nível
                    handleChangeFilters('conhecimento_nivel', nivel ? nivel.id : null);
                  }}
                  isDisabled={filtersState.conhecimento == null} // Desabilitando o filtro de nível quando não há conhecimento
                  isClearable
                />
              </Col>

              <Col md={3} >
                <SelectAsync
                  placeholder="Filtrar por Conhecimento"
                  loadOptions={(search) => listConhecimentos('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(conhecimento) => {
                    // Resetando o filtro de conhecimento e nível
                    handleChangeFilters('conhecimento', conhecimento ? conhecimento.id : null);
                    handleChangeFilters('conhecimento_nivel', ''); // Resetando o nível sempre que o conhecimento mudar
                  }}
                  isClearable
                />
              </Col>
              <Col md={2}>
                <SelectAsync
                  placeholder="Filtrar por Setor"
                  loadOptions={(search) => listSetores('?search=' + search)}
                  // getOptionLabel={(option) => option.sigla}
                  getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                  filterOption={({ data }) => {

                    return data.id === user.colaborador.setor_id;

                }}
                  onChange={(setor) => handleChangeFilters('setor', setor ? setor.id : "")}
                  isClearable
                />
              </Col>
            </>
          }
          handleFilters={handleChangeFilters}
          actions={[
            {
              label: 'Editar',
              onClick: (row) => {
                navigate('/colaboradores/editar/' + row.id)
              },
              icon: FiEdit,
            },
            {
              label: 'Excluir',
              visibled: user.nivel_acesso === 2,
              onClick: handleDelete,
              icon: FiTrash,
            },
          ]}>
        </Table>
      </Section>
    </Background>
  );
}
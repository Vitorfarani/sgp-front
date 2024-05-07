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
  perPage: 20,
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
      
      if (row.afastamento && row.afastamento.length > 0 && row.afastado === 1) {
        const ultimoAfastamento = row.afastamento[row.afastamento.length -1]
        const tipoAfastamento = ultimoAfastamento.tipo_afastamento.nome;
        let icon;
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
        return <>{field} {icon}</>;
      } else {
        return field;
      }
    }
  },
  { 
    field: 'afastado', 
    label: 'Situação', 
    enabledOrder: false, 
    piper: (field, row) => {
      if (row.afastamento && row.afastamento.length > 0 && row.afastado === 1) {
        const ultimoAfastamento = row.afastamento[row.afastamento.length - 1];
        const tipoAfastamento = ultimoAfastamento.tipo_afastamento.nome;
        return tipoAfastamento;
      } else {
        return field ? 'Afastado' : 'Ativo';
      }
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
              <Col md={2} style={{ opacity: filtersState.conhecimento == null ? 0.5 : 1 }}>
                <SelectAsync
                  placeholder="Filtrar por Nivel"
                  loadOptions={(search) => listConhecimentoNivels('?search=' + search)}
                  getOptionLabel={(option) => option.grau}
                  onChange={(nivel) => {
                    handleChangeFilters('conhecimento_nivel', nivel ? nivel.id : "");

                  }}
                  isDisabled={filtersState.conhecimento == null}
                  isClearable

                />
              </Col>
              <Col md={2} >
                <SelectAsync
                  placeholder="Filtrar por Conhecimento"
                  loadOptions={(search) => listConhecimentos('?search=' + search)}
                  getOptionLabel={(option) => option.nome}
                  onChange={(conhecimento) => {
                    handleChangeFilters('conhecimento', conhecimento ? conhecimento.id : "");
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
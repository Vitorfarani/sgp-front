import { Background, HeaderTitle, Section, SelectAsync, Table, TooltipPrazo } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetoColaboradoresTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { FcClearFilters } from "react-icons/fc";
import { listProjetos } from "@/services/projeto/projetos";
import { dateDiffWithLabels, dateEnToPtWithHour } from "@/utils/helpers/date";

const basefilters = {
    search: '',
    perPage: 20,
    selectedRows: [],
    page: 1,
    sortedColumn: 'id',
    colaborador: null,
    sortOrder: 'asc',
};

const columnsFields = [
    { field: 'projeto_nome', label: 'Projeto', enabledOrder: true },
    { field: 'projeto_status', label: 'Status do Projeto', enabledOrder: true },
    { field: 'projeto_fase', label: 'Fase do Projeto', enabledOrder: true },
    { field: 'projeto_setor', label: 'Setor do Projeto', enabledOrder: true },
    { field: 'tarefa_nome', label: 'Tarefa', enabledOrder: true },
    { field: 'tarefa_status', label: 'Status da Tarefa' },
    { field: 'inicio_programado', label: 'Inicio Programado' },
    { field: 'fim_programado', label: 'Término Programado' },
    { field: 'inicio_real', label: 'Inicio Real' },
    { field: 'fim_real', label: 'Término Real' },
    { field: 'tarefa_colaborador', label: 'Colaborador(es) da Tarefa' },
    {
        field: 'prazo', label: 'Situação', enabledOrder: false, piper: (value, row) => {
            const { prazo_label } = row;
            return <TooltipPrazo prazoLabels={prazo_label} />;
        },
    },
];

export default function ConsultaColaboradoresPorTarefa() {

    const abreviarStatus = (status, tipo) => {
        const mapeamentoStatus = {
            projeto: {
                'Em Desenvolvimento': 'ED',
                'Em Homologação': 'EH',
                'Em Produção': 'PR',
                'Em Negociação': 'EN',
                'Suspenso': 'SP'
            },
            tarefa: {
                'Em Desenvolvimento': 'ED',
                'Em Homologação': 'EH',
                'Em Produção': 'PR',
                'Em Negociação': 'EN',
                'Suspensa': 'SP',
                'Sustentação': 'ST'
            },
        };
        return mapeamentoStatus[tipo][status] || status;
    };

    const abreviarSetor = (setorArray) => {
        const palavrasSignificativas = ['de', 'e', 'do', 'da', 'dos', 'das']; // Adicione mais palavras se necessário
      
        return setorArray.map((setor) => {
          const palavras = setor.split(' ');
          const abreviatura = palavras
            .filter((palavra) => !palavrasSignificativas.includes(palavra.toLowerCase()))
            .map((palavra) => palavra.charAt(0))
            .join('');
          return abreviatura.toUpperCase();
        });
      };
      
    const {
        rows,
        columns,
        load,
        filtersState,
        isTableLoading,
        handleChangeFilters,
        resetFilters,
        isEmpty,
    } = useTable(columnsFields, listProjetoColaboradoresTarefa, basefilters, (results) => {

        const mappedData = [];

        Object.keys(results).forEach((key) => {
            const projetoData = results[key];
            if (projetoData && Array.isArray(projetoData.projeto)) {
                projetoData.projeto.forEach((projeto) => {
                    const { projeto_nome, projeto_status, projeto_fase, projeto_setor, tarefas } = projeto;

                    if (tarefas && Array.isArray(tarefas)) {
                        tarefas.forEach((tarefa) => {
                            const {
                                tarefa_nome,
                                inicio_programado,
                                fim_programado,
                                inicio_real,
                                fim_real,
                                tarefa_status,
                                tarefa_colaborador,
                            } = tarefa;

                            const prazoLabels = dateDiffWithLabels(fim_programado, fim_real);

                            const inicio_programado_pt = inicio_programado !== "N/D" ? dateEnToPtWithHour(inicio_programado) : inicio_programado;
                            const fim_programado_pt = fim_programado !== "N/D" ? dateEnToPtWithHour(fim_programado) : fim_programado;
                            const inicio_real_pt = inicio_real !== "N/D" ? dateEnToPtWithHour(inicio_real) : inicio_real;
                            const fim_real_pt = fim_real !== "N/D" ? dateEnToPtWithHour(fim_real) : fim_real;

                            // Abrevia os status usando a função
                            const projeto_status_abreviado = abreviarStatus(projeto_status, 'projeto');
                            const tarefa_status_abreviado = abreviarStatus(tarefa_status, 'tarefa');

                            const projeto_setor_abreviado = abreviarSetor(projeto_setor)

                            mappedData.push({
                                projeto_nome,
                                projeto_status: projeto_status_abreviado,
                                projeto_fase,
                                projeto_setor: projeto_setor_abreviado.join(', '),
                                tarefa_nome: tarefa_nome || '',
                                inicio_programado: inicio_programado_pt || '',
                                fim_programado: fim_programado_pt || '',
                                inicio_real: inicio_real_pt || '',
                                fim_real: fim_real_pt || '',
                                tarefa_status: tarefa_status_abreviado || '',
                                tarefa_colaborador: Array.isArray(tarefa_colaborador)
                                    ? tarefa_colaborador.join(', ')
                                    : '',
                                prazo_label: prazoLabels,

                            });
                        });
                    }
                });
            }
        });


        let filteredData = [...mappedData];

        let sortedData = [...filteredData];

        if (
            filtersState.sortedColumn &&
            filtersState.sortOrder &&
            sortedData.length > 0 &&
            sortedData[0][filtersState.sortedColumn]
        ) {
            sortedData = sortedData.sort((a, b) => {
                const fieldA = a[filtersState.sortedColumn];
                const fieldB = b[filtersState.sortedColumn];

                if (filtersState.sortOrder === 'asc') {
                    return fieldA.localeCompare(fieldB);
                } else {
                    return fieldB.localeCompare(fieldA);
                }
            });
        }


        sortedData = sortedData.filter((item) =>
            item.projeto_nome.toLowerCase().includes(filtersState.search.toLowerCase())
        );

        return sortedData;

    });


    useEffect(() => {
        load();
    }, []);

    return (
        <Background>
            <HeaderTitle
                title="Consultar Tarefas dos Projetos por Colaborador" />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    //searchPlaceholder="Consultar Projetos"
                    filtersComponentes={
                        <>
                            <Col md={2} >
                                <SelectAsync
                                    placeholder="Filtrar por Projeto"
                                    loadOptions={(search) => listProjetos('?search=' + search)}
                                    getOptionLabel={(option) => option.nome}
                                    onChange={(projeto) => {
                                        handleChangeFilters('projeto_id', projeto ? projeto.id : null);
                                    }}
                                    isClearable
                                />
                            </Col>
                        </>
                    }
                    handleFilters={handleChangeFilters}
                />
            </Section>
        </Background>
    );
}
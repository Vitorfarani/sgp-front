import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetoColaboradoresTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { FcClearFilters } from "react-icons/fc";
import { listProjetos } from "@/services/projeto/projetos";


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
];

export default function ConsultaColaboradoresPorTarefa() {
    const [selectedProjeto, setSelectedProjeto] = useState(null);
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
        console.log('Results:', results); // Log the results to check if data is received

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

                            mappedData.push({
                                projeto_nome,
                                projeto_status,
                                projeto_fase,
                                projeto_setor: projeto_setor.join(', '),
                                tarefa_nome: tarefa_nome || '',
                                inicio_programado: inicio_programado || '',
                                fim_programado: fim_programado || '',
                                inicio_real: inicio_real || '',
                                fim_real: fim_real || '',
                                tarefa_status: tarefa_status || '',
                                tarefa_colaborador: Array.isArray(tarefa_colaborador)
                                    ? tarefa_colaborador.join(', ')
                                    : '',
                            });
                        });
                    }
                });
            }
        });


        let filteredData = [...mappedData];
    
        let sortedData = [...filteredData];

    
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
                title="Consultar Colaboradores Por Tarefas" />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    searchPlaceholder="Consultar Projetos"
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
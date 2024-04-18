import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState, useMemo } from "react";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listProjetos } from "@/services/projeto/projetos";
import { listTarefasPorAgrupamento } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { DateTest } from "@/components/index";
import {FiEye, FiEyeOff } from 'react-icons/fi';

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
    { field: 'inicio_fim_antes_periodo_no_prazo', label: 'Iní./Fim Antes do Per. (No Prz)'},
    { field: 'inicio_fim_antes_periodo_em_atraso', label: 'Iní./Fim Antes do Per. (Atrsd)'},
    { field: 'inicio_antes_fim_no_periodo_no_prazo', label: 'Iní. Antes e Fim no Per. (No Prz)'},
    { field: 'inicio_antes_fim_no_periodo_em_atraso', label: 'Iní. Antes e Fim no Per. (Atrsd)'},
    { field: 'inicio_antes_fim_apos_periodo_no_prazo', label: 'Iní. Antes e Fim Após o Per. (No Prz)'},
    { field: 'inicio_antes_fim_apos_periodo_em_atraso', label: 'Iní. Antes e Fim Após o Per. (Atrsd)'},
    { field: 'inicio_antes_periodo_nao_finalizada_no_prazo', label: 'Iní. Antes do Per., Ñ Finalizada (No Prz)'},
    { field: 'inicio_antes_periodo_nao_finalizada_em_atraso', label: 'Iní. Antes do Per., Ñ Finalizada (Atrsd)'},
    { field: 'inicio_fim_no_periodo_no_prazo', label: 'Iní./Fim no Per. (No Prz)'},
    { field: 'inicio_fim_no_periodo_em_atraso', label: 'Iní./Fim no Per. (Atrsd)'},
    { field: 'inicio_fim_apos_periodo_no_prazo', label: 'Iní./Fim Após o Per. (No Prz)'},
    { field: 'inicio_fim_apos_periodo_em_atraso', label: 'Ini e Fim Após o Per. (Atrsd)'},
    { field: 'inicio_periodo_nao_finalizada_no_prazo', label: 'Iní. no Per. Ñ Finalizada (No Prz)'},
    { field: 'inicio_periodo_nao_finalizada_em_atraso', label: 'Iní. no Per. Ñ Finalizada (Atrsd)'},
    { field: 'nao_iniciada', label: 'Ñ Iniciada'},
    //{ field: 'total_ini_fim_antes_periodo_prazo', label: 'Tot. Iní./Fim Antes do Per. (no Prz)'},
    //{ field: 'total_ini_fim_antes_periodo_atraso', label: 'Tot. Iní./Fim Antes do Per. (Atrsd)'},
    //{ field: 'total_ini_fim_no_periodo_prazo', label: 'Tot. Iní./Fim no Per. (no Prz)'},
    //{ field: 'total_ini_fim_no_periodo_atraso', label: 'Tot. Iní./Fim no Per. (Atrsd)'},
    { field: 'total_no_prazo', label: 'Tot. (no Prz)'},
    { field: 'total_em_atraso', label: 'Tot. (Atrsd)'}
];

export default function ConsultaQuantidadeTarefa() {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [showHiddenColumns, setShowHiddenColumns] = useState(false);

    const {
        rows,
        columns,
        load,
        filtersState,
        isTableLoading,
        handleChangeFilters,
        resetFilters,
        isEmpty,
    } = useTable(columnsFields, listTarefasPorAgrupamento, basefilters, (results) => {
        if (!results || Object.keys(results).length === 0) {
            return [];
        }
        const mappedData = {
            inicio_fim_antes_periodo_no_prazo: results.inicio_fim_antes_periodo ? results.inicio_fim_antes_periodo.no_prazo : 0,
            inicio_fim_antes_periodo_em_atraso: results.inicio_fim_antes_periodo ? results.inicio_fim_antes_periodo.em_atraso : 0,
            inicio_antes_fim_no_periodo_no_prazo: results.inicio_antes_fim_no_periodo ? results.inicio_antes_fim_no_periodo.no_prazo : 0,
            inicio_antes_fim_no_periodo_em_atraso: results.inicio_antes_fim_no_periodo ? results.inicio_antes_fim_no_periodo.em_atraso : 0,
            inicio_antes_fim_apos_periodo_no_prazo: results.inicio_antes_fim_apos_periodo ? results.inicio_antes_fim_apos_periodo.no_prazo : 0,
            inicio_antes_fim_apos_periodo_em_atraso: results.inicio_antes_fim_apos_periodo ? results.inicio_antes_fim_apos_periodo.em_atraso : 0,
            inicio_antes_periodo_nao_finalizada_no_prazo: results.inicio_antes_periodo_nao_finalizada ? results.inicio_antes_periodo_nao_finalizada.no_prazo : 0,
            inicio_antes_periodo_nao_finalizada_em_atraso: results.inicio_antes_periodo_nao_finalizada ? results.inicio_antes_periodo_nao_finalizada.em_atraso : 0,
            inicio_fim_no_periodo_no_prazo: results.inicio_fim_no_periodo ? results.inicio_fim_no_periodo.no_prazo : 0,
            inicio_fim_no_periodo_em_atraso: results.inicio_fim_no_periodo ? results.inicio_fim_no_periodo.em_atraso : 0,
            inicio_fim_apos_periodo_no_prazo: results.inicio_fim_apos_periodo ? results.inicio_fim_apos_periodo.no_prazo : 0,
            inicio_fim_apos_periodo_em_atraso: results.inicio_fim_apos_periodo ? results.inicio_fim_apos_periodo.em_atraso : 0,
            inicio_periodo_nao_finalizada_no_prazo: results.inicio_periodo_nao_finalizada ? results.inicio_periodo_nao_finalizada.no_prazo : 0,
            inicio_periodo_nao_finalizada_em_atraso: results.inicio_periodo_nao_finalizada ? results.inicio_periodo_nao_finalizada.em_atraso : 0,
            nao_iniciada: results.nao_iniciada || 0,
            total_ini_fim_antes_periodo_prazo: results.total_ini_fim_antes_periodo_prazo || 0,
            total_ini_fim_antes_periodo_atraso: results.total_ini_fim_antes_periodo_atraso || 0,
            total_ini_fim_no_periodo_prazo: results.total_ini_fim_no_periodo_prazo || 0,
            total_ini_fim_no_periodo_atraso: results.total_ini_fim_no_periodo_atraso || 0,
            total_no_prazo: results.total_no_prazo || 0,
            total_em_atraso: results.total_em_atraso || 0
        };

        return [mappedData];
    });

    // Filtrar as colunas que têm valores diferentes de zero
    const filteredColumns = useMemo(() => {
        if (!rows || rows.length === 0) {
            return columns;
        }

        return columns.filter(column => {
            const columnName = column.field;
            const columnValue = rows[0][columnName]; 

            return columnValue !== 0;
        });
    }, [columns, rows]);

    const getIcon = () => {
        return showHiddenColumns ? FiEyeOff : FiEye;
    };

    const getLabel = () => {
        return showHiddenColumns ? 'Ocultar colunas sem tarefas' : 'Mostrar colunas sem tarefas';
    };

    const displayedColumns = showHiddenColumns ? columns : filteredColumns;

    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        load();
        if (dataInicio && dataFim) {
            handleChangeFilters('data_inicio', dataInicio);
            handleChangeFilters('data_fim', dataFim);
        } else if (!dataInicio && !dataFim) {
            handleChangeFilters('data_inicio', null);
            handleChangeFilters('data_fim', null);
        }
    }, [basefilters.search, dataInicio, dataFim]);

    const toggleHiddenColumns = () => {
        setShowHiddenColumns(!showHiddenColumns);
    };



    return (
        <Background>
            <HeaderTitle
                title="Consultar Agrupamentos de Tarefas" optionsButtons={[
                    {
                        label: getLabel(),
                        onClick: () => toggleHiddenColumns(),
                        icon: getIcon(),
                    },
                ]} />
            <Section>
                <Table
                    columns={displayedColumns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    filtersComponentes={
                        <>
                            <Col md={2}>
                                <SelectAsync
                                    placeholder="Filtrar por Colaborador"
                                    loadOptions={(search) => listColaboradores('?search=' + search)}
                                    getOptionLabel={(option) => option.nome}
                                    onChange={(colaborador) => {
                                        handleChangeFilters('colaborador_id', colaborador ? colaborador.id : null);
                                    }}
                                    isClearable
                                />
                            </Col>
                            <Col md={2}>
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
                            <Col md={2}>
                                <DateTest
                                    id="dataFim"
                                    value={dataFim}
                                    label="Fim:"
                                    onChange={(date) => {
                                        setDataFim(date);
                                        handleChangeFilters('data_fim', date);
                                    }}
                                />
                            </Col>
                            <Col md={2}>
                                <DateTest
                                    id="dataInicio"
                                    value={dataInicio}
                                    label="Início:"
                                    onChange={(date) => {
                                        setDataInicio(date);
                                        handleChangeFilters('data_inicio', date);
                                    }}
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
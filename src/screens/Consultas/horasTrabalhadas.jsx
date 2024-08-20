import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table, TooltipPrazo } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradorHorasTrabalhadas, listColaboradorProjetosStatusTarefa} from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { listProjetos } from "@/services/projeto/projetos";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listSetores } from "@/services/setores";
import orderBy from 'lodash/orderBy';
import TooltipHorario from "@/components/TooltipHorario";
import moment from "moment";


const basefilters = {
    search: '',
    perPage: 20,
    //selectedRows: [],
    page: 1,
    sortedColumn: 'id',
    colaborador: null,
    sortOrder: 'asc',
};


const getColor = (situacao) => {
    switch (situacao) {
        case "ACIMA":
            return "green";
        case "ATENÇÃO":
            return "orange";
        case "SEM REGISTRO":
            return "red";
        case "NA MÉDIA":
            return "green";
        default:
            return "";
    }
};

const columnsFields = [
    {
        field: 'colaborador_nome',
        label: 'Colaborador',
        enabledOrder: true,
    },
    {
        field: 'carga_horaria',
        label: 'Carga Horária',
    },
    {
        field: 'horas_trabalhadas',
        label: 'Horas Trabalhadas',
    },
    {
        field: 'horas_afastado',
        label: 'Horas Afastado',
    },
    {
        field: 'horas_maximas_permitidas',
        label: 'Horas Max. Permitidas',
    },
    {
        field: 'banco_horas',
        label: 'Banco de Horas',
    },
    {
        field: 'total_tarefas_no_prazo',
        label: 'Tarefas no Prazo',
    },
    {
        field: 'total_tarefas_atrasado',
        label: 'Tarefas Atrasadas',
    },
    {
        field: 'total_tarefas',
        label: 'Total Tarefas',
    },
    {
        field: 'dias_trabalhados',
        label: 'Dias Trabalhados',
    },
    {
        field: 'situacao',
        label: 'Situação',
        enabledOrder: false,
        piper: (value, row) => {
            const { situacao } = row;
            return <TooltipHorario horarioLabels={{ label: situacao }} />;
        },
    }
];

export default function ConsultaHorasTrabalhadas() {
    const [dataInicio, setDataInicio] = useState(moment().format('YYYY-MM-01'));
    const [dataFim, setDataFim] = useState(moment().format('YYYY-MM-DD'));

    const {
        rows,
        columns,
        load,
        filtersState,
        isTableLoading,
        handleChangeFilters,
        resetFilters,
        isEmpty,
    }  = useTable(columnsFields, listColaboradorHorasTrabalhadas, basefilters, (results) => {
        if (!results || Object.keys(results).length === 0) {
            return [];
        }

        const mappedData = [];

        for (const [key, colaboradorData] of Object.entries(results)) {
            const { 
                colaborador_nome, 
                horas_trabalhadas, 
                carga_horaria,
                total_tarefas_no_prazo,
                total_tarefas_atrasado, 
                total_tarefas, 
                dias_trabalhados, 
                horas_maximas_permitidas,
                situacao,
                horas_afastado,
                banco_horas
            } = colaboradorData || {};

            mappedData.push({
                colaborador_nome: colaborador_nome || "",
                horas_trabalhadas: horas_trabalhadas ? horas_trabalhadas.toFixed(2) : 0, 
                carga_horaria: carga_horaria || 0,
                total_tarefas: total_tarefas || 0,
                dias_trabalhados: dias_trabalhados || 0,
                horas_maximas_permitidas: horas_maximas_permitidas || 0,
                situacao: situacao || "",
                horas_afastado: horas_afastado ? horas_afastado.toFixed(2) : 0,
                banco_horas: banco_horas ? banco_horas.toFixed(2) : 0,
                total_tarefas_no_prazo: total_tarefas_no_prazo || 0,
                total_tarefas_atrasado: total_tarefas_atrasado || 0,

            });
        }

        const totais = {
            colaborador_nome: 'TOTAL',
            horas_trabalhadas: 0,
            carga_horaria: 0,
            total_tarefas_no_prazo: 0,
            total_tarefas_atrasado: 0,
            total_tarefas: 0,
            dias_trabalhados: 0,
            horas_maximas_permitidas: 0,
            situacao: '',
            horas_afastado: 0,
            banco_horas: 0,
        };

        mappedData.forEach(item => {
            totais.horas_trabalhadas += parseFloat(item.horas_trabalhadas);
            totais.carga_horaria += parseInt(item.carga_horaria);
            totais.total_tarefas += parseInt(item.total_tarefas);
            totais.dias_trabalhados += parseInt(item.dias_trabalhados);
            totais.horas_maximas_permitidas += parseInt(item.horas_maximas_permitidas);
            totais.horas_afastado += parseInt(item.horas_afastado);
            totais.banco_horas += parseInt(item.banco_horas);
            totais.total_tarefas_no_prazo += parseInt(item.total_tarefas_no_prazo);
            totais.total_tarefas_atrasado += parseInt(item.total_tarefas_atrasado);

        });
        totais.horas_trabalhadas = totais.horas_trabalhadas.toFixed(2);

        mappedData.push(totais);

        const sortedData = orderBy(
            mappedData.filter(item => item.colaborador_nome !== 'TOTAL'), 
            [filtersState.sortedColumn], 
            [filtersState.sortOrder]
        );
        
        sortedData.push(mappedData.find(item => item.colaborador_nome === 'TOTAL'));
        
        return sortedData;
    });



    useEffect(() => {
        handleChangeFilters('search', basefilters.search);
        handleChangeFilters('data_inicio', dataInicio)
        handleChangeFilters('data_fim', dataFim)

        load();
    }, [basefilters.search]);

    return (
        <Background>
            <HeaderTitle
                title="Consultar Horas Trabalhadas" />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    filtersComponentes={
                        <>
                            <Col md={2} >
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
                            <Col md={2} >
                                <SelectAsync
                                    placeholder="Filtrar por Setor"
                                    loadOptions={(search) => listSetores('?search=' + search)}
                                    getOptionLabel={(option) => option.nome}
                                    onChange={(setor) => {
                                        handleChangeFilters('setor_id', setor ? setor.id : null);
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
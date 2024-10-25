import { Background, DateTest, HeaderTitle, Section, SelectAsync, Table, TooltipPrazo } from "@/components/index";
import useTable from "@/utils/hooks/useTable";
import { useEffect, useState } from "react";
import { listColaboradorHorasTrabalhadas, listColaboradorProjetosStatusTarefa } from "@/services/consultas/consultas";
import { Col } from "react-bootstrap";
import { listProjetos } from "@/services/projeto/projetos";
import { listColaboradores } from "@/services/colaborador/colaboradores";
import { listSetores } from "@/services/setores";
import orderBy from 'lodash/orderBy';
import TooltipHorario from "@/components/TooltipHorario";
import moment from "moment";
import { listColaboradorHorasTrabalhadasTeste } from "@/services/consultasTeste/consultasteste";
import { useAuth } from "@/utils/context/AuthProvider";
import { FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";



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


const exportToPDF = (data, dataInicio, dataFim) => {
    const doc = new jsPDF();

    const title = `Horas Trabalhadas - Relatório (${moment(dataInicio).format('DD/MM/YYYY')} a ${moment(dataFim).format('DD/MM/YYYY')})`;
    doc.setFontSize(14);
    doc.text(title, 14, 22); 


    const startY = 30;
    doc.autoTable({
        startY: startY,
        head: [[
            'Colaborador', 
            'Carga Horária', 
            'Horas Trabalhadas', 
            'Horas Afastado', 
            'Horas Max. Permitidas', 
            'Banco de Horas', 
            'Tarefas no Prazo', 
            'Tarefas Atrasadas', 
            'Total Tarefas', 
            'Dias Trabalhados', 
            'Situação'
        ]],
        body: data.map(item => ([
            item.colaborador_nome || '',
            item.carga_horaria || '',
            item.horas_trabalhadas || '',
            item.horas_afastado || '',
            item.horas_maximas_permitidas || '',
            item.banco_horas || '',
            item.total_tarefas_no_prazo || '',
            item.total_tarefas_atrasado || '',
            item.total_tarefas || '',
            item.dias_trabalhados || '',
            item.situacao || ''
        ])),
        theme: 'grid',
        styles: {
            cellPadding: 3,
            fontSize: 7,
            halign: 'center'
        },
        headStyles: {
            fillColor: [52, 84, 143],
            textColor: [255, 255, 255],
            fontSize: 6
        },
        margin: { top: startY }
    });

    const fileName = `relatorio_horas_trabalhadas_${moment(dataInicio).format('DD-MM-YYYY')}_a_${moment(dataFim).format('DD-MM-YYYY')}.pdf`;
    doc.save(fileName);
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

// Função para converter horas em formato decimal para HH:MM
const converterHoras = (horas) => {
    const totalMinutos = Math.round(horas * 60); // Convertendo horas para minutos
    const h = Math.floor(totalMinutos / 60); // Extraindo horas
    const m = totalMinutos % 60; // Extraindo minutos
    return `${h}:${m < 10 ? '0' : ''}${m}`; // Formatando para HH:MM
};

export default function ConsultaHorasTrabalhadasTeste() {
    const { user } = useAuth();
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
    } = useTable(columnsFields, listColaboradorHorasTrabalhadasTeste, basefilters, (results) => {
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
                horas_trabalhadas: horas_trabalhadas ? converterHoras(horas_trabalhadas) : "0:00", // Convertendo para HH:MM
                carga_horaria: carga_horaria || 0,
                total_tarefas: total_tarefas || 0,
                dias_trabalhados: dias_trabalhados || 0,
                horas_maximas_permitidas: horas_maximas_permitidas ? converterHoras(horas_maximas_permitidas) : "0:00",
                situacao: situacao || "",
                horas_afastado: horas_afastado ? converterHoras(horas_afastado) : "0:00", // Convertendo para HH:MM
                banco_horas: banco_horas ? converterHoras(banco_horas) : "0:00", // Convertendo para HH:MM
                total_tarefas_no_prazo: total_tarefas_no_prazo || 0,
                total_tarefas_atrasado: total_tarefas_atrasado || 0,
            });
        }

        const totais = {
            colaborador_nome: 'TOTAL',
            horas_trabalhadas: "0:00", // Inicializa como 0:00
            carga_horaria: 0,
            total_tarefas_no_prazo: 0,
            total_tarefas_atrasado: 0,
            total_tarefas: 0,
            dias_trabalhados: 0,
            horas_maximas_permitidas: "0:00",
            situacao: '',
            horas_afastado: "0:00", // Inicializa como 0:00
            banco_horas: "0:00", // Inicializa como 0:00
        };

        mappedData.forEach(item => {
            totais.horas_trabalhadas = converterHoras(
                (parseFloat(totais.horas_trabalhadas.split(':')[0]) + parseFloat(item.horas_trabalhadas.split(':')[0])) +
                (parseFloat(totais.horas_trabalhadas.split(':')[1]) + parseFloat(item.horas_trabalhadas.split(':')[1])) / 60
            );
            totais.carga_horaria += parseInt(item.carga_horaria);
            totais.total_tarefas += parseInt(item.total_tarefas);
            totais.dias_trabalhados += parseInt(item.dias_trabalhados);
            totais.horas_maximas_permitidas = converterHoras(
                (parseFloat(totais.horas_maximas_permitidas.split(':')[0]) + parseFloat(item.horas_maximas_permitidas.split(':')[0])) +
                (parseFloat(totais.horas_maximas_permitidas.split(':')[1]) + parseFloat(item.horas_maximas_permitidas.split(':')[1])) / 60
            );
            totais.horas_afastado = converterHoras(
                (parseFloat(totais.horas_afastado.split(':')[0]) + parseFloat(item.horas_afastado.split(':')[0])) +
                (parseFloat(totais.horas_afastado.split(':')[1]) + parseFloat(item.horas_afastado.split(':')[1])) / 60
            );
            totais.banco_horas = converterHoras(
                (parseFloat(totais.banco_horas.split(':')[0]) + parseFloat(item.banco_horas.split(':')[0])) +
                (parseFloat(totais.banco_horas.split(':')[1]) + parseFloat(item.banco_horas.split(':')[1])) / 60
            );
            totais.total_tarefas_no_prazo += parseInt(item.total_tarefas_no_prazo);
            totais.total_tarefas_atrasado += parseInt(item.total_tarefas_atrasado);
        });

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
                title="Consultar Horas Trabalhadas"
                optionsButtons={user.nivel_acesso === 2 ? [ 
                    {
                        label: 'Exportar como PDF',
                        onClick: () => exportToPDF(rows, dataInicio, dataFim),
                        icon: FaFilePdf
                    }
                ] : []} 
            />
            <Section>
                <Table
                    columns={columns}
                    rows={rows}
                    isLoading={isTableLoading}
                    filtersState={filtersState}
                    filtersComponentes={
                        <>
                            {user.nivel_acesso === 2 && ( // Verificação do nível de acesso
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
                            )}
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
                            {user.nivel_acesso === 2 && (
                                <Col md={2}>
                                    <SelectAsync
                                        placeholder="Filtrar por Setor"
                                        loadOptions={(search) => listSetores('?search=' + search)}
                                        getOptionLabel={(option) => option.sigla + ' - ' + option.nome}
                                        onChange={(setor) => {
                                            handleChangeFilters('setor_id', setor ? setor.id : null);
                                        }}
                                        isClearable
                                    />
                                </Col>
                            )}
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
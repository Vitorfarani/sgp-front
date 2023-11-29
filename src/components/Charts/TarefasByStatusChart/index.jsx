import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Card } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HC_BR } from '@/utils/helpers/HighChartLangPt';
import CoreChart from '../CoreChart';
import { useTheme } from '@/utils/context/ThemeProvider';
import { listTarefasByStatus } from '@/services/dashboard';
import { buildQueryString } from '@/utils/helpers/format';
import { isSet } from '@/utils/helpers/is';
import { useNavigate } from 'react-router-dom';

function createTarefaData(data) {
  let statusTrated = [];
  let TarefasTrated = [];
  let colors = Highcharts.getOptions().colors;
  data.status.forEach((status, key) => {
    let parentColor = colors[key + 5];
    statusTrated.push({
      name: status.nome,
      y: status.y,
      countTarefas: status.tarefas_count ?? status.tarefas.length,
      color: parentColor
    });
    if(isSet(status.tarefas)) {
      status.tarefas?.forEach((tarefa) => {
        TarefasTrated.push({
          cliente: tarefa.cliente,
          name_limited: tarefa.nome_limited,
          name: tarefa.nome,
          ...tarefa,
          color: Highcharts.color(parentColor)
            .brighten((0.2 - (key / data.totalTarefas) / 5))
            .get(),
        });
      })
    }
  });

  return { status: statusTrated, tarefas: TarefasTrated };
}


const TarefasByStatusChart = forwardRef(({ title }, ref) => {
  const { callGlobalAlert } = useTheme();
  const navigate = useNavigate()
  const [options, setOptions] = useState({

  });

  function load(params) {
    listTarefasByStatus(buildQueryString(params))
      .then((resultsList) => {
        const { status, tarefas } = createTarefaData(resultsList);
        let series = [];
        if (!!params.projeto_id || !!params.colaborador_id) {
          series = [
            {
              name: 'Status de Tarefas',
              data: status,
              size: '40%',
              tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span><b>{point.countTarefas}</b> tarefa(s)<br/>',
              },
              dataLabels: {
                color: '#ffffff',
                distance: '-20%',
                format: '<b>{point.name}</b> <span style="opacity: 0.5"></span>',

              },
            },
            {
              name: 'Tarefas',
              data: tarefas,
              size: '60%',
              innerSize: '60%',
              tooltip: {
                filter: {
                  property: 'point.tarefa_colaborador',
                  operator: '>',
                  value: 1
                },
                pointFormat: `
                        <span style="color:{point.andamento.color}">\u25CF</span>
                        <span>Projeto</span> 
                        <b>{point.projeto.nome}</b>
                        <br/>
                        <span style="color:{point.andamento.color}">\u25CF</span> 
                        <b>{point.andamento.label}</b>
                        <br/>
                        <span style="color:{point.andamento.color}">\u25CF</span>
                        <span>Executores</span> 
                        <b>{point.tarefa_colaborador}</b>
                        <br/>
                      `
                // pointFormat: '<span style="opacity: 0.5">{point.cliente.nome}</span>'
              },
              cursor: 'pointer',
              point: {
                events: {
                  click: (e) => navigate(`/projetos/visualizar/${e.point.projeto.id}?tarefa=${e.point.id}`)
                }
              },
              dataLabels: {
                format: '<b>{point.name_limited}</b>',
              },
              id: 'versions',
            },
          ];
        } else {
          series = [
            {
              name: 'Status de Tarefas',
              data: status,
              tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span><b>{point.countTarefas}</b> tarefa(s)<br/>',

              },
              size: '100%',
             
              dataLabels: {
                color: '#ffffff',
                distance: '-20%',
                format: '<b>{point.name}</b> <span style="opacity: 0.5"></span>',

              },
            }
          ]
        }
        setOptions({
          chart: {
            type: 'pie',
            backgroundColor: 'transparent',

          },
          title: {
            text: 'Tarefas por status',
            align: 'left',
          },
          plotOptions: {
            pie: {
              shadow: false,
              size: '100%',
              center: ['50%', '50%'],
            },
            series: {
              
            }
          },
          series,
          responsive: {
            rules: [{
              condition: {
                maxWidth: 400
              },
              chartOptions: {
                series: [{
                }, {
                  id: 'versions',
                  dataLabels: {
                    distance: 10,
                    format: '{point.custom.version}',
                    filter: {
                      property: 'percentage',
                      operator: '>',
                      value: 2
                    }
                  }
                }]
              }
            }]
          }
        });
      })
      .catch((err) => {
        console.log(err)
        callGlobalAlert(err)
      })
  }

  useEffect(() => {

  }, []);

  useImperativeHandle(ref, () => ({
    load
  }));


  return (
    // <Card style={{ marginBottom: 20 }}>
    //     <Card.Body>
    <CoreChart options={options} />
    // </Card.Body>
    // </Card>
  );
});


export default TarefasByStatusChart;
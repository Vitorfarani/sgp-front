import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Card } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HC_BR } from '@/utils/helpers/HighChartLangPt';
import CoreChart from '../CoreChart';
import { useTheme } from '@/utils/context/ThemeProvider';
import { listTarefasByStatus } from '@/services/dashboard';
import { buildQueryString } from '@/utils/helpers/format';

function createTarefaData(data) {
    let statusTrated = [];
    let TarefasTrated = [];
  let colors = Highcharts.getOptions().colors;
    data.status.forEach((status, key) => {
      let Tarefas = status.tarefas;
      let parentColor = colors[key];
      statusTrated.push({
        name: status.nome,
        y: status.y,
        countTarefas: Tarefas.length,
        color: parentColor
      });
      Tarefas.forEach((Tarefa) => {
        TarefasTrated.push({
          cliente: Tarefa.cliente,
          name_limited: Tarefa.nome_limited,

          name: Tarefa.nome,
          y: Tarefa.y,
          color: Highcharts.color(parentColor)
          .brighten(( 0.2 - (key / data.totalTarefas) / 5))
          .get(),
        });
      })
    });

    return {status: statusTrated, tarefas: TarefasTrated};
  }
  

const TarefasByStatusChart = forwardRef(({ title }, ref) => {
    const { callGlobalAlert } = useTheme();

    const [options, setOptions] = useState({
        
    });

    function load(params) {
        listTarefasByStatus(buildQueryString(params))
            .then((resultsList) => {
                const {status, tarefas} = createTarefaData(resultsList);
               console.log(status, tarefas)
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
                      },
                      series: [
                        {
                          name: 'Status de Tarefas',
                          data: status,
                          tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span><b>{point.countTarefas}</b> tarefas<br/>',
                          },
                          dataLabels: {
                            color: '#ffffff',
                            distance: '-20%',
                            format: '<b>{point.name}:</b> <span style="opacity: 0.5"></span>',

                          },
                        },
                        // {
                        //   name: 'Tarefas',
                        //   data: tarefas,
                        //   size: '60%',
                        //   innerSize: '60%',
                        //   tooltip: {
                            
                        //     pointFormat: '<span style="color:{point.color}">\u25CF</span> Cliente: <b>{point.cliente.nome}</b><br/>'
                        //     // pointFormat: '<span style="opacity: 0.5">{point.cliente.nome}</span>'
                        //   },
                        //   dataLabels: {
                        //     format: '<b>{point.name_limited}:</b>',
                        //   },
                        //   id: 'versions',
                        // },
                      ],
                      
                });
            })
            .catch(callGlobalAlert)
    }

    useEffect(() => {

    }, []);

    useImperativeHandle(ref, () => ({
        load
    }));

    
    return (
        <Card style={{ marginBottom: 20 }}>
            <Card.Body>
                <CoreChart options={options} />
            </Card.Body>
        </Card>
    );
});


export default TarefasByStatusChart;
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Card } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HC_BR } from '@/utils/helpers/HighChartLangPt';
import CoreChart from '../CoreChart';
import { useTheme } from '@/utils/context/ThemeProvider';
import { listtarefasByAndamento } from '@/services/dashboard';
import { buildQueryString } from '@/utils/helpers/format';
import { isSet } from '@/utils/helpers/is';
import { useNavigate } from 'react-router-dom';

function createChartData(data) {
  let categories = Object.keys(data);
  let series = [];
  categories.forEach(category => {
    let taskCount = data[category].length;
    series.push({
      name: category,
      data: [taskCount]
    });
  });
  return { categories, series };
}


const TarefasByAndamentoChart = forwardRef(({ title }, ref) => {
  const { callGlobalAlert } = useTheme();
  const navigate = useNavigate()
  const [options, setOptions] = useState({});

  function load(params) {
    listtarefasByAndamento(buildQueryString(params))
      .then((result) => {
        const { categories, series } = createChartData(result);
        setOptions({
          chart: {
            type: 'bar',
            backgroundColor: 'transparent',
          },
          title: {
            text: 'Tarefas por andamento',
            align: 'left',
          },
          xAxis: {
            categories: ['Andamento'],
            title: {
              text: null
            }
          },
          yAxis: {
            title: {
              text: 'Contagem de tarefas'
            }
          },
          plotOptions: {
            bar: {
                borderRadius: '18%',
                dataLabels: {
                    enabled: false
                },
                groupPadding: 0.1
            }
        },
          series: series
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
    <CoreChart options={options} />
  );
});

export default TarefasByAndamentoChart;

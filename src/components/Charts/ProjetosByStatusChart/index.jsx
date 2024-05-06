import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Card } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HC_BR } from '@/utils/helpers/HighChartLangPt';
import CoreChart from '../CoreChart';
import { useTheme } from '@/utils/context/ThemeProvider';
import { listProjetosByStatus } from '@/services/dashboard';
import { buildQueryString } from '@/utils/helpers/format';
import { useNavigate } from 'react-router-dom';

function createProjectData(data) {
  let statusTrated = [];
  let projectsTrated = [];
  let colors = Highcharts.getOptions().colors;
  data.status.forEach((status, key) => {
    let projects = status.projetos;
    let parentColor = colors[key];
    statusTrated.push({
      name: status.nome,
      y: status.y,
      countProjects: projects.length,
      color: parentColor
    });
    projects.forEach((project) => {
      
      projectsTrated.push({
        id: project.id,
        cliente: project.cliente,
        name: project.nome,
        name_limited: project.nome_limited,
        y: project.y,
        color: Highcharts.color(parentColor)
          .brighten((0.2 - (key / data.totalProjetos) / 5))
          .get(),
      });
    })
  });

  return { status: statusTrated, projetos: projectsTrated };
}


const ProjetosByStatusChart = forwardRef(({ title }, ref) => {
  const { callGlobalAlert } = useTheme();
  const navigate = useNavigate()

  const [options, setOptions] = useState({

  });

  function load(params) {
    listProjetosByStatus(buildQueryString(params))
      .then((resultsList) => {
        const { status, projetos } = createProjectData(resultsList);
        setOptions({
          chart: {
            type: 'pie',
            backgroundColor: 'transparent',

          },
          title: {
            text: 'Projetos por Status',
            align: 'left',
          },
          plotOptions: {
            pie: {
              shadow: false,
              center: ['50%', '50%'],
            },
          },
          series: [
            {
              name: 'Status de Projetos',
              data: status,
              size: '45%',
              tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span><b>{point.countProjects}</b> projeto(s)<br/>',
              },
              dataLabels: {
                color: '#ffffff',
                distance: '-50%',
                format: '<b>{point.name}</b> <span style="opacity: 0.5"></span>',

              },
            },
            {
              name: 'Projetos',
              data: projetos,
              size: '80%',
              innerSize: '60%',
              cursor: 'pointer',
              point: {
                events: {
                  click: (e) => navigate(`/projetos/visualizar/${e.point.id}`)
                }
              },
              tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> Cliente: <b>{point.cliente.nome}</b><br/>'
                // pointFormat: '<span style="opacity: 0.5">{point.cliente.nome}</span>'
              },
              dataLabels: {
                format: '<b>{point.name_limited}</b>',
              },
              id: 'versions',
            },
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
    // <Card style={{ marginBottom: 20 }}>
      // <Card.Body>
        <CoreChart options={options} />
      // </Card.Body>
    // </Card>
  );
});


export default ProjetosByStatusChart;

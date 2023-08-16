import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HC_BR } from '@/utils/helpers/HighChartLangPt';

const PieChartCard = ({ title, data }) => {
  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: '',
    },
    series: [
      {
        name: 'Data',
        data: data,
      },
    ],
    lang: HC_BR

  };

  useEffect(() => {
    Highcharts.setOptions({
      credits: {
        enabled: false,
      },
    });
  }, []);

  return (
    <Card style={{marginBottom: 20}}>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Card.Body>
    </Card>
  );
};

export default PieChartCard;

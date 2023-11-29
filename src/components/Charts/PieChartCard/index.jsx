import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import CoreChart from '../CoreChart';

const PieChartCard = ({ title, data }) => {
  const options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: '',
    },
    exporting: {
      enabled: true,

    },
    series: [
      {
        name: 'Data',
        data: data,
      },
    ],
  };


  return (
    <Card style={{ marginBottom: 20 }}>
      <Card.Body>
        <CoreChart options={options} />
      </Card.Body>
    </Card>
  );
};

export default PieChartCard;

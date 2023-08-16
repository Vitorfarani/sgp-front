import PieChartCard from "@/components/PieChartCard";
import { useAuth } from "@/utils/context/AuthProvider";
import { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const {isLoaded, isLogged} = useAuth();

    
const data1 = [
  { name: 'Category 1', y: 30 },
  { name: 'Category 2', y: 20 },
  { name: 'Category 3', y: 50 },
];

const data2 = [
  { name: 'Category A', y: 40 },
  { name: 'Category B', y: 25 },
  { name: 'Category C', y: 35 },
];

  return (
   <Container style={{}}>
       <h1>Pie Chart Cards</h1>
      <Row>
        <Col>
          <PieChartCard title="Chart 1" data={data1} />
        </Col>
        <Col>
          <PieChartCard title="Chart 2" data={data2} />
        </Col>
        {/* Adicione mais PieChartCard aqui para formar a grade 2x3 */}
      </Row>
      <Row>
        <Col>
          <PieChartCard title="Chart 1" data={data1} />
        </Col>
        <Col>
          <PieChartCard title="Chart 2" data={data2} />
        </Col>
        {/* Adicione mais PieChartCard aqui para formar a grade 2x3 */}
      </Row>
      <Row>
        <Col>
          <PieChartCard title="Chart 1" data={data1} />
        </Col>
        <Col>
          <PieChartCard title="Chart 2" data={data2} />
        </Col>
        {/* Adicione mais PieChartCard aqui para formar a grade 2x3 */}
      </Row>
      <Row>
        <Col>
          <PieChartCard title="Chart 1" data={data1} />
        </Col>
        <Col>
          <PieChartCard title="Chart 2" data={data2} />
        </Col>
        {/* Adicione mais PieChartCard aqui para formar a grade 2x3 */}
      </Row>
   </Container>
  );
}

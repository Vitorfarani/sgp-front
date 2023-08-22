import { Background, HeaderTitle, Section, SelectAsync, Table, ThumbnailUploader } from "@/components/index";
import { listClientes } from "@/services/clientes";
import { listConhecimentos } from "@/services/conhecimentos";
import { useEffect, useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const MOCK = {
  id: 1,
  nome: 'Projeto A',
  responsavel: 'João',
  fase: 1,
  situacao: 0,
  thumbnail: 'https://cdn-icons-png.flaticon.com/512/6846/6846880.png'
}

export default function CadastrarProjeto() {
  const navigate = useNavigate();
  let params = useParams();
  const [formData, setformData] = useState(MOCK);

  const handleForm = (propertyName, newValue) => {
    setformData((prevState) => ({
      ...prevState,
      [propertyName]: newValue
    }));
  }; 
  useEffect(() => {
    console.log(params)
  }, [params]);

  return (
    <Background>
      <HeaderTitle title="Projeto" breadcrumbBlockeds={['editar']} />
      <Form>
      <Section style={{margin: '0 30px', padding: '15px 30px'}} >
        <Row>
          <Col md={'auto'}>
          <ThumbnailUploader size={60} url={formData.thumbnail} onImageChange={(file) => handleForm('thumbnail', file)} />
          </Col>
          <Col className="m-auto">
            <Form.Control type="text" placeholder="Nome do Projeto" />
          </Col>
          <Col md={3}  className="m-auto">
          <SelectAsync placeholder="Selecione um cliente" apiCall={listClientes} onChange={(cliente) => handleForm('cliente', cliente) }/>
          </Col>
        </Row>
      </Section>
      <Section>
        <Row>
          <SelectAsync isMulti placeholder="Selecione os Conhecimentos necessários para esse projeto" loadOptions={listConhecimentos} onChange={(conhecimentos) => handleForm('conhecimentos', conhecimentos) }/>
        </Row>
      </Section>
      <Stack direction="horizontal">
        <Col md={4} className="mr-1" style={{}}>
          <Section>
            <Form.Group>
              <Form.Label></Form.Label>
            </Form.Group>
          </Section>
        </Col>
        <Col md={8} className="h-100">
          <Section></Section>
        </Col>
      </Stack>
      </Form>
    </Background>
  );
}
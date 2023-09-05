import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Background, BtnSimple, CustomOffCanvas, DateInput, DatePicker, FeedbackError, HeaderTitle, Section, SelectAsync, Table, TextareaEditor, ThumbnailUploader } from "@/components/index";
import ReactInputMask from "react-input-mask";
import { listSetores } from "@/services/setores";
import { validateSchema } from "@/utils/helpers/yup";
import { listConhecimentos } from "@/services/conhecimentos";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { colaboradorSchema } from "./validations";
import './style.scss'

const MOCK = {
  id: 1,
  thumbnail: null,
  nome: '',
  email: '',
  cpf: '',
  pr: '',
  nascimento: '',
  setor: null,
  conhecimentos: [],
}



export default function CadastrarColaborador() {
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState(MOCK);
  const navigate = useNavigate();
  let params = useParams();


  function handleForm(propertyName, newValue, subPropertyName = null, index = null) {
    if (subPropertyName) {
      setformData((prevState) => ({
        ...prevState,
        [propertyName]: prevState[propertyName].map((item, i) =>
          i === index
            ? { ...item, [subPropertyName]: newValue }
            : item
        )
      }));
    } else {
      setformData((prevState) => ({
        ...prevState,
        [propertyName]: newValue
      }));
    }
  };

  const handleSubmit = useCallback((event) => {
    validateSchema(colaboradorSchema, formData)
      .then(() => {
        setErrors(true)
        setValidated(true);

      })
      .catch((errors) => {
        setErrors(errors)
        console.log(errors)
        setValidated(false);
      })
    event.preventDefault();
    event.stopPropagation();
  }, [formData]);


  useEffect(() => {
    console.log(params)
  }, [params]);

  return (
    <Background>
      <HeaderTitle title="Colaborador" breadcrumbBlockeds={['editar']} />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Section className={'slim'} >
          <Row>
            <Col md={'auto'}>
              <ThumbnailUploader
                size={60}
                url={formData.thumbnail}
                placeholder={formData.nome}
                onImageChange={(file) => handleForm('thumbnail', file)} />
              <FeedbackError error={errors.thumbnail} />
            </Col>
            <Col className="m-auto">
              <Form.Control
                placeholder="Nome"
                value={formData.nome}
                onChange={({ target: { value } }) => handleForm('nome', value)}
                isInvalid={!!errors.nome} />
              <FeedbackError error={errors.nome} />
            </Col>
            <Col md={3} className="m-auto">
              <SelectAsync
                placeholder="Selecione um setor"
                loadOptions={listSetores}
                value={formData.cliente}
                onChange={(cliente) => handleForm('cliente', cliente)}
                isInvalid={!!errors.cliente} />
              <FeedbackError error={errors.cliente} />
            </Col>
            <Col md={'auto'} className="m-auto">
              <Button type="submit">Salvar</Button>
            </Col>
          </Row>
        </Section>
        <Section>
          <Row>
            <SelectAsync
              isMulti
              placeholder="Selecione os Conhecimentos desse colaborador"
              loadOptions={async (search) => {
                return listConhecimentos(search)
                  .then((result) => {
                    return Promise.resolve(result.conhecimentos)
                  })
              }}
              onChange={(conhecimentos) => handleForm('conhecimentos', conhecimentos)}
              isInvalid={!!errors.conhecimentos} />
            <FeedbackError error={errors.conhecimentos} />
          </Row>
        </Section>
        <Row>
          <Col md={6}>
            <Section>
              <h4>Contato</h4>
              <Form.Group as={Row} className="mt-4 mb-4">
                <Form.Control
                  placeholder="Telefone"
                  as={ReactInputMask}
                  maskChar={null}
                  mask={'(99)99999-9999'}
                  value={formData.telefone}
                  onChange={({ target: { value } }) => handleForm('telefone', value)}
                  isInvalid={!!errors.telefone} />
                <FeedbackError error={errors.telefone} />
              </Form.Group>
              <Form.Group as={Row} className="mb-4">
                <Form.Control
                  placeholder="Email"
                  value={formData.email}
                  onChange={({ target: { value } }) => handleForm('email', value)}
                  isInvalid={!!errors.email} />
                <FeedbackError error={errors.email} />
              </Form.Group>
            </Section>
            <Section>
              <Form.Group>
                <Form.Control
                  placeholder="PR"
                  value={formData.pr}
                  onChange={({ target: { value } }) => handleForm('pr', value)}
                  isInvalid={!!errors.pr} />
                <FeedbackError error={errors.pr} />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  placeholder="CPF"
                  as={ReactInputMask}
                  maskChar={null}
                  mask={'999.999.999-99'}
                  value={formData.cpf}
                  onChange={({ target: { value } }) => handleForm('cpf', value)}
                  isInvalid={!!errors.cpf} />
                <FeedbackError error={errors.cpf} />
              </Form.Group>
              <Form.Group>
                <DateInput
                placeholder={'Data de Nascimento'}
                  value={formData.nascimento}
                  onChangeValid={date => handleForm('nascimento', date)}
                  isInvalid={!!errors.nascimento} />
                <FeedbackError error={errors.nascimento} />
              </Form.Group>
            </Section>
          </Col>

          <Col md={6} className="">
            {/* {formData.id && (
             <Tabs projeto={formData}/>
            )}
             */}
          </Col>
        </Row>
      </Form>
    </Background>
  );
}

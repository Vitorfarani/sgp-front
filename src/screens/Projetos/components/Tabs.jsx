import { Row, Tabs as BTabs, Tab, Badge, Form, Button } from 'react-bootstrap'
import { createProjetoObservacao, deleteProjetoObservacao, listProjetoObservacoes } from "@/services/projeto/projetoObservacoes";
import { useTheme } from "@/utils/context/ThemeProvider";
import { useEffect, useState } from "react";
import { AnexoItem, BtnSimple, HorizontalScrollview, Section, TextareaEditor, Observacoes } from '@/components/index';
import { FiPlus, FiX } from 'react-icons/fi';
import { useProjetoContext } from '../projetoContext';

const Tabs = () => {
  const { projeto } = useProjetoContext();
  const [observacoes, setObservacoes] = useState([]);
  const [obsIsLoading, setObsIsLoading] = useState(false);
  const [observacao, setObservacao] = useState();
  const [anexos, setAnexos] = useState([]);
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();

  useEffect(() => {
    if (projeto.id) {
      loadObervacoes()
    }
  }, [projeto.id]);

  function loadObervacoes() {
    setObsIsLoading(true)
    listProjetoObservacoes('?projeto=' + projeto.id)
      .then((observacoes) => {
        setObservacoes(observacoes)
      })
      .catch((errors) => {
        callGlobalAlert({ title: 'Error', message: errors, color: 'red' })
      })
      .finally(() => setObsIsLoading(false))
  }


  function addObservacao() {
    let data = {
      conteudo: observacao,
      projeto_id: projeto.id,
      anexos: []
    };
    handleGlobalLoading.show()
    createProjetoObservacao(data)
      .then((result) => {
        callGlobalNotify({ message: result.message, variant: 'success' })
        setObservacoes(prev => [...prev, result.projeto_observacao])
        handleGlobalLoading.hide()
      })
      .catch((error) => {
        callGlobalAlert(error)
        handleGlobalLoading.hide()
      })

  }

  function removeObservacao(id) {
    callGlobalDialog({
      title: 'Excluir Observação',
      subTitle: 'Tem certeza que deseja excluir essa observação do projeto?',
      color: 'red',
      labelSuccess: 'Excluir',
    })
      .then(() => {
        handleGlobalLoading.show()
        deleteProjetoObservacao(id)
          .then((result) => {
            callGlobalNotify({ message: result.message, variant: 'danger' })
            setObservacoes((prevState) => {
              return prevState.filter((o, i) => o.id !== id)
            });
            handleGlobalLoading.hide()
          })
          .catch((error) => {
            callGlobalAlert(error)
            handleGlobalLoading.hide()
          })
      })
  }
  function handleFilesChange(event) {
    const files = Array.from(event.target.files).slice(0, 6);
    const updatedFiles = files.map(file => ({
      name: file.name,
      type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' :
        file.type.startsWith('image') ? 'image' : 'file',
      uri: URL.createObjectURL(file),
      file
    }));
    
    setAnexos([...anexos, ...updatedFiles])
  }

  function removeFile(index) {
    setAnexos(anexos.filter((_, i) => index !== i))
  }
  function addFiles() {
    document.getElementById('file-input').click()
  }
  return (
    <BTabs
      defaultActiveKey="observacao"
      id="justify-tab-example"
      className="mb-3 mt-4"
      transition
      justify
    >
      <Tab eventKey="observacao"
        title={(
          <span>Observações
            <Badge bg="primary">{observacoes?.length ?? 0}</Badge>
          </span>
        )}>
        <Observacoes
          observacoes={observacoes}
          isLoading={obsIsLoading}
          onRemove={removeObservacao} />
        <Section>
          <Form.Group className="mb-4">
            <Form.Label>Faça uma Observação</Form.Label>
            <TextareaEditor
              value={observacao}
              onChange={(value) => setObservacao(value)} />
          </Form.Group>
          {/* <Row className="m-auto justify-content-center">
            <BtnSimple Icon={FiPlus} onClick={addFiles}>Anexar arquivos</BtnSimple>
            <span style={{ display: 'contents' }}>{"(máximo de 6 arquivos)"}</span>
          </Row>
          {anexos.length > 0 && (
            <HorizontalScrollview style={{ justifyContent: 'start' }}>
              {anexos.map((anexo, index) => (
                <AnexoItem
                  key={index}
                  title={anexo.name}
                  type={anexo.type}
                  url={anexo.uri}
                  onRemove={() => removeFile(index)}
                />
              ))}
            </HorizontalScrollview>
          )}
          <input
            id="file-input"
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFilesChange}
          /> */}
          <div className='flex-row-reverse d-grid  mt-3'>
            <Button onClick={addObservacao}>Adicionar Observação</Button>
          </div>
        </Section>
      </Tab>
      <Tab eventKey="logs" title="Logs" disabled>
        Logs
      </Tab>
    </BTabs>
  )
}
export default Tabs;
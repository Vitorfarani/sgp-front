import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { DateInput } from '..'; // Ajuste o caminho conforme necessário
import { colaboradorTarefaPorExecucaoSemFiltroDeData} from '@/services/tarefa/tarefaExecucao';
import { diffDatetimesHumanized } from '@/utils/helpers/date'; // Supondo que você tenha essa função

const ShowExecucoes = ({ formData }) => {
  const [execucoes, setExecucoes] = useState([]);
  
  useEffect(() => {
    if (formData && formData.id) {
      verificarExecucoes(formData.id);
    }
  }, [formData]);

  const verificarExecucoes = async (tarefaId) => {
    try {
      const execucoesResposta = await colaboradorTarefaPorExecucaoSemFiltroDeData({ tarefa_id: tarefaId });

      const execucoesFiltradas = [];
      for (let colaboradorId in execucoesResposta) {
        const colaborador = execucoesResposta[colaboradorId];
        const execucoesDoColaborador = colaborador.tarefas.filter(
          (execucao) => execucao.tarefa_id === tarefaId
        );
        execucoesFiltradas.push(...execucoesDoColaborador);
      }

      setExecucoes(execucoesFiltradas.length > 0 ? execucoesFiltradas : []);
    } catch (error) {
      setExecucoes([]);
    }
  };

  const calcularTempoExecucao = (inicio, fim) => {
    if (!inicio) return '';
    const dataInicio = new Date(inicio);
    const dataFim = fim ? new Date(fim) : new Date(); // Se `fim` estiver vazio, use a data e hora atuais
    return diffDatetimesHumanized(dataInicio, dataFim);
  };

  return (
    <div>
      {execucoes.length > 0 ? (
        <Row>
          {execucoes.map((execucao, index) => (
            <Col
              key={index}
              md={execucoes.length === 1 ? 5 : 6} // Se houver uma execução, md={3}, se houver mais de uma execução, md={6}
              className={`mb-4 ${execucoes.length % 2 === 1 && index === execucoes.length - 1 ? 'offset-md-3' : ''}`}
            >
              <Form.Group>
                <Form.Label>{`Data de Início da Execução ${index + 1}`}</Form.Label>
                <DateInput
                  type="datetime-local"
                  value={execucao.data_inicio_execucao}
                  isInvalid={!execucao.data_inicio_execucao}
                  readOnly
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{`Data de Fim da Execução ${index + 1}`}</Form.Label>
                <DateInput
                  type="datetime-local"
                  value={execucao.data_fim_execucao}
                  isInvalid={!execucao.data_fim_execucao}
                  readOnly
                />
              </Form.Group>

              <Form.Label>
                Tempo de Execução: <strong style={{ color: 'pink' }}>{calcularTempoExecucao(execucao.data_inicio_execucao, execucao.data_fim_execucao)}</strong>
              </Form.Label>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Nenhuma execução parcial encontrada para esta tarefa.</p>
      )}
    </div>
  );
};

export default ShowExecucoes;

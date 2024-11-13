import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap'; // Certifique-se de ter esses componentes
import { DateInput } from '..'; // Ajuste o caminho conforme necessário
import { listColaboradorTarefaPorExecucao2 } from '@/services/tarefa/tarefaExecucao';

const ShowExecucoes = ({ formData }) => {
  const [execucoes, setExecucoes] = useState([]);

  useEffect(() => {
    if (formData && formData.id) {
      verificarExecucoes(formData.id);
    }
  }, [formData]);

  const verificarExecucoes = async (tarefaId) => {

    try {
      // Chamada ao serviço para obter as execuções
      const execucoesResposta = await listColaboradorTarefaPorExecucao2({ tarefa_id: tarefaId });

      // Verificar se retornou execuções e filtrar as que correspondem ao tarefaId
      const execucoesFiltradas = [];
      for (let colaboradorId in execucoesResposta) {
        const colaborador = execucoesResposta[colaboradorId];
        // Filtra as execuções que correspondem ao tarefaId
        const execucoesDoColaborador = colaborador.tarefas.filter(
          (execucao) => execucao.tarefa_id === tarefaId
        );
        execucoesFiltradas.push(...execucoesDoColaborador);
      }

      // Atualiza o estado com as execuções filtradas
      if (execucoesFiltradas.length > 0) {
        setExecucoes(execucoesFiltradas);
      } else {
        setExecucoes([]); // Garantir que o estado seja limpo caso não haja execuções
      }
    } catch (error) {
      setExecucoes([]); // Limpar o estado em caso de erro
    }
  };

  return (
    <div>
      {execucoes.length > 0 ? (
        execucoes.map((execucao, index) => (
          <div key={index}>
            <Form.Group className='mb-4'>
              <Form.Label>{`Data de Início da Execução ${index + 1}`}</Form.Label>
              <DateInput
                type="datetime-local"
                value={execucao.data_inicio_execucao}
                isInvalid={!execucao.data_inicio_execucao}
                readOnly // Impede a edição do campo
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label>{`Data de Fim da Execução ${index + 1}`}</Form.Label>
              <DateInput
                type="datetime-local"
                value={execucao.data_fim_execucao}
                isInvalid={!execucao.data_fim_execucao}
                readOnly // Impede a edição do campo
              />
            </Form.Group>
          </div>
        ))
      ) : (
        <p>Nenhuma execução parcial encontrada para esta tarefa.</p>
      )}
    </div>
  );
};

export default ShowExecucoes;

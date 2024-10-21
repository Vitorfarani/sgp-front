import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap'; // Certifique-se de ter esses componentes
import {DateInput} from '..'; // Ajuste o caminho conforme necessário

const ShowExecucoes = ({ listColaboradorTarefaPorExecucao, formData }) => {
    const [showExecutions, setShowExecutions] = useState(false);
    const [execucoes, setExecucoes] = useState([]);

    useEffect(() => {
        console.log("Form Data recebido:", formData); // Log para verificar os dados da tarefa
        if (formData.id) {
            verificarExecucoes(formData.id); // Usar formData.id para verificar execuções
        }
    }, [formData]);

    const verificarExecucoes = (tarefaId) => {
        console.log("Verificando execuções para tarefa ID:", tarefaId); // Log para depuração

        const colaborador = Object.values(listColaboradorTarefaPorExecucao).find(colab => 
            colab.tarefas.some(tarefa => tarefa.tarefa_id === tarefaId)
        );

        if (colaborador) {
            console.log("Colaborador encontrado:", colaborador); // Log para ver o colaborador encontrado
            const tarefaComExecucao = colaborador.tarefas.find(tarefa => tarefa.tarefa_id === tarefaId);
            if (tarefaComExecucao) {
                console.log("Tarefa com execução encontrada:", tarefaComExecucao); // Log para ver a tarefa com execução
                setExecucoes([{
                    data_inicio_execucao: tarefaComExecucao.data_inicio_execucao,
                    data_fim_execucao: tarefaComExecucao.data_fim_execucao,
                }]);
            } else {
                console.log("Nenhuma execução encontrada para esta tarefa."); // Log se nenhuma execução for encontrada
            }
        } else {
            console.log("Colaborador não encontrado ou não possui tarefas."); // Log se o colaborador não for encontrado
        }
    };

    return (
        <div>
            {execucoes.length > 0 ? (
                execucoes.map((execucao, index) => (
                    <div key={index}>
                        <Form.Group className='mb-4'>
                            <Form.Label>Data de Início da Execução</Form.Label>
                            <DateInput
                                type={"datetime-local"}
                                value={execucao.data_inicio_execucao}
                                isInvalid={!execucao.data_inicio_execucao}
                            />
                        </Form.Group>

                        <Form.Group className='mb-4'>
                            <Form.Label>Data de Fim da Execução</Form.Label>
                            <DateInput
                                type={"datetime-local"}
                                value={execucao.data_fim_execucao}
                                isInvalid={!execucao.data_fim_execucao}
                            />
                        </Form.Group>
                    </div>
                ))
            ) : (
                <p>Nenhuma execução encontrada para esta tarefa.</p>
            )}
        </div>
    );
};

export default ShowExecucoes;

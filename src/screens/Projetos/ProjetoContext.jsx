import { useTheme } from "@/utils/context/ThemeProvider";
import React, { createContext, useContext, useEffect, useState} from "react";
import { listProjetoStatus } from "@/services/projeto/projetoStatus";
import { listTarefaStatus } from "@/services/tarefa/tarefaStatus";
import { listTarefas } from "@/services/tarefa/tarefas";
import { showProjeto } from "@/services/projeto/projetos";

const ProjetoContext = createContext({
  projeto: {},
  load: (id) => {},
})
export const ProjetoProvider = ({ children }) => {
  const [projeto, setProjeto] = useState();
  const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();

  function beforeEdit(results) {
    // results['projeto_conhecimento'] = results['projeto_conhecimento'].map(pc => ({
    //   ...pc.conhecimento,
    //   projeto_conhecimento_id: pc.id
    // }))
    return results
  }
  
  
  const load = async (id) => {
    handleGlobalLoading.show()
      return Promise.all([
        showProjeto(id),
        listTarefaStatus(),
        listTarefas('?projeto='+id)
      ]).then(([
        projetoResult,
        tarefaStatusResult,
        tarefasResult,
      ]) => {
        setProjeto(beforeEdit(projetoResult))
        return Promise.resolve({tarefaStatusResult,tarefasResult})
      })
      .catch(callGlobalAlert)
      .finally(handleGlobalLoading.hide)
  }

  return (
    <ProjetoContext.Provider value={{
      projeto,
      load,
    }}>
      {children}
    </ProjetoContext.Provider>
  );
}

export function useProjetoContext() {
  const context = useContext(ProjetoContext);
  if (!context) {
    throw new Error('useProjetoContext must be used within an ProjetoProvider.');
  }

  return context;
}

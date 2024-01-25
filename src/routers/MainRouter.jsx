

import React, { useCallback, useEffect } from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider, BrowserRouter, Navigate, useLocation, Outlet, useNavigate  } from 'react-router-dom';
import { useAuth } from '@/utils/context/AuthProvider';
import Layout from '../Layout';
import {
  ErrorScreen,
  Home,
  Login,
  Dashboard,
  ConsultaColaborador,
  ConsultaProjeto,
  ConsultaColaboradoresPorTarefa,
  ConsultaTarefasPorColaborador,
  NotFound,
  Projeto,
  Projetos,
  Setor,
  Conhecimentos,
  Empresas,
  Clientes,
  Colaboradores,
  CadastrarColaborador,
  ProjetoStatus,
  ProjetoFases,
  ConhecimentoClasse,
  ConhecimentoNivel,
  TarefaStatus,
  TarefaDashboard,
  TarefaBase,
  TarefaClasse,
  AfastamentoTipos,
  Afastamentos,
  Funcoes,
  Contatos
} from '@/screens/index';
import { useTheme } from '@/utils/context/ThemeProvider';
import CadastrarProjeto from '@/screens/Projetos/CadastrarProjeto';

const MainRouter = () => {
  const { isLogged, isLoaded } = useAuth();
  const location = useLocation();

  const saveCurrentPath = () => {
    const currentPath = window.location.pathname;
    if(currentPath !== '/')
    localStorage.setItem('savedPath', currentPath);
    
  };

  useEffect(() => {
    saveCurrentPath()
  }, [location]);

  const RequireAuth = ({ children }) => {
    if (isLoaded && !isLogged) {
      return <Navigate to="/login" state={{ from: location }} replace />
    } else if (!isLoaded && !isLogged){
      return null;
    }
    return children;
  }

  
  return (
    <Routes>
      <Route errorElement={<ErrorScreen/>} />
      <Route path="/" Component={Home} />
      <Route path="login" element={isLogged ? <Navigate to="/dashboard" /> : <Login />} />
      <Route
        path="/"
        errorElement={() => <ErrorScreen/>}
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
        <Route index path="dashboard" Component={Dashboard} />

        <Route path="consultas/colaborador" Component={ConsultaColaborador}/>
        <Route path="consultas/projeto" Component={ConsultaProjeto}/>
        <Route path="consultas/tarefasPorColaborador" Component={ConsultaTarefasPorColaborador}/>
        <Route path="consultas/colaboradoresPorTarefa" Component={ConsultaColaboradoresPorTarefa}/>
        


        <Route path="colaboradores" Component={Colaboradores}/>
        <Route path="colaboradores/cadastrar" Component={CadastrarColaborador}/>
        <Route path="colaboradores/editar/:id" Component={CadastrarColaborador}/>
        
        <Route path="afastamentos" Component={Afastamentos}/>
        <Route path="afastamentos/tipos" Component={AfastamentoTipos}/>
    
        <Route path="projetos" Component={Projetos}/>
        <Route path="projetos/status" Component={ProjetoStatus}/>
        <Route path="projetos/fases" Component={ProjetoFases}/>
        <Route path="projetos/cadastrar" Component={CadastrarProjeto}/>
        <Route path="projetos/visualizar/:id" Component={Projeto}/>
        <Route path="projetos/editar/:id" Component={CadastrarProjeto}/>

        <Route path="tarefas" Component={TarefaDashboard}/>
        <Route path="tarefas/status" Component={TarefaStatus}/>
        <Route path="tarefas/bases" Component={TarefaBase}/>
        <Route path="tarefas/classes" Component={TarefaClasse}/>

        <Route path="conhecimentos" Component={Conhecimentos}/>
        <Route path="conhecimentos/classe" Component={ConhecimentoClasse}/>
        <Route path="conhecimentos/nivel" Component={ConhecimentoNivel}/>
          

        <Route path="funcoes" Component={Funcoes}/>

        <Route path="empresas" Component={Empresas}/>

        <Route path="setores" Component={Setor}/>

        <Route path="clientes" Component={Clientes}/>
        <Route path="clientes/contatos" Component={Contatos}/>
        
        <Route path="*" Component={NotFound} />
      </Route>
    </Routes>
  );
};

export default MainRouter;
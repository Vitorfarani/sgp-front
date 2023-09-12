

import React, { useCallback, useEffect } from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider, BrowserRouter, Navigate, useLocation, Outlet, useNavigate  } from 'react-router-dom';
import { useAuth } from '@/utils/context/AuthProvider';
import Layout from '../Layout';
import {
  ErrorScreen,
  Home,
  Login,
  Dashboard,
  Tarefas,
  NotFound,
  Projeto,
  Projetos,
  Setor,
  Tarefa,
  Conhecimentos,
  Empresas,
  Clientes,
  Colaboradores,
  CadastrarColaborador,
  ProjetoStatus,
  ProjetoFases,
  ConhecimentoClasse,
  ConhecimentoNivel
} from '@/screens/index';
import { useTheme } from '@/utils/context/ThemeProvider';
import CadastrarProjeto from '@/screens/Projetos/CadastrarProjeto';

const MainRouter = () => {
  const { isLogged } = useAuth();
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
    if (!isLogged) {
      return <Navigate to="/" state={{ from: location }} replace />
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
        errorElement={<ErrorScreen/>}
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
        <Route index path="dashboard" Component={Dashboard} />

        {/* <Route path="tarefas" Component={Tarefas} />
        <Route path="tarefas/:id" Component={Tarefa}/> */}

        <Route path="projetos" Component={Projetos}/>
        <Route path="projetos/status" Component={ProjetoStatus}/>
        <Route path="projetos/fases" Component={ProjetoFases}/>
        <Route path="projetos/cadastrar" Component={CadastrarProjeto}/>
        <Route path="projetos/editar/:id" Component={CadastrarProjeto}/>

          
        <Route path="colaboradores" Component={Colaboradores}/>
        <Route path="colaboradores/cadastrar" Component={CadastrarColaborador}/>
        {/* <Route path="colaborador/visualizar/:id" Component={Colaborador}/> */}
        <Route path="colaboradores/editar/:id" Component={CadastrarColaborador}/>
          
        <Route path="conhecimentos" Component={Conhecimentos}/>
        <Route path="conhecimentos/classe" Component={ConhecimentoClasse}/>
        <Route path="conhecimentos/nivel" Component={ConhecimentoNivel}/>
        <Route path="empresas" Component={Empresas}/>

        <Route path="setores" Component={Setor}/>

        <Route path="clientes" Component={Clientes}/>
        <Route path="*" Component={NotFound} />
      </Route>
    </Routes>
  );
};

export default MainRouter;
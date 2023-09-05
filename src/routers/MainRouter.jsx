

import React, { useCallback } from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider, BrowserRouter, Navigate, useLocation, Outlet } from 'react-router-dom';
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
  Tarefa,
  Conhecimentos,
  Empresas,
  Clientes
} from '@/screens/index';
import { useTheme } from '@/utils/context/ThemeProvider';
import CadastrarProjeto from '@/screens/Projetos/CadastrarProjeto';

const MainRouter = () => {
  const { isLogged } = useAuth();
  const location = useLocation();
    
  const RequireAuth = ({ children }) => {
    if (!isLogged) {
      return <Navigate to="/login" state={{ from: location }} replace />;
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
       
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>}>
        <Route index path="dashboard" Component={Dashboard} />

        <Route path="tarefas" Component={Tarefas} />
        <Route path="tarefas/:id" Component={Tarefa}/>

        <Route path="projetos" Component={Projetos}/>
        <Route path="projetos/cadastrar" Component={CadastrarProjeto}/>
        <Route path="projetos/editar/:id" Component={Projeto}/>
          
        <Route path="conhecimentos" Component={Conhecimentos}/>
        <Route path="empresas" Component={Empresas}/>

        <Route path="clientes" Component={Clientes}/>
        <Route path="*" Component={NotFound} />
        {/* <Route path="tarefas" element={<Tarefas />} /> */}
      </Route>
    </Routes>
  );
};

export default MainRouter;
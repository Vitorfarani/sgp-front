

import React, { useCallback } from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider, BrowserRouter, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/utils/context/AuthProvider';
import Layout from '../Layout';
import { 
  ErrorScreen,
  Home,
  Login,
  Dashboard,
  Tarefa,
  Demo
  } from '@/screens/index';
import { useTheme } from '@/utils/context/ThemeProvider';


const MainRouter = () => {
  const { isLogged } = useAuth();
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={isLogged ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/"
          element={<Layout />}>
              <Route index path="dashboard" element={<Dashboard />} />
              <Route path="tarefas" element={<Tarefa />} />
              <Route path="clientes"
                element={
                  <Outlet>
                    <Route path="demo" element={<Demo/>}/>
                  </Outlet>
                }/>
              <Route path="*" element={<Dashboard />} />
              {/* <Route path="tarefas" element={<Tarefas />} /> */}
        </Route>
      </Routes>
  );
};

export default MainRouter;
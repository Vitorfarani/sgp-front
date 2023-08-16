import React from 'react';
import MainRouter from './routers/MainRouter';
import { AuthProvider } from './utils/context/AuthProvider';
import { ThemeProvider as BootstrapThemeProvider } from 'react-bootstrap';
import { useLocalStorage } from './utils/hooks/useLocalStorage';
import { ThemeProvider } from './utils/context/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BootstrapThemeProvider prefixes={{}}>
          <BrowserRouter>
            <MainRouter />
          </BrowserRouter>
        </BootstrapThemeProvider>
      </ThemeProvider>
    </AuthProvider>

  );
};

export default App;
import React, { useEffect, useState } from 'react';
import { Background, BtnLoginGovBr, ToggleDarkMode } from '@/components/index';
import { logInGovBR } from '@/utils/browserSso';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './style.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/context/AuthProvider';
import { useTheme } from '@/utils/context/ThemeProvider';
import { ENV } from '@/constants/ENV';

const Login = () => {
  const {isLogged, cbSubmit, cbSubmitDEV} = useAuth();
  const { callGlobalAlert, callGlobalDialog } = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  function redirectToGov() {
    setIsLoading(true)
    logInGovBR()
  }


  async function sendCodeAndLogin(code) {
    try {
      setIsLoading(true)
      cbSubmit(code);
      navigate('/dashboard', {replace: true});
      setIsLoading(false)
    } catch (error) {
      
      callGlobalAlert(error)
      // callGlobalDialog(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      if(queryParams.get('code')) {
        sendCodeAndLogin(queryParams.get('code'))
      }
  }, [location.search]);


  return (
    <Container className="main-container">
      <ToggleDarkMode className="top-right"/>
      <div>
        <h3>Bem vindo ao</h3>
        <h1>Sistema de Gestão de Projetos</h1>
      </div>
      <div className="image-row" onClick={cbSubmitDEV}>
        <img
          src={ENV.HOST+"/assets/people-dealing-with-workplace-challenges.png"}
          className="centered-image"
        />
      </div>
      <div>
       <BtnLoginGovBr onClick={() => redirectToGov()} isLoading={isLoading}/>
      </div>
    </Container>
  );
};

export default Login;

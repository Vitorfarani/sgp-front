import React, { useEffect, useState } from 'react';
import { Background, BtnLoginGovBr, ToggleDarkMode } from '@/components/index';
import { logInGovBR } from '@/utils/browserSso';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './style.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { MOCK_SSO, loginApi } from '@/services/AuthService';
import { sendCodeToGov } from '@/services/sso';
import { useAuth } from '@/utils/context/AuthProvider';
import { useTheme } from '@/utils/context/ThemeProvider';

const Login = () => {
  const {isLogged, cbSubmit} = useAuth();
  const { callGlobalAlert } = useTheme();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  function redirectToGov() {
    setIsLoading(true)
    logInGovBR()
  }


  async function sendCodeAndLogin(code) {
    try {
      let dataSSo = await sendCodeToGov(code);
      cbSubmit(MOCK_SSO);
      navigate('/dashboard', {replace: true});
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      callGlobalAlert(error)
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
      <div className="image-row">
        <img
          src="people-dealing-with-workplace-challenges.png"
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

import { useAuth } from "@/utils/context/AuthProvider";
import { useCallback, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const {isLoaded, isLogged} = useAuth();

    useEffect(() => {
      if(isLoaded) {
        if(isLogged) {
          const savedPath = localStorage.getItem('savedPath');
          if (savedPath) {
            if(
              window.location.pathname == '/' || 
              window.location.pathname == '/login' || 
              window.location.pathname == '/dashboard'
            ) {
              navigate(savedPath)
            } else {
              navigate(window.location.pathname)
            }
          } else {
            navigate('/dashboard')
          }
        } else {
          navigate('/login')
        }
      }
    }, [isLoaded]);

  return (
   <Container style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Spinner animation="grow" size=""/>
      <h1>SGTP</h1>
      
   </Container>
  );
}
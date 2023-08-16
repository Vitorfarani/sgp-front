import { useAuth } from "@/utils/context/AuthProvider";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const {isLoaded, isLogged} = useAuth();

    useEffect(() => {
      setTimeout(() => {
        if(isLoaded) {
          if(isLogged) {
            navigate('/#/dashboard')
          } else {
            navigate('/login')
          }
        }
        
      }, 2000);
    }, [isLoaded]);

  return (
   <Container style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Spinner animation="grow" size=""/>
      <h1>Aquecendo aplicação</h1>
   </Container>
  );
}
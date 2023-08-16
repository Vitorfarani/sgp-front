import { useAuth } from "@/utils/context/AuthProvider";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Demo() {
  const navigate = useNavigate();
  const {isLoaded, isLogged} = useAuth();

    
  return (
   <Container style={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Spinner animation="grow" size=""/>
      <h1>Demo</h1>
   </Container>
  );
}
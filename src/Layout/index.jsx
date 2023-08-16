
import { useAuth } from '@/utils/context/AuthProvider';
import React, { useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { HeaderBar, SidebarLeft, SidebarRight } from './components';
import { Background } from '@/components/index';
import './style.scss';
export default function Layout({ children }) {
  const { isLogged } = useAuth();
  const location = useLocation();
  const [isOpenSideBarLeft, setIsOpenSideBarLeft] = useState(true);

  const RequireAuth = ({ children }) => {
    console.log({isLogged})
    if (!isLogged) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  return (
    <RequireAuth>
      <Background >
        <Row>
          <div className={`sidebarLeft ${isOpenSideBarLeft ? 'open' : 'closed'}`}>
            <SidebarLeft isOpenSideBarLeft={isOpenSideBarLeft} />
          </div>
          <Col className='wrapper'>
            <HeaderBar
              isOpenSideBarLeft={isOpenSideBarLeft}
              setIsOpenSideBarLeft={setIsOpenSideBarLeft}/>
            <Outlet />
          </Col>
        </Row>
      </Background>
    </RequireAuth>
  );
}

import { useAuth } from '@/utils/context/AuthProvider';
import React, { useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { HeaderBar, SidebarLeft, SidebarRight } from './components';
import { Background } from '@/components/index';
import './style.scss';
import { isMobile } from '@/constants';


const Layout = React.memo(() => {
  const { isLogged } = useAuth();
  const [isOpenSideBarLeft, setIsOpenSideBarLeft] = useState(false);

  return (
    <Container fluid >
      <Row>
        <div className={`sidebarLeft ${isOpenSideBarLeft ? 'open' : 'closed'}`} >
          <SidebarLeft isOpenSideBarLeft={isOpenSideBarLeft} setIsOpenSideBarLeft={setIsOpenSideBarLeft} />
        </div>
        <Col className={`wrapper ${!isOpenSideBarLeft ? 'open' : 'closed'}`} >
          <HeaderBar
            isOpenSideBarLeft={isOpenSideBarLeft}
            setIsOpenSideBarLeft={setIsOpenSideBarLeft} />
          <div 
            >

            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
});


export default Layout
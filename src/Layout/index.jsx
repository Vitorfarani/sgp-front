
import { useAuth } from '@/utils/context/AuthProvider';
import React, { useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { HeaderBar, SidebarLeft, SidebarRight } from './components';
import { Background } from '@/components/index';
import './style.scss';
import { isMobile } from '@/constants';
import { useDebounce } from 'use-debounce';


const Layout = React.memo(() => {
  const { isLogged } = useAuth();
  const [isOpenSideBarLeft, setIsOpenSideBarLeft] = useState(false);
  const [isOpenSideBarLeftDebounced] = useDebounce(isOpenSideBarLeft, 300);
  return (
    <Container fluid >
      <Row>
        <div className={`sidebarLeft ${isOpenSideBarLeftDebounced ? 'open' : 'closed'}`}
          onMouseEnter={() => setIsOpenSideBarLeft(true)}
          onMouseLeave={() => setIsOpenSideBarLeft(false)} >
          <SidebarLeft isOpenSideBarLeft={isOpenSideBarLeftDebounced} setIsOpenSideBarLeft={setIsOpenSideBarLeft} />
        </div>
        <Col className={`wrapper ${!isOpenSideBarLeftDebounced ? 'open' : 'closed'}`} >
          <HeaderBar
            isOpenSideBarLeft={isOpenSideBarLeftDebounced}
            setIsOpenSideBarLeft={setIsOpenSideBarLeft} />
          <div>
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
});


export default Layout
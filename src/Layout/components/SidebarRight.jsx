import { BtnSimple, ToggleDarkMode } from '@/components/index';
import { useAuth } from '@/utils/context/AuthProvider';
import React, { useState } from 'react';
import { Button, Col, Form, Nav, NavDropdown, Navbar, Offcanvas, Row, Stack } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const SidebarRight = ({isOpen, setIsOpenSideBarLeft}) => {
  const location = useLocation()
  const { logout } = useAuth()
  let pathSplited = location.pathname.split('/');


  return (
    <Navbar.Offcanvas
      id={`offcanvasNavbar-expand-false`}
      aria-labelledby={`offcanvasNavbarLabel-expand-false`}
      placement="end"
    >
    <Offcanvas.Header closeButton>
      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
      <ToggleDarkMode/>
      </Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>

    <BtnSimple onClick={logout} Icon={FiLogOut}>
        Logout
      </BtnSimple>
    </Offcanvas.Body>
  </Navbar.Offcanvas>
  );
};

export default SidebarRight;

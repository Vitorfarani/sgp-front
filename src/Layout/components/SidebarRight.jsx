import { ToggleDarkMode } from '@/components/index';
import { useAuth } from '@/utils/context/AuthProvider';
import React, { useState } from 'react';
import { Button, Col, Form, Nav, NavDropdown, Navbar, Offcanvas, Row, Stack } from 'react-bootstrap';
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
      <Nav className="justify-content-end flex-grow-1 pe-3">

        <Nav.Link href="#action2">Demo</Nav.Link>
        <NavDropdown
          title="Dropdown"
          id={`offcanvasNavbarDropdown-expand-false`}
        >
          <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action4">
            Another action
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action5">
            Something else here
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button variant="outline-success">Search</Button>
      </Form>
      <Button variant="outline-success" onClick={() => logout(true)}>Logout</Button>
    </Offcanvas.Body>
  </Navbar.Offcanvas>
  );
};

export default SidebarRight;

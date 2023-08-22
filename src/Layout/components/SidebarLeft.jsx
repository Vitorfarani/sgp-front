import React, { useState } from 'react';
import { Col, Nav, Row, Stack } from 'react-bootstrap';
import sidebarLeftListRoutes from '../sidebarLeftListRoutes';
import { NavLink, useLocation } from 'react-router-dom';
import { FiArrowDownLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '@/utils/context/AuthProvider';

const SidebarLeft = ({ isOpenSideBarLeft, setIsOpenSideBarLeft }) => {
  const location = useLocation()
  const { user } = useAuth();


  return (
    <Nav defaultActiveKey="/dashboard" className="flex-column">
      <Stack direction="horizontal" className='p-3 justify-content-between ' gap={2}>
      {isOpenSideBarLeft ? (
        <>
        <div className="p-1" style={{ fontSize: 26 }}>SGP</div>
        <a className={"text-body toggle-sidebar-left"} onClick={() => setIsOpenSideBarLeft(!isOpenSideBarLeft)}>
          {isOpenSideBarLeft ? <FiChevronLeft /> : <FiChevronRight />}
        </a>
        </>
      ) : (
        <div className="p-1" style={{ fontSize: 14 }}>SGP</div>
      )}
      </Stack>
      {sidebarLeftListRoutes.map((item, index) => (
        <div key={index}>
          <NavLink className="nav-link text-white" to={item.path}>
            <item.icon />
            {isOpenSideBarLeft && item.nome}
          </NavLink>
          {isOpenSideBarLeft && !!item.childrens && item.childrens.map((subItem, subindex) => (
            <NavLink className="nav-link subitem text-white" key={'subItem' + subindex}>
              <subItem.icon />
              {isOpenSideBarLeft && subItem.nome}
            </NavLink>
          ))}
        </div>
      ))}
    </Nav>
  );
};

export default SidebarLeft;

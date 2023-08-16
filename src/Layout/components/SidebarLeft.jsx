import React, { useState } from 'react';
import { Col, Nav, Row, Stack } from 'react-bootstrap';
import sidebarLeftListRoutes from '../sidebarLeftListRoutes';
import { NavLink, useLocation } from 'react-router-dom';
import { FiArrowDownLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SidebarLeft = ({isOpenSideBarLeft}) => {
  const location = useLocation()
  let pathSplited = location.pathname.split('/');


  return (
      <Nav defaultActiveKey="/dashboard" className="flex-column">
      <Stack direction="horizontal" className='p-2 ' gap={2}>
      {isOpenSideBarLeft && <div className="p-1" style={{fontSize: 26}}>SGP</div>}
       
      </Stack>
        {sidebarLeftListRoutes.map((item, index) => (
          <div key={index}>
              <NavLink className="nav-link" to={item.path}>
                  <item.icon />
                  {isOpenSideBarLeft && item.nome}
              </NavLink>
            {isOpenSideBarLeft && !!item.childrens && item.childrens.map((subItem, subindex) => (
              <NavLink className="nav-link subitem" key={'subItem'+subindex}>
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

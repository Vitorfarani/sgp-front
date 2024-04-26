import React, { useState } from 'react';
import { Col, Form, Nav, Row, Stack } from 'react-bootstrap';
import sidebarLeftListRoutes from '../sidebarLeftListRoutes';
import { NavLink, useLocation } from 'react-router-dom';
import { FiArrowDownLeft, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/utils/context/AuthProvider';
import { searchLike } from '@/utils/helpers/mask';
import '../style.scss'

const SidebarLeft = ({ isOpenSideBarLeft, setIsOpenSideBarLeft }) => {
  const location = useLocation()
  const { user } = useAuth();
  const [searchRoutes, setSearchRoutes] = useState('');
  const filteredRoutes = sidebarLeftListRoutes.filter(item => 
    user.nivel_acesso >= item.nivel_acesso && searchLike(item.nome, searchRoutes)
  );

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
      {isOpenSideBarLeft && (
        <div>
          <div className="nav-link">
            <Form.Control
              type="search"
              placeholder='Buscar'
              className='search-sidebar'
              value={searchRoutes}
              onChange={({ target: { value } }) => setSearchRoutes(value)}
              aria-label="Search"
            />
          </div>
        </div>
      )}
      {filteredRoutes.map((item, index) => (
        <div key={index} style={{ marginTop: '10px' }}>
          <NavLink className="nav-link text-white" to={item.path}>
            <item.icon />
            <span>
              {item.nome}

            </span>
          </NavLink>
          {!!item.childrens && item.childrens.map((subItem, subindex) => 
            user.nivel_acesso >= subItem.nivel_acesso ?
              <NavLink className="nav-link subitem text-white" key={'subItem' + subindex} to={subItem.path}>
                <subItem.icon />
                <span>
                  {subItem.nome}
                </span>
              </NavLink>
            :
              ""
          )}
        </div>
      ))}
    </Nav>
  );
};

export default SidebarLeft;

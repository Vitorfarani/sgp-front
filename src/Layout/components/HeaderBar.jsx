import { ToggleDarkMode } from '@/components/index';
import { Col, Row, Stack } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FiChevronLeft, FiChevronRight, FiList } from 'react-icons/fi';
import { SidebarRight } from '.';
import { useAuth } from '@/utils/context/AuthProvider';

export default function HeaderBar({ isOpenSideBarLeft, setIsOpenSideBarLeft }) {
  const  {user} = useAuth();
  return (
    <Navbar expand={false} className="bg-body-tertiary shadow-sm">
      <Container fluid>
        <div className='d-flex align-items-center'>
          <a className={"text-body toggle-sidebar-left-outside"} 
            onClick={() => setIsOpenSideBarLeft(!isOpenSideBarLeft)}>
            {isOpenSideBarLeft ? <FiChevronLeft /> : <FiChevronRight />}
          </a>
          <h5 style={{margin: 0, marginLeft: 30}}>Bem vindo, {user.name}</h5>
        </div>
        <Stack direction="horizontal" gap={2}>
          <Navbar.Toggle className='toggle-sidebar-right' aria-controls={`offcanvasNavbar-expand-false`} />
        </Stack>
        <SidebarRight/>
      </Container>
      
    </Navbar>
  );
}

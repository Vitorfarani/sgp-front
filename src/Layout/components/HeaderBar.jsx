import { ToggleDarkMode } from '@/components/index';
import { Stack } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FiChevronLeft, FiChevronRight, FiList } from 'react-icons/fi';
import { SidebarRight } from '.';

export default function HeaderBar({ isOpenSideBarLeft, setIsOpenSideBarLeft }) {
  return (
    <Navbar expand={false} className="bg-body-tertiary mb-3">
      <Container fluid>
        <div>
          <a className={"text-body toggle-sidebar-left"} onClick={() => setIsOpenSideBarLeft(!isOpenSideBarLeft)}>
            {isOpenSideBarLeft ? <FiChevronLeft /> : <FiChevronRight />}
          </a>
        </div>
        <Stack direction="horizontal" gap={2}>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
        </Stack>
        <SidebarRight/>
      </Container>
    </Navbar>
  );
}

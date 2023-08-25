import { Offcanvas } from "react-bootstrap";

const CustomOffCanvas = ({ title, children, ...props }) => {

  return (
    <>
      <Offcanvas  {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        {children}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
export default CustomOffCanvas;
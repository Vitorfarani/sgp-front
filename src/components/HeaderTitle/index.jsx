import { useState } from "react";
import { Stack, Col, Row, Breadcrumb } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { CustomDropdown } from "..";
  
export default function HeaderTitle({title,  optionsButtons, breadcrumbBlockeds = [] }) {
  const location = useLocation();
  const [pathnames, setpathnames] = useState(location.pathname.split('/').filter((x) => x));
  return (
    <Stack direction="horizontal" className='d-flex p-4' gap={2}>
      <Col >
        <Row>
          <h2>{title}</h2>
        </Row>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item active>SGP</Breadcrumb.Item>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;

              return isLast ? (
                <Breadcrumb.Item key={name} active>
                  {name}
                </Breadcrumb.Item>
              ) : (
                <Breadcrumb.Item key={name} active={breadcrumbBlockeds.includes(name)} linkAs={Link} linkProps={{ to: routeTo }}>
                  {name}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </Row>
      </Col>
        {optionsButtons && <CustomDropdown items={optionsButtons}/>}
    </Stack>
  )
}


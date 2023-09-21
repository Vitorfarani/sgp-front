import { useState, useRef, memo } from 'react';
import { Button } from 'react-bootstrap';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

function ButtonWithPopover({ labelButton, Icon, title, width = 100, children, variant = "primary" }) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);

  };
  return (
    <>
      <div ref={ref}>
        <Overlay
          show={show}
          target={target}
          placement="left"
          container={ref}
          containerPadding={40}
        >
          <Popover style={{ width: width }}>
            <Popover.Header as="h3">{title}</Popover.Header>
            <Popover.Body >
              {children}
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
      <Button onClick={handleClick} variant={variant}>
        {!!Icon && <Icon />}
        {labelButton}
      </Button>
    </>
  );
}

export default memo(ButtonWithPopover);
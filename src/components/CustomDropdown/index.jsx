import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';

const CustomDropdown = ({ items, size, param }) => {
  if (items.length === 1) {
    const { label, onClick, icon: Icon, visibled } = items[0];
    if(visibled === false) return null
    return (
      <Button variant="primary" onClick={() => onClick(param)}>
        {Icon && React.createElement(Icon, {className:'me-2'})}
        {label}
      </Button>
    );
  } else if (items.length > 1) {
    return (
      <Dropdown >
        <Dropdown.Toggle size={size} variant="primary">
          Opções
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {items.map((item, index) => item.visibled !== false ? (
            <Dropdown.Item key={index}  onClick={() => item.onClick(param)}>
              {item.icon && <item.icon className='me-2' />}
              {item.label}
            </Dropdown.Item>
          ): null)}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return null; // Caso o array esteja vazio
};

export default CustomDropdown;

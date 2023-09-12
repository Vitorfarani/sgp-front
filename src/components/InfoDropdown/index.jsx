import React, { useMemo, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { Dropdown } from 'react-bootstrap';
import moment from 'moment';

const InfoDropdown = ({ data, ...props}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const created_at = useMemo(() => {
      if (!data.created_at) return ''
      return moment(data.created_at).format('DD/MM/YYYY HH:mm:ss');
    }, [data.created_at]);

  const updated_at = useMemo(() => {
      if (!data.updated_at) return ''
      return moment(data.updated_at).format('DD/MM/YYYY HH:mm:ss');
    }, [data.updated_at]);
  
  return (
    <div {...props}>
      <FiInfo onClick={toggleDropdown} style={{ cursor: 'pointer' }} />
      <Dropdown show={isOpen} align="end">
        <Dropdown.Menu>
          {!!data.created_at && <Dropdown.Item disabled>Criado em: <strong>{created_at}</strong></Dropdown.Item>}
          {!!data.created_by && <Dropdown.Item disabled>Criado por: <strong>{data.created_by}</strong></Dropdown.Item>}
          {!!data.updated_at && <Dropdown.Item disabled>Atualizado em: <strong>{updated_at}</strong></Dropdown.Item>}
          {!!data.updated_by && <Dropdown.Item disabled>Atualizado por: <strong>{data.updated_by}</strong></Dropdown.Item>}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default InfoDropdown;

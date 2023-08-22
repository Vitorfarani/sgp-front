import React from 'react';
import PropTypes from 'prop-types';
import './style.scss'; // Arquivo de estilos personalizados

const CustomCheckbox = ({ checked, onChange, label, color }) => {
  const checkboxClasses = `custom-checkbox ${checked ? 'checked' : ''} ${color ? `custom-checkbox-${color}` : ''}`;

  return (
    <div className={checkboxClasses} onClick={onChange}>
      <div className="checkbox-icon">
        {checked && <span className="checkmark">&#10003;</span>}
      </div>
      {label && <span className="checkbox-label">{label}</span>}
    </div>
  );
};

CustomCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
};

export default CustomCheckbox;

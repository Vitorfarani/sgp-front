import React from 'react';
import AsyncSelect from 'react-select/async';
import { getSelectStyles, getSelectTheme } from './theme';

export default ({ isMulti, size, isInvalid, ...props }) => (
  <AsyncSelect
    cacheOptions
    placeholder=""
    theme={getSelectTheme}
    styles={getSelectStyles(isMulti, size, isInvalid)}
    isMulti={isMulti}
    getOptionLabel={(option) => option.nome}
    getOptionValue={(option) => option.id}
    defaultOptions
    {...props} />
);



import React from 'react';
import AsyncSelect from 'react-select/async';
import { getSelectStyles, getSelectTheme } from './theme';
import { useDebouncedCallback } from "use-debounce";
import ReactSelect from 'react-select';

export default ({ isMulti, size, isInvalid, ...props }) => {
  return (
    <ReactSelect
      placeholder=""
      theme={getSelectTheme}
      styles={getSelectStyles(isMulti, size, isInvalid)}
      getOptionLabel={(option) => option.nome}
      getOptionValue={(option) => option.id}
      defaultOptions
      {...props} />
  );
}


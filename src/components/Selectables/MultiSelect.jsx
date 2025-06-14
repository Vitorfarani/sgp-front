import React from 'react';
import AsyncSelect from 'react-select/async';
import { getSelectStyles, getSelectTheme } from './theme';

export default ({ isMulti, size, ...props }) => (
  <AsyncSelect
    cacheOptions
    isMulti
    theme={getSelectTheme}
    styles={getSelectStyles(isMulti, size)}
    defaultOptions
    {...props} />
);



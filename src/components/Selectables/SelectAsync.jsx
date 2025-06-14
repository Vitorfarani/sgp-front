import React from 'react';
import AsyncSelect from 'react-select/async';
import { getSelectStyles, getSelectTheme } from './theme';
import { useDebouncedCallback } from "use-debounce";

export default ({ isMulti, size, isInvalid,loadOptions, ...props }) => {
  const loadSuggestedOptions = useDebouncedCallback((inputValue, callback) => {
    if(!loadOptions) return
      loadOptions(inputValue).then(options => callback(options))
    }, 500);

  return (
    <AsyncSelect
      cacheOptions
    
      placeholder=""
      loadOptions={loadSuggestedOptions}
      theme={getSelectTheme}
      isSearchable={true}
      loadingMessage={() => <span>Buscando</span>}
      styles={getSelectStyles(isMulti, size, isInvalid)}
      isMulti={isMulti}
      getOptionLabel={(option) => option.nome}
      getOptionValue={(option) => option.id}
      defaultOptions
      {...props} />
  );
}


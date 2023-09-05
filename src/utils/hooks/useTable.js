import { useEffect, useState } from 'react';
import { buildQueryString } from '../helpers/format';
import { useTheme } from '../context/ThemeProvider';
import { useDebounce } from 'use-debounce';
import { isJson, isObject, isString } from '../helpers/is';
import { standartResponseApiError } from '@/services/index';

const useTable = (columnsFields, methodlister = (new Promise), initialFiltersValues = {}, callBackTrater) => {
  const [filtersState, setFiltersState] = useState(initialFiltersValues);
  const [isTableLoading, setTableIsLoading] = useState(false);
  const [columns, setColumns] = useState(columnsFields);
  const [rows, setRows] = useState([]);
  const { callGlobalAlert } = useTheme();
  const [debouncedFilters] = useDebounce(filtersState, 500);

  const handleChangeFilters = (name, value) => {
    setFiltersState({
      ...filtersState,
      [name]: value
    });
  };
  const isEmpty = !isTableLoading && (rows.length === 0);


  useEffect(() => {
    load()
  }, [debouncedFilters]);

  const resetFilters = () => {
    setFiltersState(initialValues);
    setTableIsLoading(false);
  };

  const load = async () => {
    setTableIsLoading(true)
    methodlister(buildQueryString(debouncedFilters))
      .then((results) => {
        let tratedResuts = [];
        if(!isObject(results)) throw standartResponseApiError('Erro de carregamento de dados da API')
        if (!!callBackTrater) {
          tratedResuts = callBackTrater(results)
        } else {
          tratedResuts = results
        }
        setRows(tratedResuts);
      })
      .catch(error => {
        callGlobalAlert(standartResponseApiError('Erro de carregamento de dados da API'))
      })
      .finally(() => setTableIsLoading(false))
  }

  return {
    filtersState,
    load,
    isTableLoading,
    handleChangeFilters,
    resetFilters,
    isEmpty,
    columns,
    rows
  };
};

export default useTable;

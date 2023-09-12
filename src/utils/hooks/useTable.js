import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildQueryString } from '../helpers/format';
import { useTheme } from '../context/ThemeProvider';
import { useDebounce } from 'use-debounce';
import { isJson, isObject, isString } from '../helpers/is';
import { standartResponseApiError } from '@/services/index';
import { error } from 'highcharts';

const useTable = (columnsFields, methodlister = (new Promise), initialFiltersValues = {}, callBackTrater) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filtersState, setFiltersState] = useState(initialFiltersValues);
  const [isTableLoading, setTableIsLoading] = useState(false);
  const [columns, setColumns] = useState(columnsFields);
  const [rows, setRows] = useState([]);
  const { callGlobalAlert } = useTheme();
  const [debouncedFilters] = useDebounce(filtersState, 500);

  const handleChangeFilters = useCallback((name, value) => {
    setFiltersState((prevFiltersState) => {
      return {
        ...prevFiltersState,
        [name]: value,
      };
    });
  },[]);
  const isEmpty = useMemo(() => !isTableLoading && !rows.length, [isTableLoading, rows]);
  // const isEmpty = () => !isTableLoading && !rows.length;

  useEffect(() => {
    if(isLoaded) {
      load()
    }
  }, [debouncedFilters]);

  const resetFilters = () => {
    setFiltersState(initialFiltersValues);
    load()
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
      .catch(callGlobalAlert)
      .finally(() => {
        setTableIsLoading(false)
        setIsLoaded(true)
      })
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

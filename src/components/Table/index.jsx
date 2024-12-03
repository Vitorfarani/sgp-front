import React, { useEffect, useRef, useState } from 'react';
import { Table as TableBootstrap, Pagination, Form, Button, Row, Col, Stack, Placeholder, ProgressBar } from 'react-bootstrap';
import { AnimatedProgress, BadgeColor, CustomDropdown } from '..';
import PropTypes from 'prop-types';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { centerImage } from 'highcharts';


const Table = ({
  columns,
  rows,
  filtersState: filters,
  searchPlaceholder,
  handleFilters,
  actions,
  children,
  notFoundMessage,
  filtersComponentes,
  isLoading,
}) => {

  const handlePageChange = (newPage) => {
    handleFilters('page', newPage);
  };

  const handleSearchChange = (e) => {
    handleFilters('search', e.target.value);
    handleFilters('page', 1);
  };

  const handleSort = (column) => {
    if (column.enabledOrder) {
      handleFilters('sortedColumn', column.field);
      if (column.field == filters.sortedColumn) {
        handleFilters('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        handleFilters('sortOrder', 'desc');

      }
    }
  };
  const handleRowSelect = (index) => {
    if (filters.selectedRows.includes(index)) {
      handleFilters('selectedRows', filters.selectedRows.filter((item) => item !== index));
    } else {
      handleFilters('selectedRows', [...filters.selectedRows, index]);
    }
  };

  const handleSelectAllRows = () => {
    if (filters.selectedRows.length === rows.length) {
      handleFilters('selectedRows', []);
    } else {
      handleFilters('selectedRows', rows.map((_, index) => index));
    }
  };


  const SortComponent = ({ column }) => {
    if (!filters.sortedColumn || !filters.sortOrder) return null;
    return (filters.sortedColumn === column.field) && !!column.enabledOrder ?
      filters.sortOrder === 'asc' ? <FiChevronUp className={`ms-1`} /> : <FiChevronDown className={`ms-1`} />
      : null;
  }

  const renderCellValue = (value) => {
    if (React.isValidElement(value)) {
      return value; // Retorna o componente React diretamente
    } else {
      return String(value); // Converte para string (ou número) e retorna
    }
  };
  return (
    <div>
      <Form className="mb-3">
        <Row className='flex-row-reverse'>
          {typeof filters.search !== "undefined" && searchPlaceholder && (
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder={searchPlaceholder ?? "Pesquisar"}
                value={filters.search}
                onChange={handleSearchChange}
              />
            </Col>
          )}
          {typeof filters.active !== "undefined" && (
            <Col md={1}>
              <Form.Select
                value={filters.afastado.toString()}
                onChange={({ target: { value } }) => {
                  handleFilters('active', true);
                  handleFilters('afastado', value === "true");
                }}>
                <option value={false}>Ativos</option>
                <option value={true}>Afastados</option>
              </Form.Select>
            </Col>
          )}
          {filtersComponentes}
        </Row>
      </Form>
      <TableBootstrap striped hover responsive >
        <thead>
          <tr>
            {!!filters.selectedRows && (
              <th style={{ width: 36 }}>
                <Form.Check
                  type="checkbox"
                  checked={filters.selectedRows.length === rows.length}
                  onChange={handleSelectAllRows}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.field}
                onClick={() => handleSort(column)}
                style={{
                  cursor: column.enabledOrder ? 'pointer' : 'default',
                  background: column.backgroundColor,
                  borderRadius: column.borderRadius,
                  border: 'none',
                }}
                colSpan={column.colspan ?? 1}
                className={column.subColumns && column.subColumns.length > 0 ? 'text-center' : ''}
              >
                <span style={{ color: column.color, verticalAlign: 'middle' }}>{column.label}</span>
                {column.subColumns && column.subColumns.length > 0 && (
                  <table className="table table-responsive" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        {column.subColumns.map((subColumn) => (
                          <th
                            key={subColumn.field}
                            onClick={() => handleSort(subColumn)}
                            style={{
                              cursor: subColumn.enabledOrder ? 'pointer' : 'default',
                              paddingRight: '25px',
                              borderRadius: subColumn.borderRadius,
                              background: column.backgroundColor,
                              border: 'none',
                            }}
                            className="text-center"
                            colSpan={subColumn.colspan ?? 1}
                          >
                            <BadgeColor color={subColumn.backgroundColor}>{subColumn.label}</BadgeColor>
                            <SortComponent column={subColumn} />
                            {subColumn.nestedColumns && subColumn.nestedColumns.length > 0 && (
                              <table className="table table-responsive" style={{ margin: 0 }}>
                                <thead>
                                  <tr>
                                    {subColumn.nestedColumns.map((nestedColumn) => (
                                      <th
                                        key={nestedColumn.field}
                                        onClick={() => handleSort(nestedColumn)}
                                        style={{
                                          cursor: nestedColumn.enabledOrder ? 'pointer' : 'default',
                                          paddingRight: '10px',
                                          borderRadius: nestedColumn.borderRadius,
                                          background: column.backgroundColor,
                                          border: 'none',
                                        }}
                                        className="text-center"
                                        colSpan={nestedColumn.colspan ?? 1}
                                      >
                                        <BadgeColor color={nestedColumn.backgroundColor}>{nestedColumn.label}</BadgeColor>
                                        <SortComponent column={nestedColumn} />
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                              </table>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  </table>
                )}
              </th>
            ))}
            {actions && <th style={{ width: 70 }}>Ações</th>}
          </tr>
          {isLoading && !!rows?.length && (
            <tr>
              <th colSpan={100}>
                <AnimatedProgress />
              </th>
            </tr>
          )}
        </thead>
        <tbody>
          {!isLoading && !rows?.length && (
            <tr>
              <td colSpan={100} height={100} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <span>{notFoundMessage ?? 'Nenhum dado foi encontrado com os filtros atuais'}</span>
              </td>
            </tr>
          )}
          {isLoading && !rows?.length &&
            [...Array(3)].map((_, index) => (
              <tr key={index + 'plac'}>
                {!!filters.selectedRows && <td></td>}
                {columns.map((_, index2) => (
                  <td key={index + 'cl' + index2}>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={12} />
                    </Placeholder>
                  </td>
                ))}
                <td>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={12} />
                  </Placeholder>
                </td>
              </tr>
            ))}
          {rows.map((row, index) => (
            <tr key={index}>
              {!!filters.selectedRows && (
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={filters.selectedRows.includes(index)}
                    onChange={() => handleRowSelect(index)}
                  />
                </td>
              )}
              {columns.map((column) => {
                if (column.subColumns && column.subColumns.length > 0) {
                  return (
                    <React.Fragment key={column.field}>
                      {column.subColumns.map((subColumn) => (
                        <React.Fragment key={subColumn.field}>
                          {subColumn.nestedColumns && subColumn.nestedColumns.length > 0 ? (
                            <React.Fragment>
                              {subColumn.nestedColumns.map((nestedColumn, nestedIndex) => (
                                <td
                                  key={nestedColumn.field}
                                  style={{
                                    textAlign: 'center'
                                  }}
                                >
                                  {nestedColumn.piper ? renderCellValue(nestedColumn.piper(row[nestedColumn.field], row, filters)) : renderCellValue(row[nestedColumn.field])}
                                </td>
                              ))}
                            </React.Fragment>
                          ) : (
                            <td key={subColumn.field}
                              style={{
                                textAlign: 'center'
                              }}
                            >
                              {subColumn.piper ? renderCellValue(subColumn.piper(row[subColumn.field], row, filters)) : renderCellValue(row[subColumn.field])}
                            </td>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                } else {
                  return (
                    <td key={column.field}>
                      {column.piper ? renderCellValue(column.piper(row[column.field], row, filters)) : renderCellValue(row[column.field])}
                    </td>
                  );
                }
              })}
              {actions && (
                <td>
                  <CustomDropdown size={'sm'} param={row} items={actions} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </TableBootstrap>
      <Stack direction='horizontal' gap={3} >
        {filters.page && (
          <Pagination style={{ marginBottom: 0 }}>
            <Pagination.Prev
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
            />
            <Pagination.Item>{filters.page}</Pagination.Item>
            <Pagination.Next
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={rows.length < filters.perPage}
            />
          </Pagination>
        )}
        {filters.perPage && filters.page && <div className="vr"></div>}
        {filters.perPage && (
          <Form.Control
            style={{ width: 60 }}
            as="select"
            value={filters.perPage}
            onChange={(e) => {
              handleFilters('perPage', Number(e.target.value))
            }}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={200}>200</option>
          </Form.Control>
        )}

      </Stack>
    </div>
  );
};

// ...

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      enabledOrder: PropTypes.bool,
      // Outras propriedades específicas das colunas
    })
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.object // Estrutura dos objetos das linhas
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      // icon: PropTypes.node,
      visibled: PropTypes.bool,
      // Outras propriedades específicas das ações
    })
  ),
  searchPlaceholder: PropTypes.string,
  filtersState: PropTypes.shape({
    search: PropTypes.string,
    perPage: PropTypes.number,
    selectedRows: PropTypes.array,
    page: PropTypes.number,
    sortOrder: PropTypes.string,
    sortedColumn: PropTypes.string
  }).isRequired,
  handleFilters: PropTypes.func.isRequired,
  children: PropTypes.node, // Componentes filhos
  notFoundMessage: PropTypes.string,
  filtersComponentes: PropTypes.node, // Componente para filtros
  isLoading: PropTypes.bool,
};

export default Table;

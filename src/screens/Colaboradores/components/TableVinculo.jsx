// import React from 'react';
// import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
// import { BadgeColor, BtnSimple, PuzzleIcon, ThumbnailUploader } from '@/components/index';
// import { Col, Row, Stack } from 'react-bootstrap';
// import { FiEdit, FiTrash } from 'react-icons/fi';
// import { dateEnToPt } from '@/utils/helpers/date';
// import { dot } from '@/components/Selectables/theme';
// import useTable from '@/utils/hooks/useTable';
// import { useTheme } from '@/utils/context/ThemeProvider';

// const basefilters = {
//   search: '',
//   perPage: 20,
//   selectedRows: [],
//   page: 1,
//   active: true,
//   sortedColumn: 'id',
//   sortOrder: 'asc',
// };

// const columnsFields = [
//   { field: 'empresa', label: 'Empresa', enabledOrder: true, style: { width: 100 }, piper: (field, row) => !!row.afastamento.length ? `${field} - afastado` : field },
//   { field: 'funcao', label: 'Função', enabledOrder: false },
//   { field: 'data_inicio', label: 'Data de Início', enabledOrder: false },
//   { field: 'data_fim', label: 'Data Fim', enabledOrder: false, piper: (field) => field && celularMask(field) },
//   { field: 'carga_horaria', label: 'carga', enabledOrder: false, piper: (field) => field && getIdade(field) + ' anos' },
//   { field: 'setor', label: 'Setor', enabledOrder: false, piper: (field) => !!field ? field.nome : '' },
// ];

// const TableVinculo = ({ colaboradorId }) => {
//   const { callGlobalDialog, handleGlobalLoading, callGlobalAlert, callGlobalNotify } = useTheme();

//   const {
//     rows,
//     columns,
//     load,
//     filtersState,
//     isTableLoading,
//     handleChangeFilters,
//     resetFilters,
//     isEmpty,
//   } = useTable(columnsFields, listColaboradores, basefilters, (results) => {
//     return results.data
//   });
//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <Table
//       columns={columns}
//       rows={rows}
//       isLoading={isTableLoading}
//       filtersState={filtersState}
//       searchPlaceholder="Buscar Colaborador"
//       searchOffiline
//       handleFilters={handleChangeFilters}
//       actions={[
//         {
//           label: 'Editar',
//           onClick: (row) => {
//             navigate('/colaboradores/editar/' + row.id)
//           },
//           icon: FiEdit,
//         },
//         {
//           label: 'Excluir',
//           onClick: handleDelete,
//           icon: FiTrash,
//         },
//       ]}>
//     </Table>
//   );
// };

// export default CardConhecimento;

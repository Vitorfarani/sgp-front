// import { Background, HeaderTitle, Section, SelectAsync, Table } from "@/components/index";
// import { createContato, deleteContato, listContatos, updateContato } from "@/services/contato";
// import { useAuth } from "@/utils/context/AuthProvider";
// import { useTheme } from "@/utils/context/ThemeProvider";
// import useTable from "@/utils/hooks/useTable";
// import { useEffect, useState } from "react";
// import { FiCheckCircle, FiEdit, FiPlus, FiTrash } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// //import { contatoSchema } from "./validations";
// import { listClientes } from "@/services/clientes";
// import { listProjetoFases } from "@/services/projeto/projetoFases";
// import { listSetores } from "@/services/setores";

// import { Col } from "react-bootstrap";

// const basefilters = {
//   search: '',
//   perPage: 20,
//   selectedRows: [],
//   page: 1,
//   sortedColumn: 'id',
//   cliente: null,
//   sortOrder: 'asc',
// };

// // const columnsFields = [
// //   { field: 'nome', label: 'Projeto', enabledOrder: true },
// //   { field: 'cliente', label: 'Cliente', enabledOrder: true, piper: (field) => field ? field.nome : '' },
// //   { field: 'projeto_setor', label: 'Setor Responsável', enabledOrder: true, piper: (field) => field.find(s => !!s.principal)?.setor.sigla || field[0]?.setor.sigla || '' },
// //   { field: 'projeto_fase', label: 'Fase',  enabledOrder: true, piper: (field) => field.nome },
// //   { field: 'projeto_status', label: 'Status', enabledOrder: true, piper: (field) => field.nome }
// // ];

// const columnsFields = [
//     { field: 'nome', label: 'Projeto', enabledOrder: true},
//     { field: 'cliente', label: 'Cliente', enabledOrder: true},
//     { field: 'projeto_setor', label: 'Setor Responsável', enabledOrder: true },
//     { field: 'projeto_fase', label: 'Fase',  enabledOrder: true },
//     { field: 'projeto_status', label: 'Status', enabledOrder: true }
  
//   ];

// export default function ConsultaProjeto() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
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
//   } = useTable(columnsFields, listClientes, basefilters, (results) => {
//     return results.data
//   }
//   );

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <Background>
//       <HeaderTitle title="Consultar Projetos"/>
//       <Section>
//         <Table
//           columns={columns}
//           rows={rows}
//           isLoading={isTableLoading}
//           filtersState={filtersState}
//           searchPlaceholder="Consultar Projetos"
//           filtersComponentes={
//             <>
//             <Col md={3}>
//             <SelectAsync
//               placeholder="Filtrar por Setor"
//               loadOptions={(search) => listSetores('?search='+search)}
//               getOptionLabel={(option) => option.sigla+' - '+option.nome}

//               onChange={(setor) => handleChangeFilters('setor', setor.id)} />
//             </Col>
//             <Col md={3}>
//             <SelectAsync
//               placeholder="Filtrar por Cliente"
//               loadOptions={(search) => listClientes('?search='+search)}
//               getOptionLabel={(option) => option.nome}

//               onChange={(cliente) => handleChangeFilters('cliente', cliente.id)} />
//             </Col>
            
//             {/* <Col md={3}>
//             <SelectAsync
//               placeholder="Filtrar por Fase"
//               loadOptions={(search) => listProjetoFases('?search='+search)}
//               // getOptionLabel={(option) => option.sigla}
//               getOptionLabel={(option) => option.nome}

//               onChange={(fase) => handleChangeFilters('fase', fase.id)} />
//             </Col> */}
//             </>
            
//           }
//           handleFilters={handleChangeFilters}
//           actions={[

//           ]}>
//         </Table>
//       </Section>
//     </Background>
//   );
// }
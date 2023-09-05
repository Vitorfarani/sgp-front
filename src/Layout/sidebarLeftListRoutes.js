import { FiBarChart, FiBookmark, FiGrid, FiPieChart, FiUsers, FiBriefcase } from "react-icons/fi";
import { FaArchive, FaBrain, FaBuilding, FaTasks } from "react-icons/fa";

export default [
  {
    nome: 'Dashboard',
    icon: FiPieChart,
    path: 'dashboard',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Colaboradores',
    icon: FiUsers,
    path: 'colaborador',
    childrens: []
  },
  {
    nome: 'Projetos',
    icon: FiGrid,
    path: 'projetos',
    rolesPermited: [],
    childrens: []
  },

  {
    nome: 'Conhecimentos',
    icon: FaBrain,
    path: 'conhecimentos',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Empresas',
    icon: FaBuilding,
    path: 'empresas',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Clientes',
    icon: FiUsers,
    path: 'clientes',
    childrens: []
  },
  {
    nome: 'Setor',
    icon: FiBriefcase,
    path: 'setor',
    childrens: []
  },
]
import { FiBarChart, FiBookmark, FiGrid, FiPieChart, FiUsers, FiBriefcase } from "react-icons/fi";
import { FaArchive, FaBity, FaBrain, FaBuilding, FaClock, FaLevelUpAlt, FaListAlt, FaPeopleCarry, FaTasks } from "react-icons/fa";

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
    icon: FaPeopleCarry,
    path: 'colaboradores',
    childrens: []
  },
  {
    nome: 'Projetos',
    icon: FiGrid,
    path: 'projetos',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Status de projetos',
        icon: FaListAlt,
        path: 'projetos/status',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Fases de projetos',
        icon: FaClock,
        path: 'projetos/fases',
        rolesPermited: [],
        childrens: []
      },
    ]
  },

  {
    nome: 'Conhecimentos',
    icon: FaBrain,
    path: 'conhecimentos',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Classes de conhecimento',
        icon: FaBity,
        path: 'conhecimentos/classe',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Níveis de conhecimento',
        icon: FaLevelUpAlt,
        path: 'conhecimentos/nivel',
        rolesPermited: [],
        childrens: []
      },
    ]
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
    nome: 'Setores',
    icon: FiBriefcase,
    path: 'setores',
    childrens: []
  },
]
import { FiBarChart, FiBookmark, FiGrid, FiPieChart, FiUsers, FiBriefcase, FiBookOpen } from "react-icons/fi";
import { FaSearch, FaArchive, FaBalanceScale, FaBity, FaBrain, FaBuilding, FaClock, FaFlag, FaIdCard, FaLevelUpAlt, FaListAlt, FaMarkdown, FaPeopleCarry, FaStopCircle, FaStopwatch, FaTasks } from "react-icons/fa";

export default [
  {
    nome: 'Dashboard',
    icon: FiPieChart,
    path: 'dashboard',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Consultas',
    icon: FaSearch,
    path: 'consultas',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Projetos',
        icon: FiGrid,
        path: 'consultas/projeto',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Colaboradores',
        icon: FaPeopleCarry,
        path: 'consultas/colaborador',
        rolesPermited: [],
        childrens: []
      },
    ]
  },
  {
    nome: 'Colaboradores',
    icon: FaPeopleCarry,
    path: 'colaboradores',
    childrens: []
  },
  {
    nome: 'Afastamento',
    icon: FaStopCircle,
    path: 'afastamentos',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Tipos de afastamento',
        icon: FaStopwatch,
        path: 'afastamentos/tipos',
        rolesPermited: [],
        childrens: []
      },
    ]
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
    nome: 'Tarefas',
    icon: FaTasks,
    path: 'tarefas',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Status de tarefas',
        icon: FaListAlt,
        path: 'tarefas/status',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Classes de tarefas',
        icon: FaMarkdown,
        path: 'tarefas/classes',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Bases de tarefas',
        icon: FaFlag,
        path: 'tarefas/bases',
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
    childrens: [
      {
        nome: 'Contatos',
        icon: FaIdCard,
        path: 'clientes/contatos',
        childrens: []
      },
    ]
  },
  {
    nome: 'Setores',
    icon: FiBriefcase,
    path: 'setores',
    childrens: []
  },
  {
    nome: 'Funções',
    icon: FiBookOpen,
    path: 'funcoes',
    childrens: []
  },
]
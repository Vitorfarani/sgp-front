import { FiBarChart, FiBookmark, FiGrid, FiPieChart, FiUsers, FiBriefcase, FiBookOpen } from "react-icons/fi";
import { FaSearch, FaUserClock, FaLayerGroup, FaArchive, FaBalanceScale, FaBity, FaBrain, FaBuilding, FaClock, FaFlag, FaIdCard, FaLevelUpAlt, FaListAlt, FaMarkdown, FaPeopleCarry, FaStopCircle, FaStopwatch, FaTasks, FaUserSlash, FaSnowboarding} from "react-icons/fa";
import { PiUserList } from "react-icons/pi";

export default [
  {
    nome: 'Dashboard',
    nivel_acesso: 1,
    icon: FiPieChart,
    path: 'dashboard',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Consultas',
    nivel_acesso: 2,
    icon: FaSearch,
    path: '',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Projetos',
        nivel_acesso: 2,
        icon: FiGrid,
        path: 'consultas/projeto',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Colaboradores',
        nivel_acesso: 2,
        icon: FaPeopleCarry,
        path: 'consultas/colaborador',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Colaboradores/Tarefa',
        nivel_acesso: 2,
        icon: PiUserList,
        path: 'consultas/colaboradoresPorTarefa',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Colaborador/Projeto',
        nivel_acesso: 2,
        icon: FaLayerGroup,
        path: 'consultas/colaboradorPorProjeto',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Horas Trabalhadas',
        nivel_acesso: 2,
        icon: FaUserClock,
        path: 'consultas/colaboradorHorasTrabalhadas',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Tarefas/Colaborador',
        nivel_acesso: 2,
        icon: FaTasks,
        path: 'consultas/tarefasPorColaborador',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Tarefas/Agrupamento',
        nivel_acesso: 2,
        icon: FaLayerGroup,
        path: 'consultas/tarefasPorAgrupamento',
        rolesPermited: [],
        childrens: []
      },
    ]
  },
  {
    nome: 'Colaboradores',
    nivel_acesso: 2,
    icon: FaPeopleCarry,
    path: 'colaboradores',
    childrens: []
  },
  {
    nome: 'Afastamento',
    nivel_acesso: 2,
    icon: FaUserSlash,
    path: 'afastamentos',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Tipos de afastamento',
        nivel_acesso: 2,
        icon: FaStopwatch,
        path: 'afastamentos/tipos',
        rolesPermited: [],
        childrens: []
      },
    ]
  },
  {
    nome: 'Projetos',
    nivel_acesso: 1,
    icon: FiGrid,
    path: 'projetos',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Status de projetos',
        nivel_acesso: 2,
        icon: FaListAlt,
        path: 'projetos/status',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Fases de projetos',
        nivel_acesso: 2,
        icon: FaClock,
        path: 'projetos/fases',
        rolesPermited: [],
        childrens: []
      },
    ]
  },
  {
    nome: 'Tarefas',
    nivel_acesso: 1,
    icon: FaTasks,
    path: 'tarefas',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Status de tarefas',
        nivel_acesso: 2,
        icon: FaListAlt,
        path: 'tarefas/status',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Classes de tarefas',
        nivel_acesso: 2,
        icon: FaMarkdown,
        path: 'tarefas/classes',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Bases de tarefas',
        nivel_acesso: 2,
        icon: FaFlag,
        path: 'tarefas/bases',
        rolesPermited: [],
        childrens: []
      },
    ]
  },
  {
    nome: 'Minhas Tarefas',
    nivel_acesso: 1,
    icon: FaTasks,
    path: 'tarefas/execucao',
    rolesPermited: [],
    childrens: []
  },

  {
    nome: 'Conhecimentos',
    nivel_acesso: 2,
    icon: FaBrain,
    path: 'conhecimentos',
    rolesPermited: [],
    childrens: [
      {
        nome: 'Classes de conhecimento',
        nivel_acesso: 2,
        icon: FaBity,
        path: 'conhecimentos/classe',
        rolesPermited: [],
        childrens: []
      },
      {
        nome: 'Níveis de conhecimento',
        nivel_acesso: 2,
        icon: FaLevelUpAlt,
        path: 'conhecimentos/nivel',
        rolesPermited: [],
        childrens: []
      },
    ]
  },
  {
    nome: 'Empresas',
    nivel_acesso: 2,
    icon: FaBuilding,
    path: 'empresas',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Clientes',
    nivel_acesso: 2,
    icon: FiUsers,
    path: 'clientes',
    childrens: [
      {
        nome: 'Contatos',
        nivel_acesso: 2,
        icon: FaIdCard,
        path: 'clientes/contatos',
        childrens: []
      },
    ]
  },
  {
    nome: 'Feriados',
    nivel_acesso: 2,
    icon: FaSnowboarding,
    path: 'feriados',
    childrens: []
  },
  {
    nome: 'Setores',
    nivel_acesso: 2,
    icon: FiBriefcase,
    path: 'setores',
    childrens: []
  },
  {
    nome: 'Funções',
    nivel_acesso: 2,
    icon: FiBookOpen,
    path: 'funcoes',
    childrens: []
  },
]
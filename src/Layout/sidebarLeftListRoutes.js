import { FiBarChart, FiBookmark, FiGrid, FiPieChart, FiUsers } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";

export default [
  {
    nome: 'Dashboard',
    icon: FiPieChart,
    path: 'dashboard',
    rolesPermited: [],
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
    nome: 'Tarefas',
    icon: FaTasks,
    path: 'tarefas',
    rolesPermited: [],
    childrens: []
  },
  {
    nome: 'Clientes',
    icon: FiUsers,
    path: 'clientes',
    childrens: [
      {
        nome: 'demo',
        icon: FiBarChart,
        path: 'demo',
      }
    ]
  },
]
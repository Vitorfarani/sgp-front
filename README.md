# Sistema de Gestão de Projetos

 Este é um projeto construído com [React](https://react.dev/learn) + [Vite](https://github.com/vitejs/vite), uma ferramenta de desenvolvimento ultrarrápida para criar aplicativos React.

## Como Começar

Siga estas etapas para configurar e executar o projeto localmente:

1. **Instale as dependências:**

   ```yarn install```

2. **Rodar em dev:**

   ```yarn dev```

2. **Buildar para Prod:**

   ```yarn build```


## Estrutura do Projeto
```
  sgp-front/
  ├── dist/ //Pasta com build para PROD
  ├── assets/
  │   ├── images/
  │   ├── videos/
  │   └── fonts/
  ├── components/ //Componentes Reutilizáveis
  │   ├── ComponenteA
  |   |    ├── index.jsx
  │   |    ├── style.scss //Styles específicos
  │   |    └── ...
  │   ├── ComponenteB
  |   |    ├── index.jsx
  │   |    ├── style.scss
  │   |    └── ...
  │   └── ...
  ├── constants/
  │   ├── environment.js //Variaveis de ambiente 
  │   └── ...
  ├── routers/ //Obs: crie arquivos separados no caso de aninhamento de rotas
  │   ├── MainRouter.jsx
  │   └── ...
  ├── screens/
  │   ├── Login
  |   |    ├── index.jsx //Tela
  │   |    ├── style.scss //Styles específicos
  │   |    └── ...
  │   ├── Home
  │   |    ├── index.jsx 
  │   |    ├── style.scss
  |   |    └── ...
  |   └── ...
  ├── scss/
  │   ├── styles.scss //Styles globais
  │   ├── theme.scss //Sobrescrita de cores do bootstrap
  │   └── ...
  ├── services/ //Conexões com APIs
  │   ├── sso.js
  │   ├── AuthService.js
  │   └── ...
  ├── layout/ //Base para todas as screens
  │   ├── index.js
  │   ├── components
  │   ├── sidebarLeftListRoutes.js // Array de rotas e seus icones
  │   └── ...
  ├── utils/ 
  │   ├── helpers/ //Funções genéricas reutilizáveis
  │   ├── context/
  |   |    ├── index.js //Store dos contextos 
  |   |    ├── AuthProvider.jsx 
  |   |    ├── ThemeProvider.jsx
  |   |    └── ...
  │   └── ...
  ├── package.json
  ├── README.md
  └── vite.config.js
```
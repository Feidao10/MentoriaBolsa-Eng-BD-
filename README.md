Backend — Sistema de Bolsas e Mentorias

Descrição

API responsável pela gestão de bolsas, mentorias, autenticação, pagamentos e solicitações de mentoria.

Tecnologias

- Node.js
- TypeScript
- Fastify ou Express (confirmar o framework utilizado)
- PostgreSQL
- SQL

Requisitos

- Node.js instalado
- PostgreSQL instalado e configurado
- npm

Instalação

npm install

Configuração

Cria um ficheiro ".env" na raiz do projeto e configura as variáveis de ambiente necessárias.

Não publiques o ficheiro ".env" no GitHub.

Executar

npm run dev

Consulta o "package.json" para confirmar os comandos disponíveis.

Estrutura do projeto

backend/
├── sql/
├── src/
│   ├── configuracao/
│   ├── controladores/
│   ├── esquemas/
│   ├── rotas/
│   ├── aplicacao.ts
│   └── servidor.ts
├── package.json
└── README.md

Funcionalidades

- Autenticação
- Gestão de bolsas
- Gestão de mentorias
- Solicitações de mentoria
- Pagamentos

Estado do projeto

Em desenvolvimento.

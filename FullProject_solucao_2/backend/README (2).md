# Plataforma de Bolsas — Backend

Primeira versão do backend da plataforma de bolsas de estudo e mentorias, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## Requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL 14 ou superior

## Instalação

1. Crie uma base de dados PostgreSQL chamada `plataformaBolsas`.
2. Instale as dependências na pasta do projeto:

   ```bash
   npm install
   ```

3. Copie o ficheiro de exemplo e configure as credenciais:

   ```bash
   cp .env.exemplo .env
   ```

4. Edite o `.env`, preenchendo os dados corretos do PostgreSQL e um segredo JWT forte.
5. Execute a migração SQL:

   ```bash
   psql -U postgres -d plataformaBolsas -v ON_ERROR_STOP=1 -f sql/001_criarEstrutura.sql
   ```

   Se o utilizador ou o nome da base de dados forem diferentes, ajuste o comando.

## Executar

Verifique os tipos TypeScript:

```bash
npm run verificar
```

Inicie o servidor em modo de desenvolvimento:

```bash
npm run desenvolvimento
```

A API ficará disponível, por padrão, em `http://localhost:3000`.

Verifique se o servidor está ativo abrindo `http://localhost:3000/saude`.

## Funcionalidades incluídas

- Registo e autenticação de utilizadores com palavra-passe protegida por hash.
- Autenticação por JWT.
- Middlewares de autenticação e autorização.
- Listagem pública de bolsas publicadas.
- Criação, edição, publicação e remoção de bolsas por administradores.

## Rotas principais

| Método | Rota | Acesso |
|---|---|---|
| `POST` | `/api/autenticacao/registar` | Público |
| `POST` | `/api/autenticacao/iniciarSessao` | Público |
| `GET` | `/api/autenticacao/perfil` | Autenticado |
| `GET` | `/api/bolsas` | Público |
| `GET` | `/api/bolsas/:id` | Público |
| `GET` | `/api/bolsas/administracao` | Administrador |
| `POST` | `/api/bolsas` | Administrador |
| `PATCH` | `/api/bolsas/:id` | Administrador |
| `PATCH` | `/api/bolsas/:id/publicar` | Administrador |
| `DELETE` | `/api/bolsas/:id` | Administrador |

## Segurança

- Não partilhe nem publique o ficheiro `.env`.
 
* .env
    PORTA=3000
   URL_BANCO=postgresql://postgres:senhaBancoDados@localhost:5432/bolsas_estudo
   SEGREDO_JWT=chave JWT
   ORIGEM_FRONTEND=http://localhost:5173
   AMBIENTE=desenvolvimento
 
 *Chave JWT de 32 chars: openssl rand -hex 32

- Não utilize segredos de exemplo em ambientes reais.
- O registo público não permite criar contas de administrador.

## Estado

Esta é a primeira versão do módulo do Programador 1. Os módulos de mentorias, solicitações e pagamentos serão desenvolvidos separadamente e integrados posteriormente.

criar senha:

 node -e "const bcrypt = require('bcrypt'); bcrypt.hash('teste', 12).then(console.log).catch(console.error)"

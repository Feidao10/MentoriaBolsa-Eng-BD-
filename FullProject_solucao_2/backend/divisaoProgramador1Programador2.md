DIVISÃO DE TAREFAS — DESENVOLVIMENTO DO BACKEND

Plataforma de Bolsas de Estudo e Mentorias

1. Objetivo

Dividir o desenvolvimento do backend entre dois programadores, permitindo trabalho independente nos respetivos módulos e facilitando a integração com o frontend.

Tecnologias: Node.js, Express, TypeScript, PostgreSQL e JWT.

---

2. Programador 1 — Infraestrutura, autenticação e bolsas

Responsabilidade principal: desenvolver a infraestrutura central do backend, gerir os utilizadores e implementar o módulo de bolsas de estudo.

2.1. Infraestrutura

- Configurar o servidor Express.
- Configurar a ligação ao PostgreSQL e o pool de conexões.
- Configurar variáveis de ambiente.
- Configurar CORS e "express.json()".
- Implementar o tratamento centralizado de erros.
- Configurar a rota de saúde da API.

2.2. Base de dados

- Criar as migrações das tabelas "utilizadores" e "bolsasEstudo".
- Definir chaves primárias, chaves estrangeiras, restrições e índices.
- Garantir a consistência dos dados.

2.3. Autenticação e autorização

- Implementar o registo e o início de sessão.
- Aplicar bcrypt para proteger as palavras-passe.
- Implementar autenticação com JWT.
- Criar os middlewares "verificarAutenticacao" e "verificarPermissao".
- Disponibilizar os dados do utilizador autenticado através de "pedido.utilizador".

2.4. Módulo de bolsas

- Criar, consultar, atualizar e gerir bolsas.
- Implementar a publicação e a retirada de publicação.
- Restringir as operações administrativas a utilizadores autorizados.
- Validar os dados recebidos e tratar erros.

2.5. Entregáveis

- Servidor Express funcional.
- Pool PostgreSQL partilhado.
- Migrações das tabelas de utilizadores e bolsas.
- Módulo de autenticação e middlewares.
- Rotas de bolsas documentadas e testadas.

---

3. Programador 2 — Mentorias, solicitações e pagamentos

Responsabilidade principal: desenvolver os módulos de negócio relacionados com mentorias, pedidos de mentoria e pagamentos, utilizando a infraestrutura criada pelo Programador 1.

3.1. Base de dados

Criar a migração "002", contendo as tabelas:

- "mentorias"
- "solicitacoesMentoria"
- "pagamentos"

Definir as relações com "utilizadores" e as respetivas chaves estrangeiras, restrições e índices.

3.2. Módulo de mentorias

- Criar e consultar mentorias.
- Atualizar mentorias.
- Permitir que apenas o mentor proprietário ou um administrador edite a mentoria.
- Validar preços e outros dados.
- Gerir o estado ativo ou inativo das mentorias.

3.3. Módulo de solicitações

- Permitir que candidatos solicitem mentorias.
- Consultar solicitações próprias e recebidas.
- Permitir que o mentor responsável aceite ou recuse solicitações.
- Impedir solicitações duplicadas enquanto existir uma solicitação pendente ou aceite.
- Validar permissões e transições de estado.

3.4. Módulo de pagamentos

- Criar o registo de pagamento associado à solicitação.
- Consultar os pagamentos do utilizador autorizado.
- Controlar os estados do pagamento.
- Garantir que os valores correspondem ao preço da mentoria.
- Impedir alterações não autorizadas.

Nota: o registo de um pagamento não significa que o dinheiro foi efetivamente recebido. A confirmação financeira deve depender do mecanismo de pagamento implementado.

3.5. Entregáveis

- Migração "002" executável após a migração "001".
- Rotas de mentorias, solicitações e pagamentos.
- Controladores, validações e regras de autorização.
- Testes dos fluxos principais e dos casos de erro.

---

4. Contrato de integração entre os programadores

Para evitar incompatibilidades, ambos devem respeitar os seguintes pontos.

Elemento| Regra partilhada
Linguagem| TypeScript em modo estrito
Servidor| Uma única aplicação Express
Base de dados| Um único pool PostgreSQL
Autenticação| Middleware do Programador 1
Utilizador autenticado| "pedido.utilizador!.id" e "pedido.utilizador!.tipo", após validar a autenticação
Nomes| Português, "camelCase" e PascalCase para tipos/classes
SQL| Identificadores camelCase entre aspas duplas, quando aplicável
Respostas| JSON com estrutura consistente
Erros| Utilizar o tratamento centralizado de erros
Migrações| "001" para utilizadores/bolsas; "002" para mentorias/solicitações/pagamentos

O Programador 2 não deve criar uma segunda aplicação Express, um segundo servidor ou um pool de conexões independente.

---

5. Rotas previstas

Programador 1

Método| Rota| Finalidade
POST| "/api/autenticacao/registar"| Registar utilizador
POST| "/api/autenticacao/iniciarSessao"| Iniciar sessão
GET| "/api/autenticacao/perfil"| Consultar perfil autenticado
GET| "/api/bolsas"| Listar bolsas públicas
POST| "/api/bolsas"| Criar bolsa
GET| "/api/bolsas/:id"| Consultar bolsa
PATCH| "/api/bolsas/:id"| Atualizar bolsa

As rotas administrativas de publicação e gestão devem seguir a implementação acordada pelo Programador 1.

Programador 2

Método| Rota| Finalidade
GET| "/api/mentorias"| Listar mentorias
POST| "/api/mentorias"| Criar mentoria
GET| "/api/mentorias/:id"| Consultar mentoria
PATCH| "/api/mentorias/:id"| Atualizar mentoria
POST| "/api/solicitacoesMentoria"| Criar solicitação
GET| "/api/solicitacoesMentoria/minhas"| Consultar solicitações próprias
GET| "/api/solicitacoesMentoria/recebidas"| Consultar solicitações recebidas
PATCH| "/api/solicitacoesMentoria/:id/estado"| Aceitar ou recusar solicitação
GET| "/api/pagamentos/meus"| Consultar pagamentos próprios

As rotas e os métodos acima constituem o contrato previsto. Ambos devem confirmar os caminhos efetivamente implementados antes de integrar o frontend.

---

6. Como evitar conflitos durante o desenvolvimento

1. O Programador 1 disponibiliza os tipos de utilizador, a estrutura de "pedido.utilizador", o pool PostgreSQL, os middlewares e o formato de erros.
2. O Programador 2 desenvolve os seus módulos importando esses elementos, sem os duplicar.
3. Antes de implementar cada rota, ambos acordam o método HTTP, o caminho, os campos de entrada, a resposta JSON e os códigos de estado.
4. Cada programador testa o seu módulo de forma independente.
5. A integração é feita através da aplicação Express principal, registando todos os routers antes da rota de "404".
6. As migrações são executadas numa ordem definida: primeiro "001", depois "002".
7. Antes de integrar com o frontend, ambos executam os testes de integração e verificam os fluxos completos.

---

7. Critérios de conclusão

Programador 1

- [ ] Servidor e PostgreSQL funcionais.
- [ ] Registo, login e perfil testados.
- [ ] JWT e permissões validados.
- [ ] Operações de bolsas testadas.
- [ ] Migração "001" funcional.

Programador 2

- [ ] Migração "002" funcional.
- [ ] Operações de mentorias testadas.
- [ ] Solicitações e transições de estado validadas.
- [ ] Pagamentos associados corretamente às solicitações.
- [ ] Acesso indevido bloqueado.
- [ ] Rotas testadas com tokens válidos e inválidos.

Critério conjunto: o backend deve funcionar com a mesma base de dados e aplicação, sem duplicação de infraestrutura, antes de se iniciar a integração final com o frontend.
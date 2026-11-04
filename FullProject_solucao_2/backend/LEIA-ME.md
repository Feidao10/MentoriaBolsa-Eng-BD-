# Plataforma de Bolsas — Programador 1

## Parte 1 — Entrega e requisitos

Este repositório contém exclusivamente a infraestrutura base, autenticação, utilizadores e CRUD de bolsas de estudo. A implementação dos módulos do Programador 2 **não** está incluída. Código TypeScript e SQL possui comentários explicativos junto das instruções. Os ficheiros de configuração JSON mantêm a sintaxe própria do formato.

### Requisitos de execução

- Node.js 20 ou superior (recomendado: 22 LTS) e npm compatível.
- PostgreSQL 14 ou superior, com base de dados criada e credenciais com acesso.
- Terminal com `psql` disponível para aplicar a migração (ou cliente SQL equivalente).
- Ficheiro `.env` local com segredo JWT aleatório de pelo menos 32 caracteres.
- Acesso às dependências npm na instalação inicial.
- Uma origem conhecida para o frontend (por exemplo, `http://localhost:5173`).

### Instalação local

1. Criar uma base PostgreSQL chamada `plataformaBolsas` (nome exemplificativo): `createdb -U postgres plataformaBolsas`.
2. Na raiz do projeto: `npm install`.
3. Copiar `.env.exemplo` para `.env` e substituir as credenciais, segredo e origem do frontend. **Não versionar `.env`.**
4. Executar a migração: `psql -U postgres -d plataformaBolsas -v ON_ERROR_STOP=1 -f sql/001_criarEstrutura.sql`. Ajustar utilizador e base conforme o ambiente.
5. Executar `npm run verificar` para verificar os tipos.
6. Executar `npm run desenvolvimento` para iniciar o servidor com atualização automática.
7. Verificar `GET http://localhost:3000/saude`.
8. Para produção: `npm run compilar` e `npm run iniciar`, com variáveis de ambiente adequadas e HTTPS através de infraestrutura própria.

**Atenção:** executar a migração antes de iniciar o serviço. `IF NOT EXISTS` não substitui uma ferramenta de versionamento de migrações para futuras alterações de esquema.

### Criar o primeiro administrador

O registo público aceita apenas `candidato` ou `mentor`. Para testes locais, criar uma conta normalmente e, usando exclusivamente uma conta PostgreSQL de administração confiável, executar a instrução seguinte após substituir o email:

```sql
-- Promove manualmente uma conta previamente verificada em ambiente controlado.
UPDATE "utilizadores" SET "tipo" = 'administrador' WHERE "email" = 'admin@example.com';
```

Em seguida, **iniciar sessão novamente** para obter um token com o novo papel. Nunca disponibilizar esta promoção numa rota pública.

### Contrato HTTP

Todas as respostas de sucesso são JSON, salvo DELETE (204 sem corpo). Erros seguem `{ "erro": "mensagem" }`; erros de validação incluem `detalhes`. Pedidos com corpo devem usar `Content-Type: application/json`. Rotas protegidas recebem `Authorization: Bearer <token>`.

| Método | Rota | Acesso | Corpo / resultado |
|---|---|---|---|
| POST | `/api/autenticacao/registar` | Público | `{nomeCompleto,email,palavraPasse,tipo}`; 201 `{utilizador}` |
| POST | `/api/autenticacao/iniciarSessao` | Público | `{email,palavraPasse}`; 200 `{token,utilizador}` |
| GET | `/api/autenticacao/perfil` | Autenticado | 200 `{utilizador}` |
| GET | `/api/bolsas` | Público | 200 `{bolsas:[]}`; apenas publicadas |
| GET | `/api/bolsas/:id` | Público | 200 `{bolsa}`; apenas publicada |
| GET | `/api/bolsas/administracao` | Administrador | 200 `{bolsas:[]}`; todos os estados |
| POST | `/api/bolsas` | Administrador | Campos de CriarBolsaSchema; 201 `{bolsa}` em rascunho |
| PATCH | `/api/bolsas/:id` | Administrador | Subconjunto dos campos de criação; 200 `{bolsa}` |
| PATCH | `/api/bolsas/:id/publicar` | Administrador | Sem corpo; 200 `{bolsa}` |
| PATCH | `/api/bolsas/:id/retirarPublicacao` | Administrador | Sem corpo; 200 `{bolsa}` |
| DELETE | `/api/bolsas/:id` | Administrador | 204 sem corpo |
| GET | `/saude` | Público | `{estado:"ativo"}` |

**Exemplo de registo:**

```json
{"nomeCompleto":"Pessoa Exemplo","email":"pessoa@example.com","palavraPasse":"UmaSenhaForte123!","tipo":"candidato"}
```

**Exemplo de criação de bolsa:**

```json
{"titulo":"Bolsa de Engenharia","descricao":"Oportunidade de estudos superiores na área de engenharia.","instituicao":"Instituição Exemplo","pais":"Angola","requisitos":"Ensino médio concluído","prazoCandidatura":"2027-03-01","ligacaoOficial":"https://example.org/bolsa"}
```

### Limitações conscientes desta primeira entrega

Não inclui testes automatizados, limitação de tentativas de login, recuperação de palavra-passe, revogação imediata de JWT, auditoria, paginação, documentação OpenAPI nem integração de pagamentos. Antes de expor publicamente, acrescentar estas proteções e configurar TLS, backups, monitorização e gestão segura de segredos. O papel é transportado no JWT até expirar (2 horas): alterações de papel não revogam automaticamente tokens já emitidos.

Consultar `documentacao/transicaoProgramador2.md` antes de integrar o segundo módulo.

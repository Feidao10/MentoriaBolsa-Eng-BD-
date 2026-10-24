# Parte 3 — Relatório de transição para o Programador 2

## Entregue pelo Programador 1

- `src/aplicacao.ts`: instância única `aplicacao` do Express; registar novas rotas **antes** do middleware 404 e de `tratarErros`.
- `src/servidor.ts`: único ponto de arranque. Não criar outro `listen`.
- `src/configuracao/banco.ts`: pool partilhada `banco`; importar em vez de abrir outra pool.
- `src/configuracao/ambiente.ts`: configuração validada `ambiente`.
- `src/tipos/dominio.ts`: `TipoUtilizador`, `EstadoBolsa`, `UtilizadorAutenticado`, `UtilizadorPublico`.
- `src/tipos/express.d.ts`: ampliação global de `Express.Request` com `utilizador?: UtilizadorAutenticado`.
- `src/intermediarios/verificarAutenticacao.ts`: `verificarAutenticacao` valida assinatura JWT e coloca `pedido.utilizador`.
- `src/intermediarios/verificarPermissao.ts`: `verificarPermissao(...tiposPermitidos)` verifica o papel; **sempre depois** de `verificarAutenticacao`.
- `src/utilitarios/assincrono.ts`: `assincrono` encaminha erros de funções assíncronas ao middleware central.
- `src/utilitarios/erros.ts`: `ErroHttp` e `tratarErros`.
- `sql/001_criarEstrutura.sql`: tabelas `"utilizadores"` e `"bolsasEstudo"` com IDs INTEGER, `"tipo"` em texto controlado e FK `"criadoPor"`.

## Contrato JWT

O token é assinado com HS256 e segredo `SEGREDO_JWT`, expira em 2 horas. Payload lógico: `{ "sub": "123", "tipo": "candidato", "iat": ..., "exp": ... }`. `sub` é **string** que representa um inteiro positivo. `tipo` é `candidato`, `mentor` ou `administrador`. Não criar um segundo formato de token; após o middleware, usar `pedido.utilizador!.id` e `pedido.utilizador!.tipo`. Nunca confiar em IDs ou papéis enviados no corpo do pedido para identificar o solicitante.

## Trabalho exclusivo do Programador 2

Criar nova migração `sql/002_criarMentorias.sql`, aplicada **depois** da primeira. Não editar `001_criarEstrutura.sql` nem as duas tabelas existentes. Criar:

1. `"mentorias"`: `"id"` INTEGER identity PK, `"mentorId"` INTEGER FK para `"utilizadores"("id")`, `"titulo"`, `"descricao"`, `"preco"` NUMERIC(12,2) com CHECK >= 0, `"ativa"` BOOLEAN, `"dataCriacao"` TIMESTAMPTZ. Validar na lógica que `mentorId` pertence a utilizador de papel `mentor` (ou estabelecer regra explícita para administradores).
2. `"solicitacoesMentoria"`: `"id"` INTEGER identity PK, `"mentoriaId"` FK para `"mentorias"`, `"candidatoId"` FK para `"utilizadores"`, `"estado"` VARCHAR com CHECK (`pendente`, `aceite`, `recusada`, `cancelada`), `"dataCriacao"` TIMESTAMPTZ. Restringir consulta a candidato dono, mentor associado ou administrador.
3. `"pagamentos"`: `"id"` INTEGER identity PK, `"solicitacaoId"` FK para `"solicitacoesMentoria"`, `"valor"` NUMERIC(12,2), `"estado"` CHECK (`pendente`, `confirmado`, `cancelado`), `"dataCriacao"` TIMESTAMPTZ. O MVP **não processa pagamentos reais**: nunca marcar como confirmado por simples pedido do cliente; reservar confirmação a integração futura confiável ou processo administrativo auditável. Definir se há um pagamento por solicitação (UNIQUE) e manter valores monetários em decimal/strings, não float JS.

Criar ficheiros de nomes portugueses em `src/esquemas/`, `src/controladores/` e `src/rotas/`, com PascalCase para tipos/interfaces/schemas/enums e camelCase para funções/variáveis/atributos/tabelas/colunas. Todos os identificadores SQL camelCase devem estar entre aspas duplas. Documentar e comentar o código TypeScript/SQL linha por linha.

### Rotas sugeridas do Programador 2

| Método | Rota | Permissão |
|---|---|---|
| GET | `/api/mentorias` | Público: listar ativas |
| GET | `/api/mentorias/:id` | Público: consultar ativa |
| POST | `/api/mentorias` | Mentor autenticado: criar para si |
| PATCH | `/api/mentorias/:id` | Mentor proprietário ou administrador |
| POST | `/api/solicitacoesMentoria` | Candidato autenticado |
| GET | `/api/solicitacoesMentoria/minhas` | Candidato autenticado |
| GET | `/api/solicitacoesMentoria/recebidas` | Mentor autenticado: só as suas |
| PATCH | `/api/solicitacoesMentoria/:id/estado` | Participante autorizado, conforme transição permitida |
| GET | `/api/pagamentos/meus` | Candidato autenticado: só os seus |

### Exemplo de integração (instruções, não ficheiro implementado)

```typescript
// Importar os papéis partilhados, sem os redefinir.
import { TipoUtilizador } from "../tipos/dominio";
// Importar os dois middlewares existentes.
import { verificarAutenticacao } from "../intermediarios/verificarAutenticacao";
import { verificarPermissao } from "../intermediarios/verificarPermissao";
// Usar sempre a pool já criada pelo Programador 1.
import { banco } from "../configuracao/banco";
// Aplicar autenticação antes da autorização.
rotasMentorias.post("/", verificarAutenticacao, verificarPermissao(TipoUtilizador.Mentor), criarMentoria);
// Consultar o ID confiável no pedido, não no corpo fornecido pelo cliente.
const mentorId = pedido.utilizador!.id;
```

Registar em `src/aplicacao.ts`, antes do 404:

```typescript
// Importar o router criado pelo Programador 2.
import { rotasMentorias } from "./rotas/mentorias";
// Registar as rotas de mentorias no prefixo combinado.
aplicacao.use("/api/mentorias", rotasMentorias);
```

Repetir para solicitações e pagamentos. Não criar segunda configuração de ambiente, outro servidor, outro tipo `TipoUtilizador` ou uma segunda definição de `Express.Request`. Não mudar os endpoints do Programador 1 sem acordo com o Team 1. A integração final deve verificar `npm run verificar`, testar permissões, aplicar ambas as migrações numa base vazia e percorrer os fluxos do frontend.

### Decisões a confirmar em conjunto

- Se pagamentos pendentes nascem automaticamente ao solicitar mentoria e se o preço fica congelado na solicitação ou no pagamento.
- Política de eliminação de mentorias/solicitações para preservar histórico e referências.
- Regras de alteração de estado e prevenção de pedidos duplicados.
- Contrato exato dos corpos JSON a combinar com o Team 1 antes da implementação.

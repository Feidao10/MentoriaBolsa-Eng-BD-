-- =====================================================================
-- ESQUEMA FINAL DA BASE DE DADOS bolsas_estudo
-- Integra as tabelas do Programador 1 e do Programador 2.
--
-- IMPORTANTE:
-- 1. Executar este ficheiro numa base de dados VAZIA chamada bolsas_estudo.
-- 2. Este ficheiro cria tabelas e índices; não apaga nem cria a base de dados.
-- 3. As tabelas são criadas pela ordem das suas dependências de chaves estrangeiras.
-- 4. Execute o ficheiro inteiro: a transação reverte tudo se houver um erro.
-- =====================================================================

-- Inicia uma transação para criar o esquema completo de forma atómica.
BEGIN;

-- =====================================================================
-- PROGRAMADOR 1: UTILIZADORES
-- =====================================================================

-- Cria a tabela central de contas usada pelos dois módulos.
CREATE TABLE "utilizadores" (
  -- Gera automaticamente um ID inteiro para cada utilizador.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Guarda o nome completo, limitado a 120 caracteres.
  "nomeCompleto" VARCHAR(120) NOT NULL,
  -- Guarda o email e impede duplicados.
  "email" VARCHAR(254) NOT NULL UNIQUE,
  -- Guarda o hash bcrypt, nunca a palavra-passe em texto simples.
  "palavraPasseHash" VARCHAR(100) NOT NULL,
  -- Restringe os papéis aos valores partilhados pelo contrato da API.
  "tipo" VARCHAR(20) NOT NULL CHECK ("tipo" IN ('candidato', 'mentor', 'administrador')),
  -- Guarda a data e hora de criação no servidor PostgreSQL.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- PROGRAMADOR 1: BOLSAS DE ESTUDO
-- =====================================================================

-- Cria a tabela de bolsas sem depender de tabelas do módulo de mentorias.
CREATE TABLE "bolsasEstudo" (
  -- Gera automaticamente um ID inteiro para cada bolsa.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Guarda o título público da oportunidade.
  "titulo" VARCHAR(180) NOT NULL,
  -- Guarda a descrição completa da bolsa.
  "descricao" TEXT NOT NULL,
  -- Guarda o nome da instituição responsável pela oportunidade.
  "instituicao" VARCHAR(180) NOT NULL,
  -- Guarda o país da oportunidade.
  "pais" VARCHAR(100) NOT NULL,
  -- Guarda os requisitos de candidatura.
  "requisitos" TEXT NOT NULL,
  -- Guarda a data limite, caso tenha sido definida.
  "prazoCandidatura" DATE,
  -- Guarda a ligação oficial, caso seja fornecida.
  "ligacaoOficial" VARCHAR(2048),
  -- Mantém novas bolsas em rascunho até um administrador as publicar.
  "estado" VARCHAR(20) NOT NULL DEFAULT 'rascunho'
    CHECK ("estado" IN ('rascunho', 'publicada')),
  -- Liga a bolsa ao utilizador que a criou.
  "criadoPor" INTEGER NOT NULL
    REFERENCES "utilizadores"("id") ON DELETE RESTRICT,
  -- Regista a data e hora de criação.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Regista a data e hora da última atualização.
  "dataAtualizacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Acelera a listagem de bolsas por estado e data de criação.
CREATE INDEX "indiceBolsasEstadoCriacao"
  ON "bolsasEstudo" ("estado", "dataCriacao" DESC);

-- =====================================================================
-- PROGRAMADOR 2: MENTORIAS
-- =====================================================================

-- Cria as ofertas de mentoria associadas a contas de utilizadores.
CREATE TABLE "mentorias" (
  -- Gera automaticamente um ID inteiro para cada oferta.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Liga a mentoria ao seu proprietário; preserva referências históricas.
  "mentorId" INTEGER NOT NULL
    REFERENCES "utilizadores"("id") ON DELETE RESTRICT,
  -- Guarda o título da oferta.
  "titulo" VARCHAR(180) NOT NULL,
  -- Guarda a descrição da oferta.
  "descricao" TEXT NOT NULL,
  -- Guarda o preço com precisão decimal e permite mentorias gratuitas.
  "preco" NUMERIC(12,2) NOT NULL CHECK ("preco" >= 0),
  -- Permite desativar uma oferta sem apagar o histórico.
  "ativa" BOOLEAN NOT NULL DEFAULT TRUE,
  -- Regista a data e hora da criação.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Acelera as consultas das mentorias de um mentor.
CREATE INDEX "indiceMentoriasMentorAtiva"
  ON "mentorias" ("mentorId", "ativa", "dataCriacao" DESC);

-- Acelera a listagem pública das mentorias que ainda estão ativas.
CREATE INDEX "indiceMentoriasAtivasData"
  ON "mentorias" ("dataCriacao" DESC)
  WHERE "ativa" = TRUE;

-- =====================================================================
-- PROGRAMADOR 2: SOLICITAÇÕES DE MENTORIA
-- =====================================================================

-- Cria os pedidos dos candidatos para mentorias específicas.
CREATE TABLE "solicitacoesMentoria" (
  -- Gera automaticamente um ID inteiro para cada solicitação.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Liga o pedido à mentoria solicitada e preserva a referência histórica.
  "mentoriaId" INTEGER NOT NULL
    REFERENCES "mentorias"("id") ON DELETE RESTRICT,
  -- Liga o pedido ao candidato que o submeteu.
  "candidatoId" INTEGER NOT NULL
    REFERENCES "utilizadores"("id") ON DELETE RESTRICT,
  -- Define o estado inicial e restringe os estados permitidos.
  "estado" VARCHAR(20) NOT NULL DEFAULT 'pendente'
    CHECK ("estado" IN ('pendente', 'aceite', 'recusada', 'cancelada')),
  -- Regista a data e hora da solicitação.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Impede que o mesmo candidato tenha mais de uma solicitação pendente ou aceite
-- para a mesma mentoria; permite um novo pedido depois de recusa/cancelamento.
CREATE UNIQUE INDEX "indiceSolicitacaoAtivaPorCandidatoMentoria"
  ON "solicitacoesMentoria" ("candidatoId", "mentoriaId")
  WHERE "estado" IN ('pendente', 'aceite');

-- Acelera a listagem das solicitações pertencentes a cada candidato.
CREATE INDEX "indiceSolicitacoesCandidatoData"
  ON "solicitacoesMentoria" ("candidatoId", "dataCriacao" DESC);

-- Acelera a consulta de pedidos por mentoria, estado e data.
CREATE INDEX "indiceSolicitacoesMentoriaEstado"
  ON "solicitacoesMentoria" ("mentoriaId", "estado", "dataCriacao" DESC);

-- =====================================================================
-- PROGRAMADOR 2: PAGAMENTOS
-- =====================================================================

-- Guarda o registo do pagamento associado a cada solicitação.
-- O MVP não processa dinheiro real nem permite confirmação pelo cliente.
CREATE TABLE "pagamentos" (
  -- Gera automaticamente um ID inteiro para cada pagamento.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Garante no máximo um registo de pagamento por solicitação.
  "solicitacaoId" INTEGER NOT NULL UNIQUE
    REFERENCES "solicitacoesMentoria"("id") ON DELETE RESTRICT,
  -- Guarda o valor decimal congelado no momento da solicitação.
  "valor" NUMERIC(12,2) NOT NULL CHECK ("valor" >= 0),
  -- Mantém o pagamento pendente até uma confirmação confiável futura.
  "estado" VARCHAR(20) NOT NULL DEFAULT 'pendente'
    CHECK ("estado" IN ('pendente', 'confirmado', 'cancelado')),
  -- Regista a data e hora de criação do registo.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Acelera a consulta de pagamentos por estado e data.
CREATE INDEX "indicePagamentosEstadoData"
  ON "pagamentos" ("estado", "dataCriacao" DESC);

-- Confirma a criação conjunta das cinco tabelas e dos índices.
COMMIT;

-- =====================================================================
-- NOTAS DE INTEGRIDADE DA APLICAÇÃO
-- =====================================================================
-- A API deve confirmar que mentorId pertence a uma conta com tipo 'mentor'.
-- A API deve obter candidatoId/mentorId do utilizador autenticado, não do corpo.
-- A API deve criar a solicitação e o pagamento pendente na mesma transação,
-- copiando o preço atual da mentoria para pagamentos.valor.
-- Não existe qualquer mecanismo SQL para marcar pagamentos como confirmados:
-- a confirmação futura exige processo administrativo auditável ou integração confiável.

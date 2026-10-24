-- Inicia uma transação para criar toda a estrutura de forma atómica.
BEGIN;
-- Cria a tabela partilhada de utilizadores, se ainda não existir.
CREATE TABLE IF NOT EXISTS "utilizadores" (
  -- Cria o identificador numérico gerado automaticamente.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Guarda o nome completo do utilizador.
  "nomeCompleto" VARCHAR(120) NOT NULL,
  -- Guarda o email normalizado, sem duplicados.
  "email" VARCHAR(254) NOT NULL UNIQUE,
  -- Guarda somente o hash bcrypt, nunca a palavra-passe original.
  "palavraPasseHash" VARCHAR(100) NOT NULL,
  -- Restringe o papel aos três valores definidos no contrato.
  "tipo" VARCHAR(20) NOT NULL CHECK ("tipo" IN ('candidato', 'mentor', 'administrador')),
  -- Regista a data de criação no servidor de base de dados.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- Conclui a declaração da tabela de utilizadores.
);
-- Cria a tabela de bolsas de estudo, se ainda não existir.
CREATE TABLE IF NOT EXISTS "bolsasEstudo" (
  -- Cria o identificador numérico da bolsa.
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Guarda o título da bolsa.
  "titulo" VARCHAR(180) NOT NULL,
  -- Guarda a descrição completa da oportunidade.
  "descricao" TEXT NOT NULL,
  -- Guarda o nome da instituição responsável.
  "instituicao" VARCHAR(180) NOT NULL,
  -- Guarda o país da oportunidade.
  "pais" VARCHAR(100) NOT NULL,
  -- Guarda os requisitos de candidatura.
  "requisitos" TEXT NOT NULL,
  -- Guarda opcionalmente a data limite da candidatura.
  "prazoCandidatura" DATE,
  -- Guarda opcionalmente a ligação oficial da bolsa.
  "ligacaoOficial" VARCHAR(2048),
  -- Mantém novas bolsas em rascunho até publicação explícita.
  "estado" VARCHAR(20) NOT NULL DEFAULT 'rascunho' CHECK ("estado" IN ('rascunho', 'publicada')),
  -- Identifica o administrador responsável pela criação.
  "criadoPor" INTEGER NOT NULL REFERENCES "utilizadores"("id") ON DELETE RESTRICT,
  -- Guarda o instante de criação da bolsa.
  "dataCriacao" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Guarda o instante da última modificação.
  "dataAtualizacao" TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- Conclui a declaração da tabela de bolsas.
);
-- Cria um índice para acelerar a listagem pública por estado e data.
CREATE INDEX IF NOT EXISTS "indiceBolsasEstadoCriacao" ON "bolsasEstudo" ("estado", "dataCriacao" DESC);
-- Confirma a criação das tabelas e do índice.
COMMIT;

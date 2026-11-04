// Importa a ligação partilhada ao PostgreSQL.
import { banco } from "../configuracao/banco";
// Importa o tipo da ligação transacional do PostgreSQL.
import type { PoolClient } from "pg";
// Encaminha os erros de consultas assíncronas para o middleware central.
import { assincrono } from "../utilitarios/assincrono";

// Regista um pagamento pendente dentro da transação que cria a solicitação.
// Esta função interna não é uma rota HTTP e nunca confirma uma cobrança.
export const registarPagamentoPendente = async (cliente: PoolClient, solicitacaoId: number, valor: string) => {
  // Insere o valor congelado no momento do pedido, mantendo-o como texto decimal.
  const resultado = await cliente.query(
    `INSERT INTO "pagamentos" ("solicitacaoId", "valor") VALUES ($1, $2) RETURNING "id", "solicitacaoId", "valor"::text AS "valor", "estado", "dataCriacao"`,
    [solicitacaoId, valor]
  );
  // Devolve o novo registo pendente ao controlador que coordena a transação.
  return resultado.rows[0];
};

// Lista os pagamentos ligados exclusivamente às solicitações do candidato autenticado.
export const listarMeusPagamentos = assincrono(async (pedido, resposta) => {
  // Obtém o identificador apenas do JWT validado pelo middleware.
  const candidatoId = pedido.utilizador!.id;
  // Mantém valores monetários como texto decimal devolvido pelo PostgreSQL.
  const resultado = await banco.query(
    `SELECT p."id", p."solicitacaoId", p."valor"::text AS "valor", p."estado", p."dataCriacao", s."estado" AS "estadoSolicitacao", m."id" AS "mentoriaId", m."titulo" AS "mentoriaTitulo", u."nomeCompleto" AS "mentorNome" FROM "pagamentos" p JOIN "solicitacoesMentoria" s ON s."id" = p."solicitacaoId" JOIN "mentorias" m ON m."id" = s."mentoriaId" JOIN "utilizadores" u ON u."id" = m."mentorId" WHERE s."candidatoId" = $1 ORDER BY p."dataCriacao" DESC`,
    [candidatoId]
  );
  // Esta rota é apenas de consulta; não permite confirmar nem simular uma cobrança.
  resposta.json({ pagamentos: resultado.rows });
});

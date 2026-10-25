
import { banco } from "../configuracao/banco";

import { CriarBolsaSchema, AtualizarBolsaSchema, IdentificadorSchema } from "../esquemas/bolsas";

import { assincrono } from "../utilitarios/assincrono";

import { ErroHttp } from "../utilitarios/erros";

const camposBolsa = `"id", "titulo", "descricao", "instituicao", "pais", "requisitos", "prazoCandidatura", "ligacaoOficial", "estado", "criadoPor", "dataCriacao", "dataAtualizacao"`;

export const listarBolsas = assincrono(async (_pedido, resposta) => {
  
  const resultado = await banco.query(`SELECT ${camposBolsa} FROM "bolsasEstudo" WHERE "estado" = 'publicada' ORDER BY "dataCriacao" DESC`);
  
  resposta.json({ bolsas: resultado.rows });
});

export const consultarBolsa = assincrono(async (pedido, resposta) => {
  
  const id = IdentificadorSchema.parse(pedido.params.id);
  
  const resultado = await banco.query(`SELECT ${camposBolsa} FROM "bolsasEstudo" WHERE "id" = $1 AND "estado" = 'publicada'`, [id]);
  
  if (!resultado.rows[0]) {
    
    throw new ErroHttp(404, "Bolsa não encontrada");
  }
  
  resposta.json({ bolsa: resultado.rows[0] });
});

export const listarBolsasAdministracao = assincrono(async (_pedido, resposta) => {
  
  const resultado = await banco.query(`SELECT ${camposBolsa} FROM "bolsasEstudo" ORDER BY "dataCriacao" DESC`);
  
  resposta.json({ bolsas: resultado.rows });
});

export const criarBolsa = assincrono(async (pedido, resposta) => {
  
  const dados = CriarBolsaSchema.parse(pedido.body);
  
  const resultado = await banco.query(
    
    `INSERT INTO "bolsasEstudo" ("titulo", "descricao", "instituicao", "pais", "requisitos", "prazoCandidatura", "ligacaoOficial", "criadoPor") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${camposBolsa}`,
    
    [dados.titulo, dados.descricao, dados.instituicao, dados.pais, dados.requisitos, dados.prazoCandidatura ?? null, dados.ligacaoOficial ?? null, pedido.utilizador!.id]
  );
  
  resposta.status(201).json({ bolsa: resultado.rows[0] });
});

export const atualizarBolsa = assincrono(async (pedido, resposta) => {
  
  const id = IdentificadorSchema.parse(pedido.params.id);
  
  const dados = AtualizarBolsaSchema.parse(pedido.body);
  
  const entradas = Object.entries(dados);
  
  const atribuicoes = entradas.map(([campo], indice) => `"${campo}" = $${indice + 1}`).join(", ");
  
  const valores = entradas.map(([, valor]) => valor);
  
  const resultado = await banco.query(
    
    `UPDATE "bolsasEstudo" SET ${atribuicoes}, "dataAtualizacao" = NOW() WHERE "id" = $${valores.length + 1} RETURNING ${camposBolsa}`,
    
    [...valores, id]
  );
  
  if (!resultado.rows[0]) {
    
    throw new ErroHttp(404, "Bolsa não encontrada");
  }
  
  resposta.json({ bolsa: resultado.rows[0] });
});

export const publicarBolsa = assincrono(async (pedido, resposta) => {
  
  const id = IdentificadorSchema.parse(pedido.params.id);
  
  const resultado = await banco.query(`UPDATE "bolsasEstudo" SET "estado" = 'publicada', "dataAtualizacao" = NOW() WHERE "id" = $1 RETURNING ${camposBolsa}`, [id]);
  
  if (!resultado.rows[0]) {
    
    throw new ErroHttp(404, "Bolsa não encontrada");
  }
  
  resposta.json({ bolsa: resultado.rows[0] });
});

export const retirarPublicacao = assincrono(async (pedido, resposta) => {
  
  const id = IdentificadorSchema.parse(pedido.params.id);
  
  const resultado = await banco.query(`UPDATE "bolsasEstudo" SET "estado" = 'rascunho', "dataAtualizacao" = NOW() WHERE "id" = $1 RETURNING ${camposBolsa}`, [id]);
  
  if (!resultado.rows[0]) {
    
    throw new ErroHttp(404, "Bolsa não encontrada");
  }
  
  resposta.json({ bolsa: resultado.rows[0] });
});

export const eliminarBolsa = assincrono(async (pedido, resposta) => {
  
  const id = IdentificadorSchema.parse(pedido.params.id);
  
  const resultado = await banco.query(`DELETE FROM "bolsasEstudo" WHERE "id" = $1 RETURNING "id"`, [id]);
  
  if (!resultado.rows[0]) {
    
    throw new ErroHttp(404, "Bolsa não encontrada");
  }
  
  resposta.status(204).send();
});

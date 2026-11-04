//
import { banco } from "../configuracao/banco";

import {
  AtualizarMentoriaSchema,
  CriarMentoriaSchema,
  IdentificadorMentoriaSchema
} from "../esquemas/mentorias";

import { TipoUtilizador } from "../tipos/dominio";

import { assincrono } from "../utilitarios/assincrono";

import { ErroHttp } from "../utilitarios/erros";

// Enumera os campos devolvidos publicamente para uma oferta de mentoria.
const camposMentoria = `m."id", m."titulo", m."descricao", m."preco"::text AS "preco", m."ativa", m."mentorId", u."nomeCompleto" AS "mentorNome", m."dataCriacao"`;

// Lista apenas as ofertas ativas, incluindo o nome publico do mentor.
export const listarMentoriasDisponiveis = assincrono(async (_pedido, resposta) => {
  // Ordena por data de criacao mais recente sem revelar ofertas inativas.
  const resultado = await banco.query(
    `SELECT ${camposMentoria} FROM "mentorias" m JOIN "utilizadores" u ON u."id" = m."mentorId" WHERE m."ativa" = TRUE AND u."tipo" = 'mentor' ORDER BY m."dataCriacao" DESC`
  );
  // Devolve o conjunto de ofertas no contrato JSON da API.
  resposta.json({ mentorias: resultado.rows });
});

// Consulta os dados publicos de uma única oferta ativa.
export const obterDetalhesMentoria = assincrono(async (pedido, resposta) => {
  // Converte e valida o ID recebido pela rota.
  const id = IdentificadorMentoriaSchema.parse(pedido.params.id);
  // Exclui ofertas inativas e utilizadores que já não tenham papel de mentor.
  const resultado = await banco.query(
    `SELECT ${camposMentoria} FROM "mentorias" m JOIN "utilizadores" u ON u."id" = m."mentorId" WHERE m."id" = $1 AND m."ativa" = TRUE AND u."tipo" = 'mentor'`,
    [id]
  );
  // Não revela publicamente ofertas inativas nem inexistentes.
  if (!resultado.rows[0]) throw new ErroHttp(404, "Mentoria não encontrada");
  // Devolve os detalhes da oferta.
  resposta.json({ mentoria: resultado.rows[0] });
});

// Lista mentores com pelo menos uma oferta ativa.
export const listarMentores = assincrono(async (_pedido, resposta) => {
  // Expõe apenas dados de apresentação necessários para escolher um mentor.
  const resultado = await banco.query(
    `SELECT u."id", u."nomeCompleto", COUNT(m."id")::integer AS "quantidadeMentoriasDisponiveis" FROM "utilizadores" u JOIN "mentorias" m ON m."mentorId" = u."id" AND m."ativa" = TRUE WHERE u."tipo" = 'mentor' GROUP BY u."id", u."nomeCompleto" ORDER BY u."nomeCompleto" ASC`
  );
  // Devolve a lista sem e-mails ou outros dados pessoais.
  resposta.json({ mentores: resultado.rows });
});

// Lista todas as ofertas do mentor autenticado, incluindo ofertas pausadas.
export const listarMinhasMentorias = assincrono(async (pedido, resposta) => {
  // Obtém o identificador apenas do token validado pelo middleware partilhado.
  const mentorId = pedido.utilizador!.id;
  // Nunca aceita um identificador de mentor fornecido no corpo do pedido.
  const resultado = await banco.query(
    `SELECT ${camposMentoria} FROM "mentorias" m JOIN "utilizadores" u ON u."id" = m."mentorId" WHERE m."mentorId" = $1 ORDER BY m."dataCriacao" DESC`,
    [mentorId]
  );
  // Devolve apenas ofertas pertencentes à conta autenticada.
  resposta.json({ mentorias: resultado.rows });
});

// Cria uma oferta associada exclusivamente ao mentor autenticado.
export const criarMentoria = assincrono(async (pedido, resposta) => {
  // Valida os campos públicos e recusa atributos desconhecidos.
  const dados = CriarMentoriaSchema.parse(pedido.body);
  // Obtém a identidade confiável do middleware de autenticação.
  const mentorId = pedido.utilizador!.id;
  // Confirma na base de dados que a conta continua a ser um mentor.
  const utilizador = await banco.query(
    `SELECT "id" FROM "utilizadores" WHERE "id" = $1 AND "tipo" = 'mentor'`,
    [mentorId]
  );
  // Evita criar ofertas para contas apagadas ou cujo papel foi alterado.
  if (!utilizador.rows[0]) throw new ErroHttp(403, "Apenas uma conta de mentor pode criar ofertas");
  // Guarda o preço como texto decimal, sem o converter para Number.
  const resultado = await banco.query(
    `INSERT INTO "mentorias" ("mentorId", "titulo", "descricao", "preco") VALUES ($1, $2, $3, $4) RETURNING "id", "mentorId", "titulo", "descricao", "preco"::text AS "preco", "ativa", "dataCriacao"`,
    [mentorId, dados.titulo, dados.descricao, dados.preco]
  );
  // Confirma a criação com o código HTTP adequado.
  resposta.status(201).json({ mentoria: resultado.rows[0] });
});

// Atualiza uma oferta apenas para o mentor proprietário ou um administrador.
export const editarMentoria = assincrono(async (pedido, resposta) => {
  // Valida o identificador numérico da oferta.
  const id = IdentificadorMentoriaSchema.parse(pedido.params.id);
  // Valida e restringe os campos mutáveis.
  const dados = AtualizarMentoriaSchema.parse(pedido.body);
  // Obtém a oferta antes de alterar qualquer campo.
  const existente = await banco.query(
    `SELECT "id", "mentorId" FROM "mentorias" WHERE "id" = $1`,
    [id]
  );
  // Distingue uma oferta inexistente de uma operação não autorizada.
  if (!existente.rows[0]) throw new ErroHttp(404, "Mentoria não encontrada");
  // Verifica a propriedade, salvo quando o utilizador é administrador.
  const eAdministrador = pedido.utilizador!.tipo === TipoUtilizador.Administrador;
  if (existente.rows[0].mentorId !== pedido.utilizador!.id && !eAdministrador) {
    throw new ErroHttp(403, "Só o mentor proprietário ou um administrador pode editar esta mentoria");
  }
  // Converte apenas nomes de campos aprovados pelo esquema em atribuições SQL.
  const entradas = Object.entries(dados);
  const atribuicoes = entradas.map(([campo], indice) => `"${campo}" = $${indice + 1}`).join(", ");
  // Conserva os preços em texto e todos os valores como parâmetros SQL.
  const valores = entradas.map(([, valor]) => valor);
  // Atualiza exclusivamente a oferta identificada e devolve os seus novos campos.
  const resultado = await banco.query(
    `UPDATE "mentorias" SET ${atribuicoes} WHERE "id" = $${valores.length + 1} RETURNING "id", "mentorId", "titulo", "descricao", "preco"::text AS "preco", "ativa", "dataCriacao"`,
    [...valores, id]
  );
  // Devolve a versão atualizada da oferta.
  resposta.json({ mentoria: resultado.rows[0] });
});

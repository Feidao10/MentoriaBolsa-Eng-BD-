// Importa a ligação PostgreSQL partilhada com o resto da aplicação.
import { banco } from "../configuracao/banco";
// Importa os esquemas de validação das solicitações e respetivos IDs.
import {
  AtualizarEstadoSolicitacaoSchema,
  CriarSolicitacaoMentoriaSchema,
  IdentificadorSolicitacaoSchema
} from "../esquemas/mentorias";
// Importa os papéis de conta definidos pelo Programador 1.
import { TipoUtilizador } from "../tipos/dominio";
// Reutiliza a função interna de registo do pagamento pendente.
import { registarPagamentoPendente } from "./pagamentos";
// Encaminha falhas assíncronas para o middleware de erros comum.
import { assincrono } from "../utilitarios/assincrono";
// Permite devolver erros HTTP controlados.
import { ErroHttp } from "../utilitarios/erros";

// Cria uma solicitação e o respetivo pagamento pendente numa única transação.
export const criarSolicitacaoMentoria = assincrono(async (pedido, resposta) => {
  // Valida o ID da oferta; a identidade do candidato nunca vem do corpo.
  const dados = CriarSolicitacaoMentoriaSchema.parse(pedido.body);
  // Obtém o candidato do JWT validado pelo middleware.
  const candidatoId = pedido.utilizador!.id;
  // Pede uma ligação dedicada para preservar a atomicidade da transação.
  const cliente = await banco.connect();
  try {
    // Inicia a transação para impedir solicitações sem o respetivo pagamento.
    await cliente.query("BEGIN");
    // Confirma que a oferta está ativa e pertence a uma conta que continua a ser mentor.
    const mentoria = await cliente.query(
      `SELECT m."id", m."mentorId", m."preco"::text AS "preco" FROM "mentorias" m JOIN "utilizadores" u ON u."id" = m."mentorId" WHERE m."id" = $1 AND m."ativa" = TRUE AND u."tipo" = 'mentor' FOR SHARE OF m`,
      [dados.mentoriaId]
    );
    // Recusa ofertas inexistentes ou indisponíveis.
    if (!mentoria.rows[0]) throw new ErroHttp(404, "Mentoria não encontrada ou indisponível");
    // Impede uma conta de solicitar a própria oferta, se os papéis mudarem futuramente.
    if (mentoria.rows[0].mentorId === candidatoId) throw new ErroHttp(400, "Não pode solicitar a sua própria mentoria");
    // Insere a solicitação com o estado inicial definido pelo servidor.
    const solicitacao = await cliente.query(
      `INSERT INTO "solicitacoesMentoria" ("mentoriaId", "candidatoId") VALUES ($1, $2) RETURNING "id", "mentoriaId", "candidatoId", "estado", "dataCriacao"`,
      [dados.mentoriaId, candidatoId]
    );
    // Cria automaticamente um único pagamento pendente com o preço congelado.
    const pagamento = await registarPagamentoPendente(cliente, solicitacao.rows[0].id, mentoria.rows[0].preco);
    // Confirma ambos os registos apenas quando a operação inteira teve sucesso.
    await cliente.query("COMMIT");
    // Informa que os pedidos foram registados, sem afirmar que houve cobrança.
    resposta.status(201).json({ solicitacao: solicitacao.rows[0], pagamento });
  } catch (erro) {
    // Reverte a criação parcial em caso de erro.
    await cliente.query("ROLLBACK").catch(() => undefined);
    // Converte a restrição de solicitação duplicada num conflito HTTP compreensível.
    if (typeof erro === "object" && erro !== null && "code" in erro && (erro as { code?: string }).code === "23505") {
      throw new ErroHttp(409, "Já existe uma solicitação pendente ou aceite para esta mentoria");
    }
    // Mantém os erros de negócio e os erros inesperados no fluxo central.
    throw erro;
  } finally {
    // Devolve sempre a ligação à pool partilhada.
    cliente.release();
  }
});

// Lista apenas as solicitações pertencentes ao candidato autenticado.
export const listarMinhasSolicitacoes = assincrono(async (pedido, resposta) => {
  // Obtém o dono dos registos a partir do JWT verificado.
  const candidatoId = pedido.utilizador!.id;
  // Junta a oferta, o mentor e o valor do pagamento registado no momento da solicitação.
  const resultado = await banco.query(
    `SELECT s."id", s."mentoriaId", s."candidatoId", s."estado", s."dataCriacao", m."titulo" AS "mentoriaTitulo", u."id" AS "mentorId", u."nomeCompleto" AS "mentorNome", p."id" AS "pagamentoId", p."valor"::text AS "valorPagamento", p."estado" AS "estadoPagamento" FROM "solicitacoesMentoria" s JOIN "mentorias" m ON m."id" = s."mentoriaId" JOIN "utilizadores" u ON u."id" = m."mentorId" LEFT JOIN "pagamentos" p ON p."solicitacaoId" = s."id" WHERE s."candidatoId" = $1 ORDER BY s."dataCriacao" DESC`,
    [candidatoId]
  );
  // Não inclui solicitações de outros candidatos.
  resposta.json({ solicitacoes: resultado.rows });
});

// Lista apenas os pedidos dirigidos às ofertas do mentor autenticado.
export const listarSolicitacoesRecebidas = assincrono(async (pedido, resposta) => {
  // Obtém o proprietário das ofertas pelo token de autenticação.
  const mentorId = pedido.utilizador!.id;
  // Filtra sempre pelo mentor associado à oferta de cada solicitação.
  const resultado = await banco.query(
    `SELECT s."id", s."mentoriaId", s."candidatoId", s."estado", s."dataCriacao", m."titulo" AS "mentoriaTitulo", u."nomeCompleto" AS "candidatoNome", p."estado" AS "estadoPagamento", p."valor"::text AS "valorPagamento" FROM "solicitacoesMentoria" s JOIN "mentorias" m ON m."id" = s."mentoriaId" JOIN "utilizadores" u ON u."id" = s."candidatoId" LEFT JOIN "pagamentos" p ON p."solicitacaoId" = s."id" WHERE m."mentorId" = $1 ORDER BY s."dataCriacao" DESC`,
    [mentorId]
  );
  // Devolve apenas solicitações associadas às ofertas do mentor autenticado.
  resposta.json({ solicitacoes: resultado.rows });
});

// Atualiza o estado de uma solicitação após validar identidade, propriedade e transição.
export const atualizarEstadoSolicitacao = assincrono(async (pedido, resposta) => {
  // Valida o ID da solicitação e o estado de destino pedido pelo cliente.
  const id = IdentificadorSolicitacaoSchema.parse(pedido.params.id);
  const dados = AtualizarEstadoSolicitacaoSchema.parse(pedido.body);
  // Abre uma ligação dedicada para serializar alterações concorrentes ao mesmo pedido.
  const cliente = await banco.connect();
  try {
    // Inicia a transação de leitura, autorização e atualização.
    await cliente.query("BEGIN");
    // Bloqueia a solicitação para que duas decisões simultâneas não se sobreponham.
    const atual = await cliente.query(
      `SELECT s."id", s."mentoriaId", s."candidatoId", s."estado", m."mentorId", p."estado" AS "estadoPagamento" FROM "solicitacoesMentoria" s JOIN "mentorias" m ON m."id" = s."mentoriaId" LEFT JOIN "pagamentos" p ON p."solicitacaoId" = s."id" WHERE s."id" = $1 FOR UPDATE OF s`,
      [id]
    );
    // Trata IDs inexistentes antes de avaliar as permissões.
    if (!atual.rows[0]) throw new ErroHttp(404, "Solicitação de mentoria não encontrada");
    // Resume a linha atual para aplicar regras de acesso legíveis.
    const solicitacao = atual.rows[0] as {
      id: number; mentoriaId: number; candidatoId: number; estado: string;
      mentorId: number; estadoPagamento: string | null;
    };
    // Usa a identidade validada, não IDs nem papéis do corpo HTTP.
    const utilizadorId = pedido.utilizador!.id;
    const tipoUtilizador = pedido.utilizador!.tipo;
    const novoEstado = dados.estado;
    // Verifica se o utilizador tem a relação correta com a solicitação.
    const eAdministrador = tipoUtilizador === TipoUtilizador.Administrador;
    const eCandidatoDono = tipoUtilizador === TipoUtilizador.Candidato && solicitacao.candidatoId === utilizadorId;
    const eMentorDono = tipoUtilizador === TipoUtilizador.Mentor && solicitacao.mentorId === utilizadorId;
    // Só o mentor proprietário ou um administrador pode aceitar ou recusar um pedido pendente.
    if (novoEstado === "aceite" || novoEstado === "recusada") {
      if (!eMentorDono && !eAdministrador) throw new ErroHttp(403, "Só o mentor responsável ou um administrador pode decidir esta solicitação");
      if (solicitacao.estado !== "pendente") throw new ErroHttp(409, "Só é possível aceitar ou recusar solicitações pendentes");
    }
    // Só o próprio candidato ou um administrador pode cancelar uma solicitação.
    if (novoEstado === "cancelada") {
      if (!eCandidatoDono && !eAdministrador) throw new ErroHttp(403, "Só o candidato responsável ou um administrador pode cancelar esta solicitação");
      if (!["pendente", "aceite"].includes(solicitacao.estado)) throw new ErroHttp(409, "Esta solicitação já terminou e não pode ser cancelada");
      // Impede cancelar um pedido cujo pagamento tenha sido confirmado por processo confiável.
      if (solicitacao.estadoPagamento === "confirmado") throw new ErroHttp(409, "Não é possível cancelar uma solicitação com pagamento confirmado");
      // Só permite o cancelamento da solicitação aceite enquanto o pagamento ainda aguarda.
      if (solicitacao.estado === "aceite" && solicitacao.estadoPagamento !== "pendente") throw new ErroHttp(409, "O estado do pagamento não permite cancelar esta solicitação");
    }
    // Atualiza somente o estado após todas as verificações de autorização.
    const resultado = await cliente.query(
      `UPDATE "solicitacoesMentoria" SET "estado" = $1 WHERE "id" = $2 RETURNING "id", "mentoriaId", "candidatoId", "estado", "dataCriacao"`,
      [novoEstado, id]
    );
    // A recusa ou o cancelamento tornam o pagamento pendente inaplicável e cancelam-no.
    if (novoEstado === "recusada" || novoEstado === "cancelada") {
      await cliente.query(
        `UPDATE "pagamentos" SET "estado" = 'cancelado' WHERE "solicitacaoId" = $1 AND "estado" = 'pendente'`,
        [id]
      );
    }
    // Confirma a mudança da solicitação e do pagamento na mesma transação.
    await cliente.query("COMMIT");
    // Devolve o estado atualizado sem expor informação interna de outros utilizadores.
    resposta.json({ solicitacao: resultado.rows[0] });
  } catch (erro) {
    // Reverte alterações se a regra de negócio ou o PostgreSQL rejeitar a operação.
    await cliente.query("ROLLBACK").catch(() => undefined);
    // Propaga o erro para o middleware central de respostas HTTP.
    throw erro;
  } finally {
    // Liberta a ligação da pool independentemente do resultado.
    cliente.release();
  }
});

// Importa a fábrica de aplicações Express.
import express from "express";
// Importa o middleware de controlo de origens HTTP.
import cors from "cors";
// Importa a configuração validada.
import { ambiente } from "./configuracao/ambiente";
// Importa o router de autenticação e utilizadores.
import { rotasAutenticacao } from "./rotas/autenticacao";
// Importa o router das bolsas de estudo.
import { rotasBolsas } from "./rotas/bolsas";
// Importa o router do catálogo de mentorias.
import { rotasMentorias } from "./rotas/mentorias";
// Importa o router de solicitações de mentoria.
import { rotasSolicitacoesMentoria } from "./rotas/solicitacoesMentoria";
// Importa o router de consulta de pagamentos.
import { rotasPagamentos } from "./rotas/pagamentos";
// Importa o middleware final de tratamento de erros.
import { tratarErros } from "./utilitarios/erros";
// Cria uma instância Express partilhável com o Programador 2.


export const aplicacao = express();
// Restringe pedidos CORS à origem configurada para o frontend.
aplicacao.use(cors({ origin: ambiente.ORIGEM_FRONTEND }));
// Analisa corpos JSON com limite de 100 KiB.
aplicacao.use(express.json({ limit: "100kb" }));
// Disponibiliza uma rota simples para confirmar que a API responde.
aplicacao.get("/saude", (_pedido, resposta) => resposta.json({ estado: "ativo" }));
// Regista as rotas públicas e protegidas de autenticação.
aplicacao.use("/api/autenticacao", rotasAutenticacao);
// Regista as rotas de bolsas de estudo.
aplicacao.use("/api/bolsas", rotasBolsas);
// Regista as rotas públicas e protegidas de mentorias antes do middleware 404.
aplicacao.use("/api/mentorias", rotasMentorias);
// Regista a criação, consulta e gestão autorizada de solicitações de mentoria.
aplicacao.use("/api/solicitacoesMentoria", rotasSolicitacoesMentoria);
// Regista a consulta dos pagamentos pessoais sem disponibilizar confirmação pública.
aplicacao.use("/api/pagamentos", rotasPagamentos);
// Responde 404 para qualquer rota que não tenha sido registada.
aplicacao.use((_pedido, resposta) => { resposta.status(404).json({ erro: "Rota não encontrada" }); });
// Regista o tratamento de erros obrigatoriamente depois de todas as rotas.
aplicacao.use(tratarErros);


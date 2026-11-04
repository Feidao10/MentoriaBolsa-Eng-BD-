// Importa o construtor de routers Express.
import { Router } from "express";
// Importa operações de criação, consulta e atualização de solicitações.
import {
  atualizarEstadoSolicitacao,
  criarSolicitacaoMentoria,
  listarMinhasSolicitacoes,
  listarSolicitacoesRecebidas
} from "../controladores/solicitacoesMentoria";
// Reutiliza o middleware JWT do Programador 1.
import { verificarAutenticacao } from "../intermediarios/verificarAutenticacao";
// Reutiliza as permissões comuns por papel.
import { verificarPermissao } from "../intermediarios/verificarPermissao";
// Importa os papéis que a plataforma já define.
import { TipoUtilizador } from "../tipos/dominio";

// Cria o router de solicitações de mentoria.
export const rotasSolicitacoesMentoria = Router();
// Exige uma conta de candidato para solicitar e consultar os próprios pedidos.
const apenasCandidato = [verificarAutenticacao, verificarPermissao(TipoUtilizador.Candidato)];
// Exige uma conta de mentor para consultar pedidos dirigidos às suas ofertas.
const apenasMentor = [verificarAutenticacao, verificarPermissao(TipoUtilizador.Mentor)];
// Exige autenticação; a propriedade e o tipo de transição são verificados no controlador.
const utilizadorAutenticado = [verificarAutenticacao, verificarPermissao(TipoUtilizador.Candidato, TipoUtilizador.Mentor, TipoUtilizador.Administrador)];

// Cria um pedido e regista o respetivo pagamento pendente de forma atómica.
rotasSolicitacoesMentoria.post("/", apenasCandidato, criarSolicitacaoMentoria);
// Retorna exclusivamente os pedidos do candidato autenticado.
rotasSolicitacoesMentoria.get("/minhas", apenasCandidato, listarMinhasSolicitacoes);
// Retorna exclusivamente os pedidos associados às ofertas do mentor autenticado.
rotasSolicitacoesMentoria.get("/recebidas", apenasMentor, listarSolicitacoesRecebidas);
// Só permite transições aprovadas pelas regras do controlador.
rotasSolicitacoesMentoria.patch("/:id/estado", utilizadorAutenticado, atualizarEstadoSolicitacao);

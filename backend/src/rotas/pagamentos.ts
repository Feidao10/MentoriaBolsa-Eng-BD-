// Importa o construtor do router Express.
import { Router } from "express";
// Importa a consulta dos pagamentos do candidato autenticado.
import { listarMeusPagamentos } from "../controladores/pagamentos";
// Reutiliza o middleware de verificação do JWT.
import { verificarAutenticacao } from "../intermediarios/verificarAutenticacao";
// Reutiliza a autorização por tipo de utilizador.
import { verificarPermissao } from "../intermediarios/verificarPermissao";
// Importa os papéis partilhados existentes.
import { TipoUtilizador } from "../tipos/dominio";

// Cria o router de pagamentos.
export const rotasPagamentos = Router();
// Lista apenas pagamentos do candidato autenticado, sem permitir mudanças de estado.
rotasPagamentos.get("/meus", verificarAutenticacao, verificarPermissao(TipoUtilizador.Candidato), listarMeusPagamentos);

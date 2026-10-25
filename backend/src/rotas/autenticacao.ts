// Importa o criador de rotas Express.
import { Router } from "express";
// Importa os controladores de contas.
import { consultarPerfil, iniciarSessao, registar } from "../controladores/autenticacao";
// Importa o middleware que verifica o token JWT.
import { verificarAutenticacao } from "../intermediarios/verificarAutenticacao";
// Cria um router independente para autenticação.
export const rotasAutenticacao = Router();
// Regista candidatos e mentores sem exigir sessão prévia.
rotasAutenticacao.post("/registar", registar);
// Permite obter um token mediante credenciais válidas.
rotasAutenticacao.post("/iniciarSessao", iniciarSessao);
// Devolve o perfil do utilizador autenticado.
rotasAutenticacao.get("/perfil", verificarAutenticacao, consultarPerfil);

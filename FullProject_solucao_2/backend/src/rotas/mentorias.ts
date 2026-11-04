// Importa o construtor de routers Express.
import { Router } from "express";
// Importa os controladores de listagem, criação e edição de mentorias.
import {
  criarMentoria,
  editarMentoria,
  listarMentores,
  listarMentoriasDisponiveis,
  listarMinhasMentorias,
  obterDetalhesMentoria
} from "../controladores/mentorias";
// Reutiliza a autenticação JWT criada pelo Programador 1.
import { verificarAutenticacao } from "../intermediarios/verificarAutenticacao";
// Reutiliza o middleware de autorização por papel.
import { verificarPermissao } from "../intermediarios/verificarPermissao";
// Reutiliza os papéis partilhados do domínio.
import { TipoUtilizador } from "../tipos/dominio";

// Cria o router de todas as rotas de mentoria.
export const rotasMentorias = Router();
// Define o conjunto de middlewares para operações exclusivas de mentor.
const apenasMentor = [verificarAutenticacao, verificarPermissao(TipoUtilizador.Mentor)];
// Permite editar ofertas ao seu mentor ou a um administrador; o controlador verifica a propriedade.
const mentorOuAdministrador = [verificarAutenticacao, verificarPermissao(TipoUtilizador.Mentor, TipoUtilizador.Administrador)];

// Lista ofertas ativas sem exigir conta autenticada.
rotasMentorias.get("/", listarMentoriasDisponiveis);
// Lista os mentores que têm ofertas ativas.
rotasMentorias.get("/mentores", listarMentores);
// Lista as ofertas do próprio mentor, inclusive as pausadas.
rotasMentorias.get("/minhas", apenasMentor, listarMinhasMentorias);
// Cria uma oferta associada ao mentor do token, nunca a um ID do corpo.
rotasMentorias.post("/", apenasMentor, criarMentoria);
// Edita uma oferta do mentor proprietário ou mediante autorização administrativa.
rotasMentorias.patch("/:id", mentorOuAdministrador, editarMentoria);
// Mantém a rota pública por ID depois das rotas estáticas.
rotasMentorias.get("/:id", obterDetalhesMentoria);

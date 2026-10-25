// Importa o criador de routers Express.
import { Router } from "express";
// Importa os controladores do módulo de bolsas.
import { atualizarBolsa, consultarBolsa, criarBolsa, eliminarBolsa, listarBolsas, listarBolsasAdministracao, publicarBolsa, retirarPublicacao } from "../controladores/bolsas";
// Importa o middleware de autenticação.
import { verificarAutenticacao } from "../intermediarios/verificarAutenticacao";
// Importa o middleware de autorização por papel.
import { verificarPermissao } from "../intermediarios/verificarPermissao";
// Importa o enum partilhado de papéis.
import { TipoUtilizador } from "../tipos/dominio";
// Cria o router do módulo de bolsas.
export const rotasBolsas = Router();
// Lista as bolsas publicadas sem exigir autenticação.
rotasBolsas.get("/", listarBolsas);
// Exige autenticação para todas as operações administrativas subsequentes.
const apenasAdministrador = [verificarAutenticacao, verificarPermissao(TipoUtilizador.Administrador)];
// Lista bolsas publicadas e rascunhos para o administrador.
rotasBolsas.get("/administracao", apenasAdministrador, listarBolsasAdministracao);
// Cria um rascunho de bolsa apenas para administradores.
rotasBolsas.post("/", apenasAdministrador, criarBolsa);
// Edita os campos permitidos de uma bolsa.
rotasBolsas.patch("/:id", apenasAdministrador, atualizarBolsa);
// Publica uma bolsa mediante uma ação administrativa explícita.
rotasBolsas.patch("/:id/publicar", apenasAdministrador, publicarBolsa);
// Retira a publicação sem apagar o histórico da bolsa.
rotasBolsas.patch("/:id/retirarPublicacao", apenasAdministrador, retirarPublicacao);
// Elimina definitivamente uma bolsa mediante autorização.
rotasBolsas.delete("/:id", apenasAdministrador, eliminarBolsa);
// Deixa a rota dinâmica por último para não capturar /administracao.
rotasBolsas.get("/:id", consultarBolsa);

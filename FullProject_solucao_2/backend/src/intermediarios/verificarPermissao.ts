// Importa o tipo de middleware Express.
import { RequestHandler } from "express";
// Importa os papéis permitidos na aplicação.
import { TipoUtilizador } from "../tipos/dominio";
// Cria um middleware parametrizável para autorização por papel.
export const verificarPermissao = (...tiposPermitidos: TipoUtilizador[]): RequestHandler => {
  // Devolve um middleware que deve ser usado depois de verificarAutenticacao.
  return (pedido, resposta, proximo) => {
    // Rejeita pedidos cuja identidade não foi validada.
    if (!pedido.utilizador) {
      // Devolve 401 para ausência de autenticação.
      resposta.status(401).json({ erro: "Autenticação necessária" });
      // Termina o processamento.
      return;
    }
    // Verifica se o papel do token pertence à lista autorizada.
    if (!tiposPermitidos.includes(pedido.utilizador.tipo)) {
      // Devolve 403 quando a identidade não tem permissão.
      resposta.status(403).json({ erro: "Sem permissão para esta operação" });
      // Impede o acesso ao controlador.
      return;
    }
    // Autoriza o acesso à próxima etapa.
    proximo();
  };
};

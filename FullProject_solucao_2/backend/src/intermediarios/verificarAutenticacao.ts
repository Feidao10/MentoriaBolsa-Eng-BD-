// Importa os tipos Express necessários.
import { RequestHandler } from "express";
// Importa a função de verificação de assinaturas JWT.
import jwt, { JwtPayload } from "jsonwebtoken";
// Importa o segredo da configuração validada.
import { ambiente } from "../configuracao/ambiente";
// Importa os tipos partilhados dos utilizadores.
import { TipoUtilizador, UtilizadorAutenticado } from "../tipos/dominio";
// Exporta o middleware que exige uma identidade autenticada.
export const verificarAutenticacao: RequestHandler = (pedido, resposta, proximo) => {
  // Lê o cabeçalho HTTP Authorization.
  const autorizacao = pedido.headers.authorization;
  // Rejeita pedidos sem o formato Bearer esperado.
  if (!autorizacao?.startsWith("Bearer ")) {
    // Informa que falta autenticação válida.
    resposta.status(401).json({ erro: "Token de autenticação em falta" });
    // Termina o pedido.
    return;
  }
  // Extrai o token sem o prefixo Bearer.
  const token = autorizacao.slice(7);
  // Tenta verificar assinatura, algoritmo e prazo de validade.
  try {
    // Restringe explicitamente a verificação ao algoritmo HS256.
    const dados = jwt.verify(token, ambiente.SEGREDO_JWT, { algorithms: ["HS256"] });
    // Verifica que o conteúdo é um objeto JWT com subject numérico.
    if (typeof dados === "string" || typeof (dados as JwtPayload).sub !== "string") {
      // Rejeita payloads incompatíveis com o contrato.
      resposta.status(401).json({ erro: "Token inválido" });
      // Interrompe o middleware.
      return;
    }
    // Obtém o payload após a verificação criptográfica.
    const conteudo = dados as JwtPayload;
    // Converte o subject para um identificador numérico.
    const id = Number(conteudo.sub);
    // Verifica o formato do identificador e do papel autorizado.
    if (!Number.isSafeInteger(id) || id <= 0 || !Object.values(TipoUtilizador).includes(conteudo.tipo as TipoUtilizador)) {
      // Recusa tokens com campos inválidos.
      resposta.status(401).json({ erro: "Token inválido" });
      // Interrompe o processamento.
      return;
    }
    // Preenche a identidade tipada que será utilizada nas próximas rotas.
    const utilizador: UtilizadorAutenticado = { id, tipo: conteudo.tipo as TipoUtilizador };
    // Anexa a identidade verificada ao pedido Express.
    pedido.utilizador = utilizador;
    // Continua para o próximo middleware ou controlador.
    proximo();
  // Captura assinaturas inválidas, tokens expirados e payloads incorretos.
  } catch {
    // Não revela detalhes internos da verificação.
    resposta.status(401).json({ erro: "Token inválido ou expirado" });
  }
};

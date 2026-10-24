// Importa o tipo partilhado para acrescentá-lo ao pedido Express.
import { UtilizadorAutenticado } from "./dominio";
// Estende a interface de pedidos da biblioteca Express.
declare global {
  // Abre o namespace de tipos Express.
  namespace Express {
    // Adiciona a identidade opcional após a verificação JWT.
    interface Request {
      // Será preenchida pelo middleware verificarAutenticacao.
      utilizador?: UtilizadorAutenticado;
    }
  }
}
// Marca este ficheiro como módulo TypeScript.
export {};

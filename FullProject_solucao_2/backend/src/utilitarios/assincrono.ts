// Importa os tipos de middleware e pedido Express.
import { RequestHandler } from "express";
// Encapsula funções assíncronas para encaminhar erros ao middleware central.
export const assincrono = (funcao: RequestHandler): RequestHandler => {
  // Devolve uma função Express compatível com controladores existentes.
  return (pedido, resposta, proximo) => {
    // Captura rejeições de promessas sem deixar o pedido pendente.
    Promise.resolve(funcao(pedido, resposta, proximo)).catch(proximo);
  };
};

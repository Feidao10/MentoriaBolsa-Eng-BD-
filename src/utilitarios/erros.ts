// Importa os tipos necessários ao tratamento centralizado de erros.
import { ErrorRequestHandler } from "express";
// Importa o tipo de erro de validação Zod.
import { ZodError } from "zod";
// Classe de erros HTTP previsíveis para controladores e middlewares.
export class ErroHttp extends Error {
  // Guarda o código HTTP e a mensagem fornecidos pelo chamador.
  constructor(public readonly estado: number, mensagem: string) {
    // Inicializa a mensagem herdada de Error.
    super(mensagem);
    // Define o nome para facilitar o diagnóstico.
    this.name = "ErroHttp";
  }
}
// Middleware final que converte exceções em respostas JSON seguras.
export const tratarErros: ErrorRequestHandler = (erro: unknown, _pedido, resposta, _proximo) => {
  // Converte erros de validação em respostas 400.
  if (erro instanceof ZodError) {
    // Devolve detalhes estruturados dos campos inválidos.
    resposta.status(400).json({ erro: "Dados inválidos", detalhes: erro.flatten() });
    // Impede que o middleware envie uma segunda resposta.
    return;
  }
  // Identifica erros HTTP lançados intencionalmente.
  if (erro instanceof ErroHttp) {
    // Usa o código e a mensagem previstos.
    resposta.status(erro.estado).json({ erro: erro.message });
    // Termina o processamento do erro.
    return;
  }
  // Regista a falha internamente sem divulgar pormenores ao cliente.
  console.error(erro);
  // Responde genericamente a erros inesperados.
  resposta.status(500).json({ erro: "Erro interno do servidor" });
};

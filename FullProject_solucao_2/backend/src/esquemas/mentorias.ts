// Importa a biblioteca usada para validar os corpos dos pedidos HTTP.
import { z } from "zod";

// Valida preços como texto decimal para evitar conversões monetárias para float JavaScript.
const precoSchema = z.string().trim().regex(
  // Aceita até dez algarismos inteiros e, opcionalmente, até duas casas decimais.
  /^\d{1,10}(?:\.\d{1,2})?$/,
  // Explica o formato esperado quando o preço não é válido.
  "O preço deve ser um texto decimal não negativo com até duas casas decimais, por exemplo \"1500.00\""
);

// Valida os campos necessários para criar uma oferta de mentoria.
export const CriarMentoriaSchema = z.object({
  // Exige um título legível e compatível com a coluna da base de dados.
  titulo: z.string().trim().min(3).max(180),
  // Exige uma descrição útil da oferta.
  descricao: z.string().trim().min(10).max(10000),
  // Mantém o preço como texto decimal até chegar ao PostgreSQL.
  preco: precoSchema
}).strict();

// Permite alterar campos de uma oferta, mas não o mentor proprietário.
export const AtualizarMentoriaSchema = CriarMentoriaSchema.partial().extend({
  // Permite ao proprietário pausar ou reativar a oferta.
  ativa: z.boolean().optional()
}).strict().refine(
  // Exige pelo menos um campo editável.
  dados => Object.keys(dados).length > 0,
  // Devolve uma mensagem clara para objetos vazios.
  { message: "Indique pelo menos um campo para atualizar" }
);

// Valida o ID da oferta enviada ao solicitar uma mentoria.
export const CriarSolicitacaoMentoriaSchema = z.object({
  // O identificador deve ser um inteiro positivo.
  mentoriaId: z.coerce.number().int().positive()
}).strict();

// Restringe a atualização a transições explicitamente suportadas pelo servidor.
export const AtualizarEstadoSolicitacaoSchema = z.object({
  // O cliente nunca pode definir o estado do pagamento através deste esquema.
  estado: z.enum(["aceite", "recusada", "cancelada"])
}).strict();

// Valida identificadores positivos de ofertas de mentoria.
export const IdentificadorMentoriaSchema = z.coerce.number().int().positive();

// Valida identificadores positivos de solicitações de mentoria.
export const IdentificadorSolicitacaoSchema = z.coerce.number().int().positive();

// Define os estados permitidos para uma solicitação de mentoria.
export enum EstadoSolicitacaoMentoria {
  // Aguardando decisão do mentor.
  Pendente = "pendente",
  // Aceite pelo mentor.
  Aceite = "aceite",
  // Recusada pelo mentor.
  Recusada = "recusada",
  // Cancelada pelo candidato ou pela administração.
  Cancelada = "cancelada"
}

// Define os estados armazenados no registo do pagamento.
export enum EstadoPagamento {
  // Aguardando confirmação por um processo confiável.
  Pendente = "pendente",
  // Confirmado por integração ou processo administrativo auditável futuro.
  Confirmado = "confirmado",
  // Cancelado devido à recusa ou cancelamento da solicitação.
  Cancelado = "cancelado"
}

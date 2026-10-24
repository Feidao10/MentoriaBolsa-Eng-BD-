// Importa a biblioteca de validação.
import { z } from "zod";
// Define a estrutura de uma bolsa a criar.
export const CriarBolsaSchema = z.object({
  // Título apresentado ao candidato.
  titulo: z.string().trim().min(3).max(180),
  // Descrição da oportunidade.
  descricao: z.string().trim().min(10),
  // Entidade responsável pela bolsa.
  instituicao: z.string().trim().min(2).max(180),
  // País associado à oportunidade.
  pais: z.string().trim().min(2).max(100),
  // Requisitos textuais da candidatura.
  requisitos: z.string().trim().min(3),
  // Data opcional no formato ISO, validada também pelo PostgreSQL.
  prazoCandidatura: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  // Endereço opcional da página oficial da bolsa.
  ligacaoOficial: z.string().url().max(2048).nullable().optional()
}).strict();
// Permite alterar apenas os campos editáveis, exigindo pelo menos um.
export const AtualizarBolsaSchema = CriarBolsaSchema.partial().refine(
  // Confirma que foi fornecido algum campo.
  dados => Object.keys(dados).length > 0,
  // Apresenta a mensagem de validação quando o objeto está vazio.
  { message: "Indique pelo menos um campo" }
);
// Valida identificadores numéricos positivos recebidos na URL.
export const IdentificadorSchema = z.coerce.number().int().positive();

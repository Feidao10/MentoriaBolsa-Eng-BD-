
import { z } from "zod";

export const CriarBolsaSchema = z.object({
  titulo: z.string().trim().min(3).max(180),
  descricao: z.string().trim().min(10),
  instituicao: z.string().trim().min(2).max(180),
  pais: z.string().trim().min(2).max(100),
  requisitos: z.string().trim().min(3),
  prazoCandidatura: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  ligacaoOficial: z.string()
    .url()
    .max(2048)
    .nullable()
    .optional()
}).strict();

export const AtualizarBolsaSchema = CriarBolsaSchema.partial().refine(
  dados => Object.keys(dados).length > 0,
  { message: "Indique pelo menos um campo" }
);

export const IdentificadorSchema = z.coerce.number().int().positive();

// Validação do cadastro de várias bolsas.
export const CriarBolsasEmLoteSchema = z.object({
  bolsas: z.array(CriarBolsaSchema).min(1).max(50)
}).strict();

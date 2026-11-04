import "dotenv/config";
import { z } from "zod";
const AmbienteSchema = z.object({
  PORTA: z.coerce.number().int().positive().default(3000),
  URL_BANCO: z.string().url(),
  SEGREDO_JWT: z.string().min(32),
  ORIGEM_FRONTEND: z.string().url(),
  AMBIENTE: z.enum(["desenvolvimento", "producao"]).default("desenvolvimento")
});
export const ambiente = AmbienteSchema.parse(process.env);


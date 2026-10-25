// Importa o construtor de esquemas de validação.
import { z } from "zod";
// Define os campos permitidos no registo público.
export const CriarUtilizadorSchema = z.object({
  // Exige um nome entre 2 e 120 caracteres.
  nomeCompleto: z.string().trim().min(2).max(120),
  // Normaliza o email para minúsculas e verifica a estrutura.
  email: z.string().trim().email().max(254).toLowerCase(),
  // Impõe um tamanho mínimo e máximo para a palavra-passe.
  palavraPasse: z.string().min(8).max(72),
  // Impede que o registo público atribua o papel de administrador.
  tipo: z.enum(["candidato", "mentor"])
}).strict();
// Define os campos necessários para iniciar sessão.
export const IniciarSessaoSchema = z.object({
  // Normaliza o email usado na pesquisa.
  email: z.string().trim().email().toLowerCase(),
  // Recebe a palavra-passe sem a devolver nas respostas.
  palavraPasse: z.string().min(1)
}).strict();

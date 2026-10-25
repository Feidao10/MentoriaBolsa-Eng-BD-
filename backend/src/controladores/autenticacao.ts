import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { banco } from "../configuracao/banco";
import { ambiente } from "../configuracao/ambiente";
import { CriarUtilizadorSchema, IniciarSessaoSchema } from "../esquemas/autenticacao";
import { assincrono } from "../utilitarios/assincrono";
import { ErroHttp } from "../utilitarios/erros";
import { UtilizadorPublico } from "../tipos/dominio";
interface UtilizadorInterno extends UtilizadorPublico {
  palavraPasseHash: string;
}
const gerarToken = (utilizador: UtilizadorPublico): string => {
  return jwt.sign({ tipo: utilizador.tipo }, ambiente.SEGREDO_JWT, {
    subject: String(utilizador.id),
    expiresIn: "2h",
    algorithm: "HS256"
  });
};
export const registar = assincrono(async (pedido, resposta) => {
  const dados = CriarUtilizadorSchema.parse(pedido.body);
  const palavraPasseHash = await bcrypt.hash(dados.palavraPasse, 12);
  try {
    const resultado = await banco.query<UtilizadorPublico>(
      `INSERT INTO "utilizadores" ("nomeCompleto", "email", "palavraPasseHash", "tipo") VALUES ($1, $2, $3, $4) RETURNING "id", "nomeCompleto", "email", "tipo", "dataCriacao"`,
      [dados.nomeCompleto, dados.email, palavraPasseHash, dados.tipo]
    );
    
    resposta.status(201).json({ utilizador: resultado.rows[0] });
  
  } catch (erro: unknown) {
    
    if (typeof erro === "object" && erro !== null && "code" in erro && erro.code === "23505") {
      
      throw new ErroHttp(409, "Email já registado");
    }
    
    throw erro;
  }
});

export const iniciarSessao = assincrono(async (pedido, resposta) => {
  
  const dados = IniciarSessaoSchema.parse(pedido.body);
  
  const resultado = await banco.query<UtilizadorInterno>(
    
    `SELECT "id", "nomeCompleto", "email", "tipo", "dataCriacao", "palavraPasseHash" FROM "utilizadores" WHERE "email" = $1`,
    
    [dados.email]
  );
  
  const utilizador = resultado.rows[0];
  
  const valido = utilizador ? await bcrypt.compare(dados.palavraPasse, utilizador.palavraPasseHash) : false;
  
  if (!utilizador || !valido) {
    
    throw new ErroHttp(401, "Credenciais inválidas");
  }
  
  const { palavraPasseHash: _hashPrivado, ...utilizadorPublico } = utilizador;
  
  const token = gerarToken(utilizadorPublico);
  
  resposta.json({ token, utilizador: utilizadorPublico });
});

export const consultarPerfil = assincrono(async (pedido, resposta) => {
  
  const id = pedido.utilizador!.id;
  
  const resultado = await banco.query<UtilizadorPublico>(
    
    `SELECT "id", "nomeCompleto", "email", "tipo", "dataCriacao" FROM "utilizadores" WHERE "id" = $1`,
    
    [id]
  );
  
  if (!resultado.rows[0]) {
    
    throw new ErroHttp(404, "Utilizador não encontrado");
  }
  
  resposta.json({ utilizador: resultado.rows[0] });
});

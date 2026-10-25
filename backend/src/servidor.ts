// Importa a aplicacao Express configurada.
import { aplicacao } from "./aplicacao";
// Importa as variaveis de ambiente validadas.
import { ambiente } from "./configuracao/ambiente";
// Importa a pool partilhada para verificar a ligacao antes de escutar.
import { banco } from "./configuracao/banco";

// conectando com o front
import express from "express" ;
import cors from "cors";

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

//fim integracao com o front

// Define a rotina de arranque do servico.
const iniciarServidor = async (): Promise<void> => {
  // Verifica a disponibilidade da base de dados.
  await banco.query("SELECT 1");
  // Inicia o servidoar HTTP na porta configurada.
  aplicacao.listen(ambiente.PORTA, () => {
    // Regista a porta para facilitar a execucao local.
    console.log(`API disponivel na porta ${ambiente.PORTA}`);
  });
};
// Executa o arranque e captura eventuais falhas.
iniciarServidor().catch(erro => {
  // Regista o erro para diagnostico do operador.
  console.error("Falha ao iniciar o servidor:", erro);
  // Termina o processo com codigo de erro.
  process.exit(1);
});

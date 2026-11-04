// Enum partilhado de papéis dos utilizadores.
export enum TipoUtilizador {
  // Pessoa que procura bolsas e solicita mentorias.
  Candidato = "candidato",
  // Pessoa que oferece serviços de mentoria.
  Mentor = "mentor",
  // Pessoa com permissão de gestão da plataforma.
  Administrador = "administrador"
}
// Interface dos dados mínimos contidos num token validado.
export interface UtilizadorAutenticado {
  // Identificador interno do utilizador.
  id: number;
  // Papel usado na autorização.
  tipo: TipoUtilizador;
}
// Enum dos estados de publicação das bolsas.
export enum EstadoBolsa {
  // A bolsa ainda não aparece publicamente.
  Rascunho = "rascunho",
  // A bolsa pode aparecer nas listagens públicas.
  Publicada = "publicada"
}
// Representa o formato público de um utilizador.
export interface UtilizadorPublico {
  // Identificador do utilizador.
  id: number;
  // Nome de apresentação.
  nomeCompleto: string;
  // Email único.
  email: string;
  // Papel da conta.
  tipo: TipoUtilizador;
  // Data de criação da conta.
  dataCriacao: Date;
}

/**
 CONVENÇÃO DE NOMENCLATURA OBRIGATÓRIA (Página 1 - Secção 1)
 Todos os identificadores seguem a regra camelCase em português, sem acentos,
 incluindo os nomes dos próprios tipos/interfaces por exigência do projeto.
 */

// TIPOS CUSTOMIZADOS E ESTADOS ESTRITOS (Página 2 - Secção 4)

export type tipoUtilizador = 'candidato' | 'mentor' | 'administrador';

export type estadoSolicitacao = 'pendente' | 'aceite' | 'recusada' | 'cancelada';

export type estadoPagamento = 'pendente' | 'pago';


// INTERFACES DAS ENTIDADES (Página 1 - Secções 2 e 3)

// Entidade: utilizador (Página 1 - Secção 2)
export interface utilizador {
  identificador: string; // UUID usado como chave primária
  nomeCompleto: string;
  email: string;
  palavraPasseHash?: string; // Opcional no frontend após o login por segurança
  telefone: string;
  numeroBilheteIdentidade: string;
  fotografiaurl: string;
  tipoUtilizador: tipoUtilizador;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Entidade: bolsaEstudo (Página 1 - Secção 2)
export interface bolsaEstudo {
  identificador: string; // UUID
  titulo: string;
  descricao: string;
  pais: string;
  areaEstudo: string;
  prazoCandidatura: string;
  ligacaoCandidatura: string;
  publicada: boolean;
  administradorIdentificador: string; // Relacionamento com utilizador (admin)
  dataCriacao: string;
  dataAtualizacao: string;
}

// Entidade: mentoria (Página 1 - Secção 3)
export interface mentoria {
  identificador: string; // UUID
  titulo: string;
  descricao: string;
  preco: number;
  moeda: string;
  mentorIdentificador: string; // Relacionamento com utilizador (mentor)
  disponivel: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Entidade: solicitacaoMentoria (Página 1 - Secção 3)
export interface solicitacaoMentoria {
  identificador: string; // UUID
  candidatoIdentificador: string; // Relacionamento com utilizador (candidato)
  mentoriaIdentificador: string; // Relacionamento com a oferta de mentoria
  mensagem: string;
  estadoSolicitacao: estadoSolicitacao;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Entidade: pagamento (Página 1 - Secção 3)
export interface pagamento {
  identificador: string; // UUID
  solicitacaoIdentificador: string; // Relacionamento com solicitacaoMentoria
  valor: number;
  moeda: string;
  estadoPagamento: estadoPagamento;
  referenciaTransacao: string;
  dataCriacao: string;
  dataPagamento?: string; // Opcional enquanto o estado for 'pendente'
}


// CONTRATOS DE DADOS PARA ENVIO (PAYLOADS DAS REQUISIÇÕES)

// Dados para efetuar o Registo (Sign Up)
export interface registarUtilizadorPayload {
  nomeCompleto: string;
  email: string;
  palavraPasse: string; // Enviada limpa pelo frontend, o backend fará o hash
  telefone: string;
  numeroBilheteIdentidade: string;
  tipoUtilizador: tipoUtilizador;
}

// Dados para efetuar o Login (Sign In)
export interface autenticarUtilizadorPayload {
  email: string;
  palavraPasse: string;
}

// Resposta padrão do Backend após autenticação com sucesso
export interface respostaAutenticacao {
  token: string; // JWT contendo identificador e tipoUtilizador
  utilizador: utilizador;
}

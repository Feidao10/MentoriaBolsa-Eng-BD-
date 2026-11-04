
import { api } from './api';

export interface MentoriaApi {
  id: number;
  mentorId: number;
  titulo: string;
  descricao: string;
  preco: string;
  ativa: boolean;
}

export interface CriarMentoriaDados {
  titulo: string;
  descricao: string;
  preco: string;
}

export interface SolicitacaoMentoriaApi {
  id: number;
  mentoriaId: number;
  candidatoId: number;
  estado: 'pendente' | 'aceite' | 'recusada' | 'cancelada';
  dataCriacao: string;
  mentoriaTitulo: string;
  mentorId: number;
  mentorNome: string;
  pagamentoId: number | null;
  valorPagamento: string | null;
  estadoPagamento: string | null;
}

export async function listarMentorias() {
  const resposta = await api.get<{ mentorias: MentoriaApi[] }>(
    '/mentorias'
  );

  return resposta.data.mentorias;
}

export async function criarMentoria(dados: CriarMentoriaDados) {
  const resposta = await api.post('/mentorias', dados);

  return resposta.data.mentoria;
}

export async function listarMinhasSolicitacoes() {
  const resposta = await api.get<{
    solicitacoes: SolicitacaoMentoriaApi[];
  }>('/solicitacoesMentoria/minhas');

  return resposta.data.solicitacoes;
}

import { api } from './api';

export interface MentoriaApi {
  id: number;
  mentorId: number;
  titulo: string;
  descricao: string;
  preco: string;
  ativa: boolean;
}

export async function listarMentorias() {
  const resposta = await api.get<{ mentorias: MentoriaApi[] }>(
    '/mentorias'
  );

  return resposta.data.mentorias;
}
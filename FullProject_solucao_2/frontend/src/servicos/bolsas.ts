import { api } from './api';

export interface BolsaApi {
  id: number;
  titulo: string;
  descricao: string;
  instituicao: string;
  pais: string;
  requisitos: string;
  prazoCandidatura: string | null;
  ligacaoOficial: string | null;
  estado: 'rascunho' | 'publicada';
}

export async function listarBolsas() {
  const resposta = await api.get<{ bolsas: BolsaApi[] }>('/bolsas');

  return resposta.data.bolsas;
}
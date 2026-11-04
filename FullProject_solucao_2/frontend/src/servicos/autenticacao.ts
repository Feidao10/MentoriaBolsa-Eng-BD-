
import { api } from './api';

export interface UtilizadorApi {
  id: number;
  nomeCompleto: string;
  email: string;
  tipo: 'candidato' | 'mentor' | 'administrador';
}

export interface RespostaLogin {
  token: string;
  utilizador: UtilizadorApi;
}

export async function iniciarSessao(
  email: string,
  palavraPasse: string
): Promise<RespostaLogin> {
  const resposta = await api.post<RespostaLogin>(
    '/autenticacao/iniciarSessao',
    { email, palavraPasse }
  );

  localStorage.setItem('token', resposta.data.token);
  localStorage.setItem(
  'utilizador',
  JSON.stringify(resposta.data.utilizador)
);

  return resposta.data;
}

export function terminarSessao() {
  localStorage.removeItem('token');
  localStorage.removeItem('utilizador');
}

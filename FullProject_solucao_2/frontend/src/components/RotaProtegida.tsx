import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type TipoUtilizador =
  | 'candidato'
  | 'mentor'
  | 'administrador';

interface RotaProtegidaProps {
  tipoPermitido: TipoUtilizador;
  children: ReactNode;
}

export function RotaProtegida({
  tipoPermitido,
  children,
}: RotaProtegidaProps) {
  const token = localStorage.getItem('token');
  const dados = localStorage.getItem('utilizador');

  if (!token || !dados) {
    return <Navigate to="/autenticacao" replace />;
  }


  const utilizador = (() => {
    try {
      return JSON.parse(dados) as { tipo: string } | null;
    } catch {
      return null;
    }
  })();

  if (!utilizador || utilizador.tipo !== tipoPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}
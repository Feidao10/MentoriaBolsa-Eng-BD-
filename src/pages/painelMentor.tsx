//Área do mentor para criar ofertas e aceitar pedidos
// Ficheiro: src/pages/painelMentor.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type solicitacaoMentoria } from '../types';

// Dados fictícios alinhados com o contrato das Páginas 1 e 2 do PDF
const MOCK_SOLICITACOES_INICIAIS: solicitacaoMentoria[] = [
  {
    identificador: "pedido-1",
    candidatoIdentificador: "estudante-uuid-1", // Simula o aluno que enviou
    mentoriaIdentificador: "mentor-1",
    mensagem: "precisando Garimpo",
    estadoSolicitacao: 'pendente', // Estado inicial estrito
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  },
  {
    identificador: "pedido-2",
    candidatoIdentificador: "estudante-uuid-2",
    mentoriaIdentificador: "mentor-1",
    mensagem: "Preciso de ajuda urgente para estruturar as rotas no frontend e a arquitetura MVC no backend.",
    estadoSolicitacao: 'pendente',
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  }
];

export function PainelMentor() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState<solicitacaoMentoria[]>(MOCK_SOLICITACOES_INICIAIS);

  // Função para simular a decisão do mentor (Muda o estado estrito na hora)
  const decidirPedido = (id: string, novoEstado: 'aceite' | 'recusada') => {
    setSolicitacoes(prev => 
      prev.map(pedido => 
        pedido.identificador === id 
          ? { ...pedido, estadoSolicitacao: novoEstado, dataAtualizacao: "2026-10-22" }
          : pedido
      )
    );
    
    // MVP: No Dia 3, este console.log será substituído por um axios.put() para atualizar a BD
    console.log(`Pedido ${id} atualizado para o estado: ${novoEstado}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Cabeçalho do Painel */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Painel de Controlo do Mentor</h1>
            <p className="text-xs text-gray-500">Gestão de aulas Académicas</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Terminar Sessão
          </button>
        </div>
      </header>

      {/* Área de Conteúdo */}
      <main className="max-w-5xl mx-auto p-6 w-full flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Solicitações de Acompanhamento Recebidas</h2>
          <span className="bg-blue-100 text-[#0e89b9e7] text-xs font-bold px-2.5 py-1 rounded-full">
            {solicitacoes.filter(p => p.estadoSolicitacao === 'pendente').length} Pendentes
          </span>
        </div>

        <div className="space-y-4">
          {solicitacoes.map((pedido) => (
            <div key={pedido.identificador} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono text-gray-400 block mb-1">
                    ID Estudante: {pedido.candidatoIdentificador}
                  </span>
                  <span className="text-xs text-gray-500">Recebido em: {pedido.dataCriacao}</span>
                </div>

                {/* Badges Dinâmicas de Estado Estrito */}
                <div>
                  {pedido.estadoSolicitacao === 'pendente' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-lg">
                      Pendente
                    </span>
                  )}
                  {pedido.estadoSolicitacao === 'aceite' && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-lg">
                      Aceite
                    </span>
                  )}
                  {pedido.estadoSolicitacao === 'recusada' && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-lg">
                      Recusada
                    </span>
                  )}
                </div>
              </div>

              {/* Mensagem do Estudante */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm mb-4 italic">
                "{pedido.mensagem}"
              </div>

              {/* Ações de Engenharia (Apenas aparecem se estiver pendente) */}
              {pedido.estadoSolicitacao === 'pendente' && (
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => decidirPedido(pedido.identificador, 'recusada')}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                  >
                    Recusar Pedido
                  </button>
                  <button
                    onClick={() => decidirPedido(pedido.identificador, 'aceite')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Aceitar Mentoria
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

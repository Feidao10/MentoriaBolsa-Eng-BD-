// Ficheiro: src/pages/painelMentor.tsx
// SESSÃO 1 DE 2 — CONFIGURAÇÕES E POLÍTICAS DE DADOS COMUNITÁRIOS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type solicitacaoMentoria } from '../types';
import { Footer } from '../components/Footer';

// Contrato de dados limpo de amarras académicas (Plataforma Aberta)
const MOCK_SOLICITACOES_INICIAIS: solicitacaoMentoria[] = [
  {
    identificador: "pedido-1",
    candidatoIdentificador: "membro-comunidade-1", 
    mentoriaIdentificador: "mentoria-1",
    mensagem: "Gostaria de obter apoio prático no desenho de arquiteturas de software reais e engenharia de requisitos.",
    estadoSolicitacao: 'pendente',
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  },
  {
    identificador: "pedido-2",
    candidatoIdentificador: "membro-comunidade-2",
    mentoriaIdentificador: "mentoria-1",
    mensagem: "Preciso de ajuda urgente para estruturar as rotas no meu ecossistema frontend e compreender a fundo a arquitetura MVC no backend.",
    estadoSolicitacao: 'pendente',
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  }
];
// SESSÃO 2 DE 2 — LOGICA DE DECISÃO E MAQUETIZAÇÃO INTERFICIAL
export function PainelMentor() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState<solicitacaoMentoria[]>(MOCK_SOLICITACOES_INICIAIS);

  // Função reativa que simula a tomada de decisão do mentor na rede aberta
  const decidirPedido = (id: string, novoEstado: 'aceite' | 'recusada') => {
    setSolicitacoes(prev => 
      prev.map(pedido => 
        pedido.identificador === id 
          ? { ...pedido, estadoSolicitacao: novoEstado, dataAtualizacao: new Date().toISOString().split('T')[0] }
          : pedido
      )
    );
    
    // MVP Dia 3: Este log será mapeado para uma chamada assíncrona real (api.patch ou api.put)
    console.log(`[Comunidade] Pedido ${id} atualizado para o estado: ${novoEstado}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
      
      {/* CABEÇALHO DO PAINEL */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <div>
            <h1 className="text-md font-bold text-gray-900 tracking-tight">Mentor</h1>
            <p className="text-[10px] text-gray-500 font-medium">Gestão de Propostas e Mentoria Livre</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            Terminar Sessão
          </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO CENTRAL */}
      <main className="max-w-5xl w-full mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Propostas de Acompanhamento Submetidas</h2>
          <span className=" text-[#0e89b9e7] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {solicitacoes.filter(p => p.estadoSolicitacao === 'pendente').length} Pendentes
          </span>
        </div>

        {/* LISTAGEM REATIVA DE PEDIDOS */}
        <div className="space-y-4">
          {solicitacoes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
              Nenhuma proposta recebida até ao momento.
            </div>
          ) : (
            solicitacoes.map((pedido) => (
              <div key={pedido.identificador} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div>
                    <span className="text-xs font-mono text-gray-400 block mb-0.5">
                      Identificador Candidato: <strong className="text-gray-600 font-semibold">{pedido.candidatoIdentificador}</strong>
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">Submetido em: {pedido.dataCriacao}</span>
                  </div>

                  {/* Badges de Estado Comunitário */}
                  <div>
                    {pedido.estadoSolicitacao === 'pendente' && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Pendente
                      </span>
                    )}
                    {pedido.estadoSolicitacao === 'aceite' && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Aceite
                      </span>
                    )}
                    {pedido.estadoSolicitacao === 'recusada' && (
                      <span className="bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Recusada
                      </span>
                    )}
                  </div>
                </div>

                {/* Mensagem do Candidato */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-600 text-sm mb-4 leading-relaxed italic">
                  "{pedido.mensagem}"
                </div>

                {/* Ações (Disponíveis apenas se o estado for estritamente pendente) */}
                {pedido.estadoSolicitacao === 'pendente' && (
                  <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => decidirPedido(pedido.identificador, 'recusada')}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all active:scale-95"
                    >
                      Recusar Proposta
                    </button>
                    <button
                      type="button"
                      onClick={() => decidirPedido(pedido.identificador, 'aceite')}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-sm active:scale-95"
                    >
                      Aprovar Mentoria
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* RODAPÉ GLOBAL REUTILIZÁVEL */}
      <Footer />
      
    </div>
  );
}

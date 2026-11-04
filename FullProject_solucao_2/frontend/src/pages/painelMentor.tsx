
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type solicitacaoMentoria } from '../types';
import { Footer } from '../components/Footer';
import {
  terminarSessao,
  type UtilizadorApi,
} from '../servicos/autenticacao';

// Dados fictícios para manter o funcionamento actual do painel
const MOCK_SOLICITACOES_INICIAIS: solicitacaoMentoria[] = [
  {
    identificador: 'pedido-1',
    candidatoIdentificador: 'estudante-uuid-1',
    mentoriaIdentificador: 'mentor-1',
    mensagem: 'precisando Garimpo',
    estadoSolicitacao: 'pendente',
    dataCriacao: '2026-10-22',
    dataAtualizacao: '2026-10-22',
  },
  {
    identificador: 'pedido-2',
    candidatoIdentificador: 'estudante-uuid-2',
    mentoriaIdentificador: 'mentor-1',
    mensagem:
      'Preciso de ajuda urgente para estruturar as rotas no frontend e a arquitetura MVC no backend.',
    estadoSolicitacao: 'pendente',
    dataCriacao: '2026-10-22',
    dataAtualizacao: '2026-10-22',
  },
];

export function PainelMentor() {
  const navigate = useNavigate();

  const utilizador: UtilizadorApi | null = (() => {
    try {
      const dados = localStorage.getItem('utilizador');
      return dados ? (JSON.parse(dados) as UtilizadorApi) : null;
    } catch {
      return null;
    }
  })();

  const nomeMentor = utilizador?.nomeCompleto || 'Mentor';

  const [solicitacoes, setSolicitacoes] = useState<solicitacaoMentoria[]>(
    MOCK_SOLICITACOES_INICIAIS
  );

  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<solicitacaoMentoria | null>(null);

  const [mensagemResultado, setMensagemResultado] = useState('');

  const pedidosPendentes = solicitacoes.filter(
    (pedido) => pedido.estadoSolicitacao === 'pendente'
  ).length;

  function decidirPedido(
    id: string,
    novoEstado: 'aceite' | 'recusada'
  ) {
    setSolicitacoes((anteriores) =>
      anteriores.map((pedido) =>
        pedido.identificador === id
          ? {
              ...pedido,
              estadoSolicitacao: novoEstado,
              dataAtualizacao: new Date().toISOString().slice(0, 10),
            }
          : pedido
      )
    );

    const pedidoAtualizado = solicitacoes.find(
      (pedido) => pedido.identificador === id
    );

    if (pedidoAtualizado) {
      setSolicitacaoSelecionada({
        ...pedidoAtualizado,
        estadoSolicitacao: novoEstado,
        dataAtualizacao: new Date().toISOString().slice(0, 10),
      });
    }

    setMensagemResultado(
      novoEstado === 'aceite'
        ? 'Solicitação aceite com sucesso.'
        : 'Solicitação recusada.'
    );

    console.log(`Pedido ${id} atualizado para o estado: ${novoEstado}`);
  }

  function terminarSessaoMentor() {
    terminarSessao();
    navigate('/autenticacao', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F6] text-slate-800">

      {/* CABEÇALHO */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 min-h-[82px] flex flex-wrap items-center justify-between gap-4">

          {/* LOGÓTIPO */}
          <a href="/" className="flex items-center gap-3">
            <img
    src="/images/MentoriaBolsas_ Learn, Achieve, Realize.png"
    alt="MentoriaBolsas — Aprenda. Conquiste. Realize."
    className="h-14 w-auto max-w-[220px] object-contain"
  />
        
          </a>

          {/* NAVEGAÇÃO */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a
              href="/#inicio"
              className="hover:text-[#0E7490] transition"
            >
              Home
            </a>

            <a
              href="/#sobre"
              className="hover:text-[#0E7490] transition"
            >
              Sobre
            </a>

            <a
              href="/#mentorias"
              className="hover:text-[#0E7490] transition"
            >
              Mensagens
            </a>
          </nav>

          {/* SESSÃO E IDENTIFICAÇÃO DO MENTOR */}
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={terminarSessaoMentor}
              className="text-sm font-semibold text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition"
            >
              Terminar Sessão
            </button>

            <div className="  border-cyan-200 rounded-lg px-4 py-2">
              

              <span className="block text-sm font-bold text-[#164E63]">
                {nomeMentor}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="w-full max-w-7xl mx-auto px-5 lg:px-8 py-8 flex-1">

        {/* FAIXA DE ORIENTAÇÃO */}
        <section className="mb-8 rounded-2xl bg-[#164E63] text-white px-6 py-7 md:px-9 md:py-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Área do Mentor
          </span>

          <h1 className="mt-2 text-2xl md:text-3xl font-bold">
            Mensagens de solicitação para o mentor
          </h1>

          <p className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed text-cyan-50">
            Consulte as mensagens recebidas dos candidatos, analise os seus
            pedidos e decida se pretende aceitar ou recusar cada solicitação
            de acompanhamento.
          </p>
        </section>

        {/* LISTA DE SOLICITAÇÕES E MENSAGEM */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">

          {/* LISTA DE SOLICITANTES */}
          <section className="lg:col-span-2">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                  Gestão de pedidos
                </span>

                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  Lista de solicitantes
                </h2>
              </div>

              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-2">
                {pedidosPendentes} pendentes
              </span>
            </div>

            {solicitacoes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <p className="font-semibold text-slate-700">
                  Não existem solicitações recebidas.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Quando um candidato enviar um pedido, ele aparecerá aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {solicitacoes.map((pedido) => {
                  const selecionado =
                    solicitacaoSelecionada?.identificador ===
                    pedido.identificador;

                  return (
                    <button
                      type="button"
                      key={pedido.identificador}
                      onClick={() => {
                        setSolicitacaoSelecionada(pedido);
                        setMensagemResultado('');
                      }}
                      aria-pressed={selecionado}
                      className={`w-full text-left bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                        selecionado
                          ? 'border-[#0E7490] ring-2 ring-cyan-100 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="block text-xs text-slate-400 mb-1">
                            Candidato
                          </span>

                          <span className="block text-sm font-bold text-slate-800 break-all">
                            {pedido.candidatoIdentificador}
                          </span>
                        </div>

                        {pedido.estadoSolicitacao === 'pendente' && (
                          <span className="shrink-0 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                            Pendente
                          </span>
                        )}

                        {pedido.estadoSolicitacao === 'aceite' && (
                          <span className="shrink-0 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                            Aceite
                          </span>
                        )}

                        {pedido.estadoSolicitacao === 'recusada' && (
                          <span className="shrink-0 text-xs font-bold text-red-800 bg-red-100 px-2.5 py-1 rounded-full">
                            Recusada
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center gap-2">
                        <span className="text-xs text-slate-500">
                          Recebido: {pedido.dataCriacao}
                        </span>

                        <span className="text-xs font-bold text-[#0E7490]">
                          {selecionado ? 'Selecionado ✓' : 'Ver mensagem →'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* PAINEL DA MENSAGEM */}
          <section className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7 min-h-[350px]">

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                  Comunicação com o candidato
                </span>

                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  Mensagem recebida
                </h2>
              </div>

              {mensagemResultado && (
                <div
                  role="status"
                  className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg"
                >
                  {mensagemResultado}
                </div>
              )}

              {solicitacaoSelecionada ? (
                <>
                  <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 mb-5">
                    <span className="block text-xs font-semibold text-slate-500">
                      Mensagem enviada pelo candidato
                    </span>

                    <p className="text-sm font-bold text-[#164E63] mt-1 break-all">
                      {solicitacaoSelecionada.candidatoIdentificador}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      Data de recebimento: {solicitacaoSelecionada.dataCriacao}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[150px]">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {solicitacaoSelecionada.mensagem}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">

                    {solicitacaoSelecionada.estadoSolicitacao === 'pendente' ? (
                      <>
                        <p className="text-sm text-slate-500 mb-4">
                          Analise a mensagem e escolha uma das opções:
                        </p>

                        <div className="flex flex-wrap justify-end gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              decidirPedido(
                                solicitacaoSelecionada.identificador,
                                'recusada'
                              )
                            }
                            className="px-5 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                          >
                            Recusar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              decidirPedido(
                                solicitacaoSelecionada.identificador,
                                'aceite'
                              )
                            }
                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
                          >
                            Aceitar
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-600">
                        Esta solicitação já foi{' '}
                        <strong>
                          {solicitacaoSelecionada.estadoSolicitacao === 'aceite'
                            ? 'aceite'
                            : 'recusada'}
                        </strong>
                        .
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="min-h-[230px] flex flex-col items-center justify-center text-center px-5">
                  <div className="w-14 h-14 rounded-full bg-cyan-50 text-[#0E7490] flex items-center justify-center text-2xl mb-4">
                    ✉
                  </div>

                  <h3 className="font-bold text-slate-700">
                    Nenhum candidato selecionado
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                    Selecione um candidato da lista à esquerda para consultar
                    a mensagem que enviou e decidir sobre a solicitação.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

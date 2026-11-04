
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { api } from '../servicos/api';
import {
  terminarSessao,
  type UtilizadorApi,
} from '../servicos/autenticacao';

interface SolicitacaoRecebidaApi {
  id: number;
  mentoriaId: number;
  candidatoId: number;
  estado: 'pendente' | 'aceite' | 'recusada' | 'cancelada';
  dataCriacao: string;
  mentoriaTitulo: string;
  candidatoNome: string;
  estadoPagamento: string | null;
  valorPagamento: string | null;
}

type EstadoDecisao = 'aceite' | 'recusada';

export function PainelMentor() {
  const navigate = useNavigate();

  const utilizador: UtilizadorApi | null = (() => {
    try {
      const dados = localStorage.getItem('utilizador');
      return dados ? JSON.parse(dados) as UtilizadorApi : null;
    } catch {
      return null;
    }
  })();

  const nomeMentor = utilizador?.nomeCompleto || 'Mentor';

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoRecebidaApi[]>([]);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] =
    useState<SolicitacaoRecebidaApi | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagemResultado, setMensagemResultado] = useState('');
  const [atualizandoId, setAtualizandoId] = useState<number | null>(null);

  const pedidosPendentes = solicitacoes.filter(
    (pedido) => pedido.estado === 'pendente'
  ).length;

  // Carrega somente as solicitações dirigidas às mentorias deste mentor.
  async function carregarSolicitacoes() {
    setErro('');

    try {
      const resposta = await api.get<{
        solicitacoes: SolicitacaoRecebidaApi[];
      }>('/solicitacoesMentoria/recebidas');

      setSolicitacoes(resposta.data.solicitacoes);
    } catch (error) {
      console.error('Erro ao carregar solicitações recebidas:', error);
      setErro('Não foi possível carregar as solicitações recebidas.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarSolicitacoes();
  }, []);

  // Aceita ou recusa uma solicitação através do backend.
  async function decidirPedido(
    id: number,
    novoEstado: EstadoDecisao
  ) {
    setErro('');
    setMensagemResultado('');
    setAtualizandoId(id);

    try {
      await api.patch(`/solicitacoesMentoria/${id}/estado`, {
        estado: novoEstado,
      });

      const resposta = await api.get<{
        solicitacoes: SolicitacaoRecebidaApi[];
      }>('/solicitacoesMentoria/recebidas');

      const atualizadas = resposta.data.solicitacoes;

      setSolicitacoes(atualizadas);

      const pedidoAtualizado = atualizadas.find(
        (pedido) => pedido.id === id
      );

      setSolicitacaoSelecionada(pedidoAtualizado || null);

      setMensagemResultado(
        novoEstado === 'aceite'
          ? 'Solicitação aceite com sucesso.'
          : 'Solicitação recusada com sucesso.'
      );
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
      setErro(
        'Não foi possível atualizar a solicitação. Verifique o estado do pedido e tente novamente.'
      );
    } finally {
      setAtualizandoId(null);
    }
  }

  function terminarSessaoMentor() {
    terminarSessao();
    navigate('/autenticacao', { replace: true });
  }

  function obterEstadoSolicitacao(estado: string) {
    switch (estado) {
      case 'pendente':
        return {
          texto: 'Pendente',
          classe: 'text-amber-800 bg-amber-100',
        };

      case 'aceite':
        return {
          texto: 'Aceite',
          classe: 'text-emerald-800 bg-emerald-100',
        };

      case 'recusada':
        return {
          texto: 'Recusada',
          classe: 'text-red-800 bg-red-100',
        };

      case 'cancelada':
        return {
          texto: 'Cancelada',
          classe: 'text-slate-600 bg-slate-100',
        };

      default:
        return {
          texto: estado,
          classe: 'text-slate-600 bg-slate-100',
        };
    }
  }

  function obterEstadoPagamento(estado: string | null) {
    switch (estado) {
      case 'pendente':
        return 'Pendente';

      case 'confirmado':
        return 'Confirmado';

      case 'cancelado':
        return 'Cancelado';

      default:
        return 'Não disponível';
    }
  }

  function formatarData(data: string) {
    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return 'Data não disponível';
    }

    return dataFormatada.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F6] text-slate-800">

      {/* CABEÇALHO */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 min-h-[82px] flex flex-wrap items-center justify-between gap-4">

          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/MentoriaBolsas_ Learn, Achieve, Realize.png"
              alt="MentoriaBolsas — Aprenda. Conquiste. Realize."
              className="h-14 w-auto max-w-[220px] object-contain"
            />
          </a>

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
              href="#"
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
              className="text-sm font-semibold text-red-600 rounded-lg px-4 py-2 transition"
            >
              Terminar Sessão
            </button>

            <div className="rounded-lg px-4 py-2">
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

          <h1 className="text-2xl md:text-3xl font-bold">
            Gestão de solicitações de mentoria
          </h1>

          <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed text-cyan-50">
            Consulte os pedidos recebidos, conheça os candidatos interessados
            nas suas mentorias e decida se pretende aceitar ou recusar cada
            solicitação.
          </p>

          <button
            type="button"
            onClick={() => navigate('/mentor/criar-mentoria')}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#164E63] shadow-sm transition hover:bg-cyan-50 hover:shadow-md"
          >
            <span className="text-lg">+</span>
            Criar nova mentoria
          </button>
        </section>

        {/* LISTA DE SOLICITAÇÕES E DETALHES */}
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

            <button
              type="button"
              onClick={() => void carregarSolicitacoes()}
              disabled={carregando || atualizandoId !== null}
              className="mb-4 text-sm font-semibold text-[#0E7490] hover:underline disabled:opacity-50"
            >
              Atualizar solicitações
            </button>

            {carregando && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                A carregar solicitações...
              </div>
            )}

            {!carregando && erro && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm mb-4"
              >
                {erro}
              </div>
            )}

            {!carregando && !erro && solicitacoes.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <p className="font-semibold text-slate-700">
                  Não existem solicitações recebidas.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Quando um candidato solicitar uma das suas mentorias,
                  o pedido aparecerá aqui.
                </p>
              </div>
            )}

            {!carregando && solicitacoes.length > 0 && (
              <div className="space-y-3">
                {solicitacoes.map((pedido) => {
                  const selecionado =
                    solicitacaoSelecionada?.id === pedido.id;

                  const estado = obterEstadoSolicitacao(pedido.estado);

                  return (
                    <button
                      type="button"
                      key={pedido.id}
                      onClick={() => {
                        setSolicitacaoSelecionada(pedido);
                        setMensagemResultado('');
                        setErro('');
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

                          <span className="block text-sm font-bold text-slate-800">
                            {pedido.candidatoNome}
                          </span>
                        </div>

                        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${estado.classe}`}>
                          {estado.texto}
                        </span>
                      </div>

                      <div className="mt-3">
                        <span className="block text-xs text-slate-400">
                          Mentoria solicitada
                        </span>

                        <span className="text-sm font-semibold text-[#164E63]">
                          {pedido.mentoriaTitulo}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {formatarData(pedido.dataCriacao)}
                        </span>

                        <span className="text-xs font-bold text-[#0E7490]">
                          {selecionado ? 'Selecionado ✓' : 'Ver detalhes →'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* PAINEL DE DETALHES */}
          <section className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-7 min-h-[350px]">

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                  Gestão da solicitação
                </span>

                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  Detalhes do pedido
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
                      Candidato
                    </span>

                    <p className="text-lg font-bold text-[#164E63] mt-1">
                      {solicitacaoSelecionada.candidatoNome}
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      Pedido recebido em:{' '}
                      {formatarData(solicitacaoSelecionada.dataCriacao)}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Mentoria solicitada
                    </span>

                    <h3 className="text-lg font-bold text-slate-800 mt-2">
                      {solicitacaoSelecionada.mentoriaTitulo}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2">
                      Identificador da solicitação: #{solicitacaoSelecionada.id}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="rounded-xl border border-slate-200 p-4">
                      <span className="text-xs text-slate-500">
                        Estado da solicitação
                      </span>

                      <p className="font-bold text-slate-800 mt-1">
                        {obterEstadoSolicitacao(
                          solicitacaoSelecionada.estado
                        ).texto}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <span className="text-xs text-slate-500">
                        Estado do pagamento
                      </span>

                      <p className="font-bold text-slate-800 mt-1">
                        {obterEstadoPagamento(
                          solicitacaoSelecionada.estadoPagamento
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                      <span className="text-xs text-slate-500">
                        Valor do pagamento
                      </span>

                      <p className="font-bold text-[#0E7490] mt-1">
                        {solicitacaoSelecionada.valorPagamento !== null
                          ? `${solicitacaoSelecionada.valorPagamento} Kz`
                          : 'Não disponível'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">

                    {solicitacaoSelecionada.estado === 'pendente' ? (
                      <>
                        <p className="text-sm text-slate-500 mb-4">
                          Analise os dados do pedido e escolha uma das opções:
                        </p>

                        <div className="flex flex-wrap justify-end gap-3">

                          <button
                            type="button"
                            disabled={atualizandoId !== null}
                            onClick={() =>
                              void decidirPedido(
                                solicitacaoSelecionada.id,
                                'recusada'
                              )
                            }
                            className="px-5 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
                          >
                            {atualizandoId === solicitacaoSelecionada.id
                              ? 'A processar...'
                              : 'Recusar'}
                          </button>

                          <button
                            type="button"
                            disabled={atualizandoId !== null}
                            onClick={() =>
                              void decidirPedido(
                                solicitacaoSelecionada.id,
                                'aceite'
                              )
                            }
                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            {atualizandoId === solicitacaoSelecionada.id
                              ? 'A processar...'
                              : 'Aceitar'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                        Esta solicitação já foi{' '}
                        <strong>
                          {solicitacaoSelecionada.estado === 'aceite'
                            ? 'aceite'
                            : solicitacaoSelecionada.estado === 'recusada'
                              ? 'recusada'
                              : 'cancelada'}
                        </strong>
                        . Não é possível alterar novamente esta decisão.
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
                    Nenhuma solicitação selecionada
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
                    Selecione um candidato da lista à esquerda para consultar
                    os detalhes do pedido e decidir sobre a solicitação.
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


import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import {
  listarMentorias,
  listarMinhasSolicitacoes,
  type MentoriaApi,
  type SolicitacaoMentoriaApi,
} from '../servicos/mentorias';
import { api } from '../servicos/api';
import {
  terminarSessao,
  type UtilizadorApi,
} from '../servicos/autenticacao';

export function PainelCandidato() {
  const navigate = useNavigate();

  const utilizador: UtilizadorApi | null = (() => {
    try {
      const dados = localStorage.getItem('utilizador');
      return dados ? JSON.parse(dados) as UtilizadorApi : null;
    } catch {
      return null;
    }
  })();

  const nomeCandidato = utilizador?.nomeCompleto || 'Candidato';

  const [mentorias, setMentorias] = useState<MentoriaApi[]>([]);
  const [mentoriaSelecionada, setMentoriaSelecionada] =
    useState<MentoriaApi | null>(null);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [sucessoMensagem, setSucessoMensagem] = useState('');

  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoMentoriaApi[]>([]);
  const [carregandoSolicitacoes, setCarregandoSolicitacoes] = useState(true);
  const [erroSolicitacoes, setErroSolicitacoes] = useState('');

  // Carrega as mentorias disponíveis.
  useEffect(() => {
    async function carregarMentorias() {
      try {
        const dados = await listarMentorias();
        setMentorias(dados.filter((item) => item.ativa));
      } catch (error) {
        console.error('Erro ao carregar mentorias:', error);
        setErro('Não foi possível carregar as mentorias.');
      } finally {
        setCarregando(false);
      }
    }

    void carregarMentorias();
  }, []);

  // Carrega as solicitações do candidato autenticado.
  async function carregarSolicitacoes() {
    setCarregandoSolicitacoes(true);
    setErroSolicitacoes('');

    try {
      const dados = await listarMinhasSolicitacoes();
      setSolicitacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      setErroSolicitacoes(
        'Não foi possível carregar as suas solicitações.'
      );
    } finally {
      setCarregandoSolicitacoes(false);
    }
  }

  useEffect(() => {
    void carregarSolicitacoes();
  }, []);

  // Envia uma solicitação de mentoria.
  async function enviarSolicitacao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!mentoriaSelecionada) {
      setErro('Selecione uma mentoria antes de enviar a solicitação.');
      return;
    }

    setErro('');
    setSucessoMensagem('');
    setEnviando(true);

    try {
      await api.post('/solicitacoesMentoria', {
        mentoriaId: mentoriaSelecionada.id,
      });

      setSucessoMensagem('A sua solicitação foi enviada com sucesso!');
      setMensagem('');
      setMentoriaSelecionada(null);

      // Atualiza o histórico depois da criação.
      await carregarSolicitacoes();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setErro(
        'Não foi possível enviar a solicitação. Verifique se já existe um pedido para esta mentoria.'
      );
    } finally {
      setEnviando(false);
    }
  }

  // Apresenta os estados da solicitação.
  function obterEstadoSolicitacao(estado: string) {
    switch (estado) {
      case 'pendente':
        return {
          texto: 'Pendente',
          classe: 'bg-amber-50 text-amber-700 border-amber-200',
        };

      case 'aceite':
        return {
          texto: 'Aceite',
          classe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };

      case 'recusada':
        return {
          texto: 'Recusada',
          classe: 'bg-red-50 text-red-700 border-red-200',
        };

      case 'cancelada':
        return {
          texto: 'Cancelada',
          classe: 'bg-slate-100 text-slate-600 border-slate-200',
        };

      default:
        return {
          texto: estado,
          classe: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  }

  // Apresenta os estados do pagamento.
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
            <a href="/#inicio" className="hover:text-[#0E7490] transition">
              Home
            </a>
            <a href="/#sobre" className="hover:text-[#0E7490] transition">
              Sobre
            </a>
            <a href="/#bolsas" className="hover:text-[#0E7490] transition">
              Bolsas
            </a>
            <a href="#" className="hover:text-[#0E7490] transition">
              Mentorias
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  terminarSessao();
                  navigate('/autenticacao', { replace: true });
                }}
                className="text-sm font-semibold text-red-600 border-red-200 rounded-lg px-4 py-2 transition"
              >
                Terminar Sessão
              </button>

              <div className="border-cyan-200 rounded-lg px-4 py-2">
                <span className="block text-sm font-bold text-[#164E63]">
                  {nomeCandidato}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="w-full max-w-7xl mx-auto px-5 lg:px-8 py-8 flex-1">

        {/* FAIXA DE ORIENTAÇÃO */}
        <section className="mb-8 rounded-2xl bg-[#164E63] text-white px-6 py-7 md:px-9 md:py-8 shadow-sm">

          <h1 className="mt-2 text-2xl md:text-3xl font-bold">
            Encontre a mentoria certa para si
          </h1>

          <p className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed text-cyan-50">
            Explore as mentorias disponíveis, escolha o mentor que melhor
            corresponde aos seus objetivos e envie uma solicitação para iniciar
            o seu acompanhamento.
          </p>
        </section>

        {/* LISTA E FORMULÁRIO */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7 items-start">

          {/* MENTORIAS DISPONÍVEIS */}
          <section className="lg:col-span-3">

            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  Lista de mentorias disponíveis
                </h2>
              </div>

              <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-2">
                {mentorias.length} {mentorias.length === 1 ? 'mentoria' : 'mentorias'}
              </span>
            </div>

            {carregando && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
                A carregar mentorias...
              </div>
            )}

            {!carregando && mentorias.length === 0 && !erro && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <p className="font-semibold text-slate-700">
                  Ainda não existem mentorias disponíveis.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Volte mais tarde para consultar novas oportunidades.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {mentorias.map((item) => {
                const selecionada = mentoriaSelecionada?.id === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setMentoriaSelecionada(item);
                      setErro('');
                      setSucessoMensagem('');
                    }}
                    aria-pressed={selecionada}
                    className={`w-full text-left bg-white rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      selecionada
                        ? 'border-[#0E7490] ring-2 ring-cyan-100 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-800">
                          {item.titulo}
                        </h3>

                        <span className="inline-flex mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                          Mentoria disponível
                        </span>
                      </div>

                      <span className="text-sm font-bold text-[#0E7490] bg-cyan-50 px-3 py-2 rounded-lg whitespace-nowrap">
                        {item.preco} Kz
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600 mt-4">
                      {item.descricao}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className={`text-xs font-bold ${
                        selecionada ? 'text-[#0E7490]' : 'text-slate-500'
                      }`}>
                        {selecionada
                          ? '✓ Mentoria selecionada'
                          : 'Selecionar esta mentoria'}
                      </span>

                      <span className="text-sm font-semibold text-[#0E7490]">
                        {selecionada ? 'Selecionada' : 'Escolher →'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ÁREA DE SOLICITAÇÃO */}
          <aside className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-5">

              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                  Solicitação
                </span>

                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  Solicitar mentoria
                </h2>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Escolha uma mentoria e envie o seu pedido ao mentor responsável.
                </p>
              </div>

              {sucessoMensagem && (
                <div
                  role="status"
                  className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg"
                >
                  {sucessoMensagem}
                </div>
              )}

              {erro && (
                <div
                  role="alert"
                  className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
                >
                  {erro}
                </div>
              )}

              {mentoriaSelecionada ? (
                <div className="mb-5 p-4 bg-cyan-50 border border-cyan-100 rounded-xl">
                  <span className="text-xs font-semibold text-slate-500">
                    Mentoria escolhida
                  </span>

                  <p className="font-bold text-[#164E63] mt-1">
                    {mentoriaSelecionada.titulo}
                  </p>
                </div>
              ) : (
                <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800">
                    Nenhuma mentoria selecionada
                  </p>

                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Primeiro, escolha uma das mentorias disponíveis na lista.
                  </p>
                </div>
              )}

              <form onSubmit={enviarSolicitacao} className="space-y-4">
                <div>
                  <label
                    htmlFor="mensagem"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    A sua mensagem
                  </label>

                  <textarea
                    id="mensagem"
                    required
                    minLength={5}
                    maxLength={1000}
                    rows={7}
                    disabled={!mentoriaSelecionada || enviando}
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed outline-none resize-y focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder={
                      mentoriaSelecionada
                        ? 'Apresente-se ao mentor e explique as suas necessidades, dúvidas ou objetivos...'
                        : 'Selecione primeiro uma mentoria.'
                    }
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  />

                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>Mínimo: 5 caracteres</span>
                    <span>{mensagem.length}/1000</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    !mentoriaSelecionada ||
                    enviando ||
                    mensagem.trim().length < 5
                  }
                  className="w-full bg-[#0E7490] text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-[#155E75] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {enviando ? 'A enviar solicitação...' : 'Enviar solicitação'}
                </button>

                <p className="text-xs text-center text-slate-400 leading-relaxed">
                  O pedido será associado à mentoria selecionada. A mensagem
                  escrita ainda não é guardada pelo sistema.
                </p>
              </form>
            </div>
          </aside>
        </div>

        {/* HISTÓRICO DE SOLICITAÇÕES */}
        <section className="mt-12">

          <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Acompanhamento
              </span>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
                Minhas solicitações
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Acompanhe o estado dos seus pedidos de mentoria.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void carregarSolicitacoes()}
              disabled={carregandoSolicitacoes}
              className="text-sm font-semibold text-[#0E7490] border border-cyan-200 rounded-lg px-4 py-2 hover:bg-cyan-50 transition disabled:opacity-50"
            >
              {carregandoSolicitacoes ? 'A atualizar...' : 'Atualizar histórico'}
            </button>
          </div>

          {carregandoSolicitacoes && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              A carregar as suas solicitações...
            </div>
          )}

          {!carregandoSolicitacoes && erroSolicitacoes && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 text-sm"
            >
              {erroSolicitacoes}
            </div>
          )}

          {!carregandoSolicitacoes &&
            !erroSolicitacoes &&
            solicitacoes.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <h3 className="font-semibold text-slate-700">
                  Ainda não enviou nenhuma solicitação.
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Quando solicitar uma mentoria, poderá acompanhar aqui o
                  respetivo estado.
                </p>
              </div>
            )}

          {!carregandoSolicitacoes &&
            !erroSolicitacoes &&
            solicitacoes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {solicitacoes.map((solicitacao) => {
                  const estado = obterEstadoSolicitacao(solicitacao.estado);

                  return (
                    <article
                      key={solicitacao.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <span className="text-xs text-slate-400 font-semibold">
                            Solicitação #{solicitacao.id}
                          </span>

                          <h3 className="font-bold text-lg text-slate-800 mt-1">
                            {solicitacao.mentoriaTitulo}
                          </h3>
                        </div>

                        <span className={`shrink-0 text-xs font-bold border rounded-full px-3 py-1.5 ${estado.classe}`}>
                          {estado.texto}
                        </span>
                      </div>

                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Mentor</span>
                          <span className="font-semibold text-slate-700 text-right">
                            {solicitacao.mentorNome}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Data do pedido</span>
                          <span className="font-medium text-slate-700 text-right">
                            {formatarData(solicitacao.dataCriacao)}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Valor</span>
                          <span className="font-semibold text-slate-700">
                            {solicitacao.valorPagamento !== null
                              ? `${solicitacao.valorPagamento} Kz`
                              : 'Não disponível'}
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Pagamento</span>
                          <span className="font-semibold text-slate-700">
                            {obterEstadoPagamento(solicitacao.estadoPagamento)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

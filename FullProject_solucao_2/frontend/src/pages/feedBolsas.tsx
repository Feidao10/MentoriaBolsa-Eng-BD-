
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import {
  listarBolsas,
  type BolsaApi,
} from '../servicos/bolsas';

type Destaque = {
  etiqueta: string;
  titulo: string;
  descricao: string;
};

const destaques: Destaque[] = [
  {
    etiqueta: 'Oportunidades académicas',
    titulo: 'O próximo passo da tua formação começa aqui.',
    descricao:
      'Descobre oportunidades de bolsas de estudo e aproxima-te dos teus objectivos académicos.',
  },
  {
    etiqueta: 'Orientação e acompanhamento',
    titulo: 'Não precisas de percorrer este caminho sozinho.',
    descricao:
      'Encontra apoio e orientação para te preparares melhor para os desafios académicos.',
  },
  {
    etiqueta: 'O teu futuro em primeiro lugar',
    titulo: 'Conhecimento, oportunidades e novas possibilidades.',
    descricao:
      'Explora as oportunidades disponíveis e dá mais um passo em direcção ao teu futuro.',
  },
];

export function FeedBolsas() {
  const navigate = useNavigate();

  const [bolsas, setBolsas] = useState<BolsaApi[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [paisSelecionado, setPaisSelecionado] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [destaqueAtual, setDestaqueAtual] = useState(0);

  useEffect(() => {
    async function carregarBolsas() {
      try {
        const dados = await listarBolsas();
        setBolsas(dados);
      } catch (error) {
        console.error('Erro ao carregar bolsas:', error);
        setErro('Não foi possível carregar as bolsas. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    }

    void carregarBolsas();
  }, []);

  const paises = useMemo(
    () =>
      Array.from(
        new Set(bolsas.map((bolsa) => bolsa.pais).filter(Boolean)),
      ).sort(),
    [bolsas],
  );

  const bolsasFiltradas = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    return bolsas.filter((bolsa) => {
      const correspondePesquisa =
        bolsa.titulo.toLowerCase().includes(termo) ||
        bolsa.descricao.toLowerCase().includes(termo) ||
        bolsa.instituicao.toLowerCase().includes(termo);

      const correspondePais =
        paisSelecionado === '' || bolsa.pais === paisSelecionado;

      return correspondePesquisa && correspondePais;
    });
  }, [bolsas, pesquisa, paisSelecionado]);

  function mudarDestaque(direccao: number) {
    setDestaqueAtual((actual) =>
      (actual + direccao + destaques.length) % destaques.length,
    );
  }

  const destaque = destaques[destaqueAtual];

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
         <a
  href="#inicio"
  className="flex shrink-0 items-center"
  aria-label="MentoriaBolsas - página inicial"
>
  <img
    src="/images/MentoriaBolsas_ Learn, Achieve, Realize.png"
    alt="MentoriaBolsas — Aprenda. Conquiste. Realize."
    className="h-14 w-auto max-w-[220px] object-contain"
  />
</a>

          <nav
            aria-label="Navegação principal"
            className="order-3 flex w-full items-center justify-center gap-5 border-t border-slate-100 pt-3 text-sm font-medium sm:order-2 sm:w-auto sm:gap-7 sm:border-0 sm:pt-0"
          >
            <a
              href="#inicio"
              className="text-[#0e88b9] transition-colors hover:text-[#09658b]"
            >
              Home
            </a>

            <a
              href="#sobre"
              className="text-slate-600 transition-colors hover:text-[#0e88b9]"
            >
              Sobre
            </a>

            <a
              href="#bolsas"
              className="text-slate-600 transition-colors hover:text-[#0e88b9]"
            >
              Bolsas
            </a>

            <button
              type="button"
              onClick={() => navigate('/autenticacao')}
              className="text-slate-600 transition-colors hover:text-[#0e88b9]"
            >
              Mentorias
            </button>
          </nav>

          <div className="order-2 flex min-w-0 flex-1 items-center justify-end gap-2 sm:order-3 sm:flex-none">
            <label className="relative hidden w-44 md:block lg:w-56">
              <span className="sr-only">Pesquisar bolsas</span>

              <input
                type="search"
                value={pesquisa}
                onChange={(event) => setPesquisa(event.target.value)}
                placeholder="Pesquisar..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm outline-none transition focus:border-[#0e88b9] focus:bg-white focus:ring-2 focus:ring-[#0e88b9]/15"
              />

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m16 16 4.2 4.2" />
              </svg>
            </label>

            <button
              type="button"
              onClick={() => navigate('/autenticacao')}
              className="shrink-0 rounded-full bg-[#0e88b9] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#09658b] sm:px-5 sm:text-sm"
            >
              Aceder ao portal
            </button>
          </div>
        </div>
      </header>

      <main id="inicio" className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">

          {/* CARROSSEL DE PUBLICAÇÕES */}

          <section
            aria-label="Carrossel de imagens publicitárias"
            className="relative isolate min-h-[250px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b59] via-[#0e6f94] to-[#1599b8] text-white shadow-md sm:min-h-[300px] lg:min-h-[340px]"
          >
            <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border-[36px] border-white/10" />

            <div className="pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-cyan-300/10 blur-2xl" />

            <div className="relative flex min-h-[250px] items-center px-12 py-10 sm:min-h-[300px] sm:px-20 lg:min-h-[340px] lg:px-24">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50 sm:text-xs">
                  {destaque.etiqueta}
                </span>

                <h1 className="max-w-xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  {destaque.titulo}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
                  {destaque.descricao}
                </p>

                <a
                  href="#bolsas"
                  className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#075778] transition hover:bg-cyan-50"
                >
                  Explorar bolsas
                  <span className="ml-2" aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => mudarDestaque(-1)}
              aria-label="Publicação anterior"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xl text-white transition hover:bg-white/25 sm:left-5 sm:h-11 sm:w-11"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => mudarDestaque(1)}
              aria-label="Próxima publicação"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-xl text-white transition hover:bg-white/25 sm:right-5 sm:h-11 sm:w-11"
            >
              ›
            </button>

            <div
              className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
              aria-label={`Destaque ${destaqueAtual + 1} de ${destaques.length}`}
            >
              {destaques.map((item, indice) => (
                <button
                  key={item.etiqueta}
                  type="button"
                  onClick={() => setDestaqueAtual(indice)}
                  aria-label={`Mostrar publicação ${indice + 1}`}
                  aria-current={indice === destaqueAtual ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all ${
                    indice === destaqueAtual
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </section>

          {/* SOBRE A PLATAFORMA */}

          <section
            id="sobre"
            className="scroll-mt-28 py-10 text-center sm:py-14"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0e88b9]">
              Sobre a plataforma
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Oportunidades para construir o teu futuro
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              A MentoriaBolsas aproxima estudantes de oportunidades de
              financiamento académico e de orientação especializada.
              Aqui podes descobrir bolsas de estudo e encontrar caminhos
              para desenvolver o teu percurso académico.
            </p>
          </section>

          {/* BOLSAS DISPONÍVEIS */}

          <section
            id="bolsas"
            className="scroll-mt-28 pb-12"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0e88b9]">
                  Oportunidades disponíveis
                </span>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  Bolsas de estudo
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Consulte as oportunidades publicadas na plataforma.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <label className="relative md:hidden">
                  <span className="sr-only">Pesquisar bolsas</span>

                  <input
                    type="search"
                    value={pesquisa}
                    onChange={(event) => setPesquisa(event.target.value)}
                    placeholder="Pesquisar por título ou instituição..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0e88b9] focus:ring-2 focus:ring-[#0e88b9]/15"
                  />
                </label>

                <select
                  value={paisSelecionado}
                  onChange={(event) => setPaisSelecionado(event.target.value)}
                  aria-label="Filtrar por país"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-[#0e88b9] focus:ring-2 focus:ring-[#0e88b9]/15"
                >
                  <option value="">Todos os países</option>

                  {paises.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {carregando && (
              <div className="rounded-xl border border-slate-100 bg-white py-14 text-center text-sm text-slate-500">
                A carregar bolsas...
              </div>
            )}

            {!carregando && erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-8 text-center text-sm text-red-700"
              >
                {erro}
              </div>
            )}

            {!carregando && !erro && bolsasFiltradas.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-14 text-center text-sm text-slate-500">
                Nenhuma oportunidade corresponde aos filtros aplicados.
              </div>
            )}

            {!carregando && !erro && bolsasFiltradas.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {bolsasFiltradas.map((bolsa) => (
                  <article
                    key={bolsa.id}
                    className="flex min-h-[290px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0e88b9]/50 hover:shadow-md"
                  >
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-[#08749e]">
                          {bolsa.instituicao}
                        </span>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                          {bolsa.pais}
                        </span>
                      </div>

                      <h3 className="text-base font-bold leading-snug text-slate-900">
                        {bolsa.titulo}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-600">
                        {bSubstr(bolsa.descricao, 125)}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-slate-600">
                        <strong className="text-slate-700">
                          Requisitos:
                        </strong>{' '}
                        {bSubstr(
                          bolsa.requisitos || 'Não especificados',
                          90,
                        )}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-[11px] text-slate-500">
                        Prazo de candidatura:{' '}
                        <span className="font-semibold text-red-600">
                          {bolsa.prazoCandidatura
                            ? new Date(
                                bolsa.prazoCandidatura,
                              ).toLocaleDateString('pt-PT')
                            : 'Não informado'}
                        </span>
                      </p>

                      {bolsa.ligacaoOficial && (
                        <a
                          href={bolsa.ligacaoOficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-xs font-semibold text-[#087da7] transition hover:text-[#075778]"
                        >
                          Consultar candidatura
                          <span className="ml-1" aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function bSubstr(texto: string, maximo: number) {
  return texto.length > maximo
    ? `${texto.substring(0, maximo)}...`
    : texto;
}

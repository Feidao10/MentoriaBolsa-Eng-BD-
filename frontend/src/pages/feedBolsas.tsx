import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import {
listarBolsas,
type BolsaApi,
} from '../servicos/bolsas';

export function FeedBolsas() {
const navigate = useNavigate();

const [bolsas, setBolsas] = useState<BolsaApi[]>([]);
const [pesquisa, setPesquisa] = useState('');
const [paisSelecionado, setPaisSelecionado] = useState('');
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState('');

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

return (
<div className="min-h-screen bg-gray-50 flex flex-col justify-between text-gray-800 font-sans">
<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
<div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="border-l border-gray-200 pl-3">
<span className="text-xs uppercase tracking-widest font-bold text-[#0e88b9] block">
Oportunidades
</span>
<span className="text-sm font-semibold text-gray-700 block">
MentoriaBolsas
</span>
</div>
</div>

      <nav className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/autenticacao')}
          className="bg-[#0e88b9de] text-white px-5 py-2 text-sm font-medium rounded-lg hover:bg-[#0e88b9] transition-colors shadow-sm"
        >
          Aceder ao Portal
        </button>
      </nav>
    </div>
  </header>

  <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
    <section className="mb-8 p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-100">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        Oportunidades de Financiamento Académico
      </h1>
      <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
        Encontre bolsas de estudo e oportunidades de financiamento
        académico para o ensino superior.
      </p>
    </section>

    <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:flex-1">
        <input
          type="search"
          placeholder="Pesquisar por título, descrição ou instituição..."
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
          aria-label="Pesquisar bolsas"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0e89b9e7] focus:bg-white transition-all"
        />
      </div>

      <div className="w-full md:w-56">
        <select
          value={paisSelecionado}
          onChange={(event) => setPaisSelecionado(event.target.value)}
          aria-label="Filtrar por país"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0e89b9e7]"
        >
          <option value="">Todos os países</option>
          {paises.map((pais) => (
            <option key={pais} value={pais}>
              {pais}
            </option>
          ))}
        </select>
      </div>
    </section>

    {carregando && (
      <div className="text-center py-12 text-gray-500">
        A carregar bolsas...
      </div>
    )}

    {!carregando && erro && (
      <div
        role="alert"
        className="text-center py-8 bg-red-50 text-red-700 rounded-xl border border-red-100"
      >
        {erro}
      </div>
    )}

    {!carregando && !erro && bolsasFiltradas.length === 0 && (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
        Nenhuma oportunidade corresponde aos filtros aplicados.
      </div>
    )}

    {!carregando && !erro && bolsasFiltradas.length > 0 && (
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bolsasFiltradas.map((bolsa) => (
          <article
            key={bolsa.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#0e89b9e7] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-50 text-[#0e89b9e7] text-xs font-semibold px-2.5 py-1 rounded-md">
                  {bolsa.instituicao}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                  {bolsa.pais}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {bolsa.titulo}
              </h2>

              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                {bSubstr(bolsa.descricao, 160)}
              </p>

              <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                <strong>Requisitos:</strong>{' '}
                {bolsa.requisitos || 'Não especificados'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs">
              <div className="text-gray-500">
                Prazo:{' '}
                <span className="font-semibold text-red-600">
                  {bolsa.prazoCandidatura
                    ? new Date(
                        bolsa.prazoCandidatura,
                      ).toLocaleDateString('pt-PT')
                    : 'Não informado'}
                </span>
              </div>

              {bolsa.ligacaoOficial && (
                <a
                  href={bolsa.ligacaoOficial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0e89b9e7] font-semibold hover:text-[#0e88b9]"
                >
                  Consultar candidatura →
                </a>
              )}
            </div>
          </article>
        ))}
      </section>
    )}
  </main>

  <Footer />
</div>

);
}

function bSubstr(text: string, max: number) {
return text.length > max ? "${text.substring(0, max)}..." : text;
}
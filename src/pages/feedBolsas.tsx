// Ficheiro: src/pages/feedBolsas.tsx
import { type bolsaEstudo } from '../types';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Footer } from '../components/Footer';

const MOCK_BOLSAS: bolsaEstudo[] = [
  {
    identificador: "uuid-1",
    titulo: "Bolsa de Excelência de Engenharia",
    descricao: "Bolsa integral para estudantes do terceiro ano com média superior a 16 valores.",
    pais: "Angola",
    areaEstudo: "Informática",
    prazoCandidatura: "2026-11-30",
    ligacaoCandidatura: "https://isptec.co.ao",
    publicada: true,
    administradorIdentificador: "admin-uuid",
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  },
  {
    identificador: "uuid-2",
    titulo: "Bolsa de Intercâmbio Tecnológico",
    descricao: "Oportunidade de mobilidade académica internacional para desenvolvimento de software.",
    pais: "Portugal",
    areaEstudo: "Engenharia Informática",
    prazoCandidatura: "2026-12-15",
    ligacaoCandidatura: "https://parceiro.pt",
    publicada: true,
    administradorIdentificador: "admin-uuid",
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  }
];

export function FeedBolsas() {
  const navigate = useNavigate();
  const [pesquisa, setPesquisa] = useState('');
  const [paisSelecionado, setPaisSelecionado] = useState('Todos');

  const listaPaises = useMemo(() => {
    return ['Todos', ...Array.from(new Set(MOCK_BOLSAS.map(b => b.pais)))];
  }, []);

  const bolsasFiltradas = useMemo(() => {
    return MOCK_BOLSAS.filter(bolsa => {
      const correspondePesquisa = bolsa.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
                                  bolsa.descricao.toLowerCase().includes(pesquisa.toLowerCase());
      const correspondePais = paisSelecionado === 'Todos' || bolsa.pais === paisSelecionado;
      return correspondePesquisa && correspondePais && bolsa.publicada;
    });
  }, [pesquisa, paisSelecionado]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between text-gray-800 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block border-l border-gray-200 pl-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#0e88b9] block text-center">...</span>
              <span className="text-sm font-semibold text-gray-700 block">MentoriaBolsas</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/autenticacao')}
              className="bg-[#0e88b9de] text-white px-5 py-2 text-sm font-medium rounded-lg hover:bg-[#0e88b9] active:bg-[#0e88b9] transition-colors shadow-sm"
            >
              Aceder ao Portal
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
        <section className="mb-8 p-6 bg-gradient-to-br from-[#0e88b900] to-[#0e88b900] rounded-1xl border-[#0e89b9e7]">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Oportunidades de Financiamento Académico
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
            Adiquira as melhores bolsas de estudo e oportunidades de financiamento académico para o superior.
          </p>
        </section>

        <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:flex-1">
            <input
              type="text"
              placeholder="Pesquisar por título ou descrição..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0e89b9e7] focus:bg-white transition-all"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={paisSelecionado}
              onChange={(e) => setPaisSelecionado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2  focus:ring-[#0e89b9e7]"
    >
              {listaPaises.map(pais => (
                <option key={pais} value={pais}>{pais === 'Todos' ? 'Todos os Países' : pais}</option>
              ))}
            </select>
          </div>
        </section>

        <section>
          {bolsasFiltradas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
              Nenhuma oportunidade corresponde aos filtros aplicados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bolsasFiltradas.map((bolsa) => (
                <article 
                  key={bolsa.identificador} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#0e89b9e7] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-50 text-[#0e89b9e7] text-xs font-semibold px-2.5 py-1 rounded-md">
                        {bolsa.areaEstudo}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md">
                         {bolsa.pais}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{bolsa.titulo}</h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{bSubstr(bolsa.descricao, 120)}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                    <div className="text-gray-500">
                      Prazo: <span className="font-semibold text-red-600">{bolsa.prazoCandidatura}</span>
                    </div>
                    <a 
                      href={bolsa.ligacaoCandidatura} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm text-[#0e89b9e7] font-semibold hover:text-[#0e88b9] inline-flex items-center gap-1 group"
                    >
                     <p className="hover:bg-[#0e88b915]">Ver Edital Oficial </p> 
                      <span className="transform group-hover:translate-x-1 transition-transform "></span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

    </div>
  );
}

function bSubstr(text: string, max: number) {
  return text.length > max ? text.substring(0, max) + "..." : text;
}

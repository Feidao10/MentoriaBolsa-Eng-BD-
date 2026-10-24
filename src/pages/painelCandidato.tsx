// Ficheiro: src/pages/painelCandidato.tsx
// SESSÃO 1 DE 3 — IMPORTAÇÕES, REFERÊNCIAS E MODELOS DE DADOS RELACIONAIS
import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type mentoria } from '../types';
import { Footer } from '../components/Footer';

interface MentorComunitario {
  identificador: string;
  nome: string;
  areaConhecimento: 'TECNOLOGIA' | 'NEGOCIOS' | 'HUMANIDADES';
  especialidade: string;
  disponivel: boolean;
}

const MOCK_MENTORES: MentorComunitario[] = [
  {
    identificador: "uuid-mentor-1",
    nome: "Mestre Pascoal Luís",
    areaConhecimento: "TECNOLOGIA",
    especialidade: "Engenharia de Software & Arquitetura Web",
    disponivel: true
  },
  {
    identificador: "uuid-mentor-2",
    nome: "Josué Capita",
    areaConhecimento: "TECNOLOGIA",
    especialidade: "Bases de Dados Relacionais & Big Data",
    disponivel: true
  },
  {
    identificador: "uuid-mentor-3",
    nome: "Dra. Teresa Matoso",
    areaConhecimento: "HUMANIDADES",
    especialidade: "Metodologia Científica & Escrita Académica",
    disponivel: true
  },
  {
    identificador: "uuid-mentor-4",
    nome: "Carlos Silva",
    areaConhecimento: "NEGOCIOS",
    especialidade: "Gestão de Projetos Ágeis & Scrum",
    disponivel: false
  }
];

const MOCK_MENTORIAS: mentoria[] = [
  {
    identificador: "mentoria-1",
    titulo: "Apoio em Engenharia de Software e Modelação",
    descricao: "Ajuda prática no desenho de diagramas UML, arquitetura MVC e engenharia de requisitos para o mercado real.",
    preco: 5000,
    moeda: "Kz",
    mentorIdentificador: "uuid-mentor-1",
    disponivel: true,
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  },
  {
    identificador: "mentoria-2",
    titulo: "Aceleração em Bases de Dados Relacionais",
    descricao: "Mentoria focada em modelação Entidade-Associação, normalização e escrita de queries complexas em PostgreSQL.",
    preco: 7500,
    moeda: "Kz",
    mentorIdentificador: "uuid-mentor-2",
    disponivel: true,
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  },
  {
    identificador: "mentoria-3",
    titulo: "Gestão de Equipas com Scrum e Kanban",
    descricao: "Otimização de fluxos de entrega de software, facilitação de cerimónias ágeis e remoção de impedimentos.",
    preco: 6000,
    moeda: "Kz",
    mentorIdentificador: "uuid-mentor-4",
    disponivel: true,
    dataCriacao: "2026-10-24",
    dataAtualizacao: "2026-10-24"
  },
  {
    identificador: "mentoria-4",
    titulo: "Escrita de Artigos e Metodologia Científica",
    descricao: "Orientação para estruturação de teses, revisão de literatura, citações em padrão APA e formatação académica.",
    preco: 4500,
    moeda: "Kz",
    mentorIdentificador: "uuid-mentor-3",
    disponivel: true,
    dataCriacao: "2026-10-24",
    dataAtualizacao: "2026-10-24"
  },
  {
    identificador: "mentoria-5",
    titulo: "Arquitetura Cloud e DevOps Prático",
    descricao: "Mentoria em infraestrutura escalável, esteiras de CI/CD, conteinerização com Docker e deploy contínuo em nuvem.",
    preco: 9000,
    moeda: "Kz",
    mentorIdentificador: "uuid-mentor-1",
    disponivel: true,
    dataCriacao: "2026-10-24",
    dataAtualizacao: "2026-10-24"
  }
];
// SESSÃO 2 DE 3 — LÓGICA DO FLUXO E CARROSSEL COM MARGENS DE PROTECÇÃO LATERAIS
export function PainelCandidato() {
  const navigate = useNavigate();
  const carrosselRef = useRef<HTMLDivElement>(null);
  
  const [mentoriaSelecionada, setMentoriaSelecionada] = useState<mentoria | null>(null);
  const [mentorSelecionado, setMentorSelecionado] = useState<MentorComunitario | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [sucessoMensagem, setSucessoMensagem] = useState(false);

  const mentoresFiltrados = useMemo(() => {
    if (!mentoriaSelecionada) return [];
    return MOCK_MENTORES.filter(m => m.identificador === mentoriaSelecionada.mentorIdentificador);
  }, [mentoriaSelecionada]);

  const moverCarrossel = (direcao: 'esquerda' | 'direita') => {
    if (carrosselRef.current) {
      const deslocamento = 360; 
      carrosselRef.current.scrollBy({
        left: direcao === 'esquerda' ? -deslocamento : deslocamento,
        behavior: 'smooth'
      });
    }
  };

  const handleSelecionarMentoria = (item: mentoria) => {
    setMentoriaSelecionada(item);
    setMentorSelecionado(null); 
    setMensagem('');
  };

  const enviarSolicitacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentoriaSelecionada || !mentorSelecionado) return;

    const novaSolicitacao = {
      mentoriaIdentificador: mentoriaSelecionada.identificador,
      mentorIdentificador: mentorSelecionado.identificador,
      mensagem: mensagem,
      estadoSolicitacao: 'pendente'
    };

    console.log("Fluxo sequencial concluído. Payload enviado:", novaSolicitacao);
    setSucessoMensagem(true);
    setMensagem('');
    setTimeout(() => {
      setSucessoMensagem(false);
      setMentorSelecionado(null);
      setMentoriaSelecionada(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
      
      {/* CABEÇALHO GLOBAL */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            
            <h1 className="text-sm font-bold text-gray-700">Candidato</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className=" hover:bg-#[000000] text-red-600  px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            Terminar Sessão
          </button>
        </div>
      </header>

      {/* ZONA DE CONTEÚDO */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 flex-grow space-y-8">
        
        {/* PASSO 1: CARROSSEL MODERNO COM CANAL DE ESPAÇO NAS LATERAIS */}
        <section className="space-y-3">
          <div className="px-2">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">Esolha a mentoria</h2>
            <p className="text-xs text-gray-500">Selecione uma das opções abaixo para libertar a listagem de mentores</p>
          </div>
          
          {/* Contentor Relativo com px-12 para empurrar os cartões e acomodar as setas nas calhas */}
          <div className="relative px-12 bg-white rounded-2xl border border-gray-100 py-4 shadow-sm">
            
            {/* Seta Esquerda Flutuante — Posicionada perfeitamente na calha esquerda */}
            <button 
              type="button"
              onClick={() => moverCarrossel('esquerda')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 h-9 w-8 rounded-xl flex items-center justify-center shadow-sm font-bold active:scale-95 transition-all"
              title="Anterior"
            >
              ←
            </button>

            {/* Seta Direita Flutuante — Posicionada perfeitamente na calha direita */}
            <button 
              type="button"
              onClick={() => moverCarrossel('direita')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 h-9 w-8 rounded-xl flex items-center justify-center shadow-sm font-bold active:scale-95 transition-all"
              title="Seguinte"
            >
              →
            </button>
            
            {/* Linha de Rolagem com transbordo protegido pelas margens */}
            <div 
              ref={carrosselRef}
              className="flex gap-4 overflow-x-auto pb-1 scroll-smooth snap-x overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {MOCK_MENTORIAS.map((item) => (
                <article 
                  key={item.identificador} 
                  className={`min-w-[260px] sm:min-w-[310px] max-w-[330px] bg-gray-50 p-5 rounded-xl border snap-start transition-all duration-200 flex flex-col justify-between cursor-pointer flex-shrink-0 ${
                    mentoriaSelecionada?.identificador === item.identificador 
                      ? 'border-[#0e88b9] bg-blue-50/10 ring-2 ring-blue-50/50 shadow-sm' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-sm'
                  }`}
                  onClick={() => handleSelecionarMentoria(item)}
                >
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug tracking-tight line-clamp-1">{item.titulo}</h3>
                      <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-lg text-xs whitespace-nowrap">
                        {item.preco} {item.moeda}/h
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{item.descricao}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                    <span className="text-gray-400">Plataforma Comunitária</span>
                    <span className={`font-bold ${mentoriaSelecionada?.identificador === item.identificador ? 'text-[#0e88b9]' : 'text-slate-400'}`}>
                      {mentoriaSelecionada?.identificador === item.identificador ? '✓ Ativo' : 'Selecionar'}
                    </span>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
        {/* SESSÃO 3 DE 3 — BLOCOS INFERIORES LADO A LADO (PASSOS 2 E 3), RODAPÉ E AUXILIARES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* PASSO 2: COLUNA INFERIOR ESQUERDA — SELECÇÃO DE MENTOR */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 min-h-[260px] flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Selecione o Mentor</h2>
              <p className="text-xs text-gray-500 mt-0.5">Especialistas vinculados ao programa ativo</p>
            </div>

            {mentoriaSelecionada ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mt-2">
                {mentoresFiltrados.map((mentor) => (
                  <div 
                    key={mentor.identificador} 
                    onClick={() => mentor.disponivel && setMentorSelecionado(mentor)}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between shadow-sm cursor-pointer ${
                      !mentor.disponivel ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' :
                      mentorSelecionado?.identificador === mentor.identificador 
                        ? 'border-[#0e88b9] bg-blue-50/10 ring-2 ring-blue-50' 
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-gray-900 text-sm">{mentor.nome}</h4>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                        {mentor.areaConhecimento}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{mentor.especialidade}</p>
                    <div className="mt-3 pt-2 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${mentor.disponivel ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {mentor.disponivel ? 'Disponível para Sessões' : 'Ocupado'}
                        </span>
                      </div>
                      {mentorSelecionado?.identificador === mentor.identificador && (
                        <span className="text-[10px] text-[#0e88b9] font-bold">✓ Ativo</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl px-4 leading-relaxed bg-gray-50/50 my-auto">
                Selecione o/a mentor/ra correspondente
              </div>
            )}
          </section>

          {/* PASSO 3: COLUNA INFERIOR DIREITA — FORMULÁRIO DE FORMALIZAÇÃO */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm min-h-[260px]">
            <h2 className="text-base font-bold text-gray-900 tracking-tight mb-3">3. Formalizar Proposta Directa</h2>
            
            {mentoriaSelecionada && mentorSelecionado ? (
              <form onSubmit={enviarSolicitacao} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl text-xs border border-gray-100 space-y-1">
                  <div className="text-gray-500">Destinatário: <strong className="text-gray-900">{mentorSelecionado.nome}</strong></div>
                  <div className="text-gray-500">Programa: <strong className="text-gray-900">{mentoriaSelecionada.titulo}</strong></div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Proposta ou Mensagem de Acompanhamento
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-xs focus:ring-2 focus:ring-[#0e89b9e7] focus:bg-white outline-none resize-none transition-all leading-relaxed"
                    placeholder="Escreva as suas principais necessidades ou objetivos de suporte técnico para que o mentor avalie a proposta..."
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  />
                </div>

                {sucessoMensagem && (
                  <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-xl text-center animate-pulse">
                    ✓ Proposta enviada com sucesso para o mentor comunitário!
                  </div>
                )}

                <button type="submit" className="w-full bg-[#0e89b9e7] text-white p-2.5 rounded-xl font-bold text-xs hover:bg-[#0e88b9] transition-all shadow-sm active:scale-95">
                  Enviar Mensagem Directa
                </button>
              </form>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl px-4 leading-relaxed bg-gray-50/50 h-full flex items-center justify-center">
                Selecione a mentoria e o/a mentor/ra correspondente para enviar o pedido.
              </div>
            )}
          </section>

        </div>
      </main>

      {/* RODAPÉ GLOBAL COMPONENTIZADO */}
      <Footer />
      
    </div>
  );
}

// function bSubstr(text: string, max: number) {
//   return text.length > max ? text.substring(0, max) + "..." : text;
// }

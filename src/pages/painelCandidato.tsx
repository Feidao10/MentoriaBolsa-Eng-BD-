// Ficheiro: src/pages/painelCandidato.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type mentoria } from '../types';
import { Footer } from '../components/Footer';

// CORREÇÃO: Adicionados os campos obrigatórios 'dataCriacao' e 'dataAtualizacao' em cada objeto de teste
const MOCK_MENTORIAS: mentoria[] = [
  {
    identificador: "mentor-1",
    titulo: "Apoio a Engenharia de Software e Modelação",
    descricao: "Ajuda prática no desenho de diagramas UML, arquitetura MVC e engenharia de requisitos.",
    preco: 5000,
    moeda: "Kz",
    mentorIdentificador: "uuid-professor-1",
    disponivel: true,
    dataCriacao: "2026-10-22", // Adicionado para cumprir o contrato da pág. 1
    dataAtualizacao: "2026-10-22" // Adicionado para cumprir o contrato da pág. 1
  },
  {
    identificador: "mentor-2",
    titulo: "Mentoria de Bases de Dados Relacionais",
    descricao: "Apoio em modelação Entidade-Associação, normalização e escrita de queries complexas em PostgreSQL.",
    preco: 7500,
    moeda: "Kz",
    mentorIdentificador: "uuid-professor-2",
    disponivel: true,
    dataCriacao: "2026-10-22",
    dataAtualizacao: "2026-10-22"
  }
];

export function PainelCandidato() {
  const navigate = useNavigate();
  const [mentoriaSelecionada, setMentoriaSelecionada] = useState<mentoria | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [sucessoMensagem, setSucessoMensagem] = useState(false);

  const enviarSolicitacao = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaSolicitacao = {
      mentoriaIdentificador: mentoriaSelecionada?.identificador,
      mensagem: mensagem,
      estadoSolicitacao: 'pendente'
    };

    console.log("Enviando solicitação de mentoria para o Backend:", novaSolicitacao);
    
    setSucessoMensagem(true);
    setMensagem('');
    setTimeout(() => {
      setSucessoMensagem(false);
      setMentoriaSelecionada(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Candidato</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Terminar Sessão
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Ofertas de Mentoria Disponíveis</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {MOCK_MENTORIAS.map((item) => (
              <div 
                key={item.identificador} 
                className={`bg-white p-5 rounded-xl border transition cursor-pointer ${
                  mentoriaSelecionada?.identificador === item.identificador 
                    ? 'border-blue-500 ring-2 ring-blue-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setMentoriaSelecionada(item)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 text-lg">{item.titulo}</h3>
                  <span className="text-green-600 font-extrabold bg-green-50 px-3 py-1 rounded-lg text-sm">
                    {item.preco} {item.moeda}/hora
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">{item.descricao}</p>
                <div className="mt-3 text-right">
                  <span className="text-xs text-[#0e89b9e7] font-semibold">
                    {mentoriaSelecionada?.identificador === item.identificador ? 'Selecionado' : 'Clique para selecionar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Solicitar Acompanhamento</h2>
          
          {mentoriaSelecionada ? (
            <form onSubmit={enviarSolicitacao} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-[#0e89b9e7] border border-blue-100">
                A solicitar mentoria para: <strong className="block">{mentoriaSelecionada.titulo}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Apresentação / Mensagem para o Mentor
                </label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0e89b9e7] outline-none resize-none"
                  placeholder="Explique detalhadamente quais as suas dúvidas ou dificuldades nesta cadeira..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>

              {sucessoMensagem && (
                <div className="p-3 bg-green-100 text-green-800 text-sm font-semibold rounded-lg text-center animate-pulse">
                  ✓ Solicitação enviada com estado 'pendente'!
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#0e89b9e7] text-white p-2.5 rounded-lg font-semibold text-sm hover:bg-[#0e88b9] transition"
              >
                Confirmar e Enviar Pedido
              </button>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              Seleccione uma oferta de mentoria à esquerda para abrir o formulário de candidatura.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Ficheiro: src/pages/feedBolsas.tsx
// CORREÇÃO DO ERRO 1: Adicionada a palavra 'type' no import
import { type bolsaEstudo } from '../types';
import { useNavigate } from 'react-router-dom';

// CORREÇÃO DOS ERROS 2 E 3: Adicionados os campos obrigatórios 'dataCriacao' e 'dataAtualizacao'
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
    dataCriacao: "2026-10-22", // Adicionado com base na pág. 1 do PDF
    dataAtualizacao: "2026-10-22" // Adicionado com base na pág. 1 do PDF
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
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">MentoriaBolsas Portal</h1>
        <button 
        onClick={() => navigate('/autenticacao')}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
  Entrar / Criar Conta
</button>
      </header>

      <main className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Bolsas de Estudo Publicadas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_BOLSAS.map((bolsa) => (
            <div key={bolsa.identificador} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {bolsa.pais} | {bolsa.areaEstudo}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{bolsa.titulo}</h3>
                <p className="text-gray-600 mt-2 text-sm">{bSubstr(bolsa.descricao, 120)}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">Prazo: {bolsa.prazoCandidatura}</span>
                <a 
                  href={bolsa.ligacaoCandidatura} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  Ver Edital →
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function bSubstr(text: string, max: number) {
  return text.length > max ? text.substring(0, max) + "..." : text;
}

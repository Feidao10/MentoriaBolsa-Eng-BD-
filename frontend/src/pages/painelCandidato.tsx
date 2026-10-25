import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { listarMentorias, type MentoriaApi } from '../servicos/mentorias';
import { api } from '../servicos/api';
import { terminarSessao } from '../servicos/autenticacao';

export function PainelCandidato() {
  const navigate = useNavigate();

  const [mentorias, setMentorias] = useState<MentoriaApi[]>([]);
  const [mentoriaSelecionada, setMentoriaSelecionada] =
    useState<MentoriaApi | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [sucessoMensagem, setSucessoMensagem] = useState('');

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

  async function enviarSolicitacao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!mentoriaSelecionada) return;

    setErro('');
    setSucessoMensagem('');
    setEnviando(true);

    try {
      await api.post('/solicitacoesMentoria', {
        mentoriaId: mentoriaSelecionada.id,
        mensagem: mensagem.trim(),
      });

      setSucessoMensagem('Solicitação enviada com sucesso!');
      setMensagem('');
      setMentoriaSelecionada(null);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setErro('Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Candidato</h1>

          <button
             type="button"
  onClick={() => {
    terminarSessao();
    navigate('/autenticacao', { replace: true });
  }}
  className="text-sm font-semibold text-red-600 hover:underline"
          >
            Terminar Sessão
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1">
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            Ofertas de Mentoria Disponíveis
          </h2>

          {carregando && <p>A carregar mentorias...</p>}

          {!carregando && erro && (
            <p role="alert" className="text-red-600">
              {erro}
            </p>
          )}

          {!carregando && !erro && mentorias.length === 0 && (
            <p className="text-gray-500">
              Não existem mentorias disponíveis.
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            {mentorias.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setMentoriaSelecionada(item)}
                className={`text-left bg-white p-5 rounded-xl border transition ${
                  mentoriaSelecionada?.id === item.id
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {item.titulo}
                  </h3>

                  <span className="text-green-600 font-extrabold bg-green-50 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                    {item.preco} Kz
                  </span>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                  {item.descricao}
                </p>

                <p className="mt-3 text-right text-xs text-sky-700 font-semibold">
                  {mentoriaSelecionada?.id === item.id
                    ? 'Selecionado'
                    : 'Clique para selecionar'}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl border border-gray-200 h-fit shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Solicitar Acompanhamento
          </h2>

          {sucessoMensagem && (
            <p role="status" className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded-lg">
              {sucessoMensagem}
            </p>
          )}

          {erro && (
            <p role="alert" className="mb-4 text-red-600 text-sm">
              {erro}
            </p>
          )}

          {mentoriaSelecionada ? (
            <form onSubmit={enviarSolicitacao} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-sky-700 border border-blue-100">
                Mentoria selecionada:
                <strong className="block">
                  {mentoriaSelecionada.titulo}
                </strong>
              </div>

              <div>
                <label
                  htmlFor="mensagem"
                  className="block text-xs font-bold text-gray-700 uppercase"
                >
                  Apresentação / Mensagem para o Mentor
                </label>

                <textarea
                  id="mensagem"
                  required
                  minLength={5}
                  maxLength={1000}
                  rows={4}
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-600 outline-none resize-none"
                  placeholder="Explique as suas dúvidas ou dificuldades..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-sky-700 text-white p-2.5 rounded-lg font-semibold text-sm hover:bg-sky-800 disabled:opacity-50"
              >
                {enviando ? 'A enviar...' : 'Confirmar e Enviar Pedido'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              Selecione uma oferta de mentoria para abrir o formulário.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
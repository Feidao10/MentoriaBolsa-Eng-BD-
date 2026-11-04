
import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarMentoria } from '../servicos/mentorias';

export function CriarMentoria() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function submeterFormulario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    setErro('');
    setSucesso('');

    const valorPreco = Number(preco);

    if (!Number.isFinite(valorPreco) || valorPreco < 0) {
      setErro('Introduza um preço válido, igual ou superior a zero.');
      return;
    }

    if (!titulo.trim() || !descricao.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setCarregando(true);
    try {
      
      await criarMentoria({
  titulo,
  descricao,
  preco: preco,
});

      setSucesso('Mentoria criada com sucesso!');

      setTitulo('');
      setDescricao('');
      setPreco('');

    } catch (error: unknown) {
      console.error('Erro ao criar mentoria:', error);

      if (axios.isAxiosError(error)) {
        console.error('Status HTTP:', error.response?.status);
        console.error(
          'Resposta do backend:',
          error.response?.data
        );

        const mensagemBackend =
          error.response?.data?.mensagem ||
          error.response?.data?.erro;

        if (mensagemBackend) {
          setErro(String(mensagemBackend));
        } else {
          setErro(
            'Não foi possível criar a mentoria. Consulte a consola para mais detalhes.'
          );
        }
      } else {
        setErro(
          'Ocorreu um erro inesperado ao criar a mentoria.'
        );
      }

    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => navigate('/mentor/dashboard')}
          className="mb-6 text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          ← Voltar ao painel
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
              Área do mentor
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              Criar nova mentoria
            </h1>

            <p className="mt-3 text-slate-600">
              Partilhe os seus conhecimentos e disponibilize
              uma nova oportunidade de acompanhamento aos candidatos.
            </p>
          </div>

          <form
            onSubmit={submeterFormulario}
            className="space-y-6"
          >

            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-semibold text-slate-700"
              >
                Título da mentoria
              </label>

              <input
                id="titulo"
                type="text"
                required
                maxLength={180}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Preparação para bolsas de estudo"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="descricao"
                className="block text-sm font-semibold text-slate-700"
              >
                Descrição
              </label>

              <textarea
                id="descricao"
                required
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva os objetivos, conteúdos e benefícios desta mentoria..."
                className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="preco"
                className="block text-sm font-semibold text-slate-700"
              >
                Preço (Kz)
              </label>

              <input
                id="preco"
                type="number"
                required
                min="0"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex.: 5000"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Introduza o valor em kwanzas. Para uma mentoria gratuita,
                introduza 0.
              </p>
            </div>

            {erro && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {erro}
              </p>
            )}

            {sucesso && (
              <p
                role="status"
                className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                {sucesso}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate('/mentor/dashboard')}
                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={carregando}
                className="rounded-lg bg-sky-700 px-6 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {carregando
                  ? 'A criar...'
                  : 'Publicar mentoria'}
              </button>

            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CriarMentoria;

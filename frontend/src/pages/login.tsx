import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSessao } from '../servicos/autenticacao';
import { api } from '../servicos/api';

type TipoUtilizador = 'candidato' | 'mentor' | 'administrador';

interface RespostaRegisto {
  token?: string;
  utilizador?: {
    tipo: TipoUtilizador;
  };
}

export function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [tipoUtilizador, setTipoUtilizador] =
    useState<TipoUtilizador>('candidato');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function redirecionar(tipo: TipoUtilizador) {
    if (tipo === 'mentor') {
      navigate('/mentor/dashboard', { replace: true });
    } else if (tipo === 'administrador') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/candidato/dashboard', { replace: true });
    }
  }

  async function submeterFormulario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      if (isLogin) {
        const resposta = await iniciarSessao(email, palavraPasse);

        localStorage.setItem('token', resposta.token);

        // O tipo vem do backend, não de uma escolha no frontend.
        redirecionar(resposta.utilizador.tipo);
      } else {
        const resposta = await api.post<RespostaRegisto>(
          '/autenticacao/registar',
          {
            nomeCompleto,
            email,
            palavraPasse,
            tipo: tipoUtilizador,
          }
        );

        if (resposta.data.token && resposta.data.utilizador) {
          localStorage.setItem('token', resposta.data.token);
          redirecionar(resposta.data.utilizador.tipo);
        } else {
          setIsLogin(true);
          setPalavraPasse('');
        }
      }
    // } catch (error) {
    //   console.error('Erro na autenticação:', error);

    //   setErro(
    //     isLogin
    //       ? 'Não foi possível iniciar sessão. Verifique as credenciais.'
    //       : 'Não foi possível criar a conta. Verifique os dados.'
    //   );
    // } finally {
    //   setCarregando(false);
    // }
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error('Status HTTP:', error.response?.status);
    console.error('Resposta do backend:', error.response?.data);
  } else {
    console.error('Erro:', error);
  }

  setErro(
    isLogin
      ? 'Não foi possível iniciar sessão. Verifique as credenciais.'
      : 'Não foi possível criar a conta. Verifique os dados.',
  );
} finally {
  setCarregando(false);
}
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#0e89b9e7] mb-6">
          {isLogin ? 'Iniciar Sessão' : 'Criar Nova Conta'}
        </h2>

        <form onSubmit={submeterFormulario} className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="nomeCompleto"
                className="block text-sm font-semibold text-gray-700"
              >
                Nome Completo
              </label>

              <input
                id="nomeCompleto"
                type="text"
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg outline-none"
                placeholder="Ex: Ana Silva"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg outline-none"
              placeholder="Ex: estudante@isptec.co.ao"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="palavraPasse"
              className="block text-sm font-semibold text-gray-700"
            >
              Palavra-passe
            </label>

            <input
              id="palavraPasse"
              type="password"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg outline-none"
              placeholder="••••••••"
              value={palavraPasse}
              onChange={(e) => setPalavraPasse(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="tipoUtilizador"
                className="block text-sm font-semibold text-gray-700"
              >
                Tipo de Utilizador
              </label>

              <select
                id="tipoUtilizador"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-white outline-none"
                value={tipoUtilizador}
                onChange={(e) =>
                  setTipoUtilizador(e.target.value as TipoUtilizador)
                }
              >
                <option value="candidato">Candidato (Estudante)</option>
                <option value="mentor">Mentor (Tutor/Instituição)</option>
              </select>
            </div>
          )}

          {erro && (
            <p role="alert" className="text-red-600 text-sm">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#0e89b9e7] text-white p-2 rounded-lg font-semibold transition mt-2 disabled:opacity-50"
          >
            {carregando
              ? 'A processar...'
              : isLogin
                ? 'Entrar'
                : 'Registar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErro('');
            }}
            className="text-[#0e89b9e7] hover:underline font-medium"
          >
            {isLogin
              ? 'Não tem conta? Registe-se aqui'
              : 'Já tem conta? Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

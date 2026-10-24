// Ficheiro: src/pages/login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Estados dos inputs alinhados com o camelCase do Backend
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [palavraPasseHash, setPalavraPasseHash] = useState('');
  const [tipoUtilizador, setTipoUtilizador] = useState<'candidato' | 'mentor' | 'administrador'>('candidato');

  const submeterFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      console.log("Autenticando com:", { email, palavraPasseHash });
    } else {
      console.log("Registando utilizador:", { nomeCompleto, email, palavraPasseHash, tipoUtilizador });
    }

    // Redireciona de acordo com o tipo estrito
    if (tipoUtilizador === 'mentor') {
      navigate('/mentor/dashboard');
    } else if (tipoUtilizador === 'administrador') {
      navigate('/admin/dashboard');
    } else {
      navigate('/candidato/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#0e89b9e7] mb-6">
          {isLogin ? 'Iniciar Sessão' : 'Criar Nova Conta'}
        </h2>

        <form onSubmit={submeterFormulario} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nome Completo</label>
              <input
                type="text"
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:[#0e89b9e7] outline-none"
                placeholder="Ex: Ana Silva"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email </label>
            <input
              type="email"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e89b9e7] outline-none"
              placeholder="Ex: estudante@isptec.co.ao"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Palavra-passe</label>
            <input
              type="password"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e89b9e7] outline-none"
              placeholder="••••••••"
              value={palavraPasseHash}
              onChange={(e) => setPalavraPasseHash(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">Tipo de Utilizador</label>
              <select
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0e89b9e7] outline-none"
                value={tipoUtilizador}
                // CORREÇÃO DO ERRO DO ESLINT: O valor é mapeado estritamente para o literal correto
                onChange={(e) => setTipoUtilizador(e.target.value as 'candidato' | 'mentor' | 'administrador')}
              >
                <option value="candidato">Candidato (Estudante)</option>
                <option value="mentor">Mentor (Tutor/Instituição)</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-[#0e89b9e7] text-white p-2 rounded-lg font-semibold hover:bg-[#0e89b9e7] transition mt-2">
            {isLogin ? 'Entrar' : 'Registar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#0e89b9e7] hover:underline font-medium">
            {isLogin ? 'Não tem conta? Registe-se aqui' : 'Já tem conta? Faça Login'}
          </button>
        </div>
      </div>

      
    </div>

    
  );
}

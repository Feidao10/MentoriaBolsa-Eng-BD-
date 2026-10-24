// Ficheiro: src/components/Footer.tsx

export function Footer() {
  return (
    <footer className="bg-[#0b526e] text-slate-300 text-xs mt-12 border-t border-[#093f55] w-full">
      {/* 1. SECÇÃO DE CONTEÚDO PRINCIPAL (Grelha de 4 Colunas) */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-[#093f55] pb-8 mb-6">
          
          {/* Coluna 1: Identidade e Missão */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">MentoriaBolsas</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-[11px]">
              Plataforma académica desenvolvida para aproximar os estudantes das melhores oportunidades de financiamento internacional e orientação especializada.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Plataforma</h4>
            <nav className="flex flex-col space-y-2 text-[11px]">
              <a href="/" className="hover:text-white hover:underline transition-all flex items-center gap-1">
                <span>•</span> Explorar Bolsas
              </a>
              <a href="/autenticacao" className="hover:text-white hover:underline transition-all flex items-center gap-1">
                <span>•</span> Portal de Autenticação
              </a>
              <div>
                <span className="inline-block text-[#000000]     bg-[#072f4034] px-2 py-0.5 rounded text-[10px] font-medium  border-[#072f40]">
                  MVP Web • v1.0
                </span>
              </div>
            </nav>
          </div>

          {/* Coluna 3: Suporte & Contactos */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Suporte</h4>
            <ul className="flex flex-col space-y-2 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-300">+244 922 334 466</span>  
                <span className="text-slate-500">||</span>
                <span className="text-slate-300">+244 922 334 766</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-slate-300 hover:text-white transition-colors cursor-pointer break-all">
                  suporte.mentoriabolsas@isptec.co.ao
                </span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Espaço Reservado para Contexto Académico */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Instituição</h4>
            <p className="leading-relaxed text-slate-400 text-[11px]">
              Projecto desenvolvido no âmbito do curso de Engenharia Informática do ISPTEC.
            </p>
          </div>

        </div>

        {/* 2. BARRA DE COPYRIGHT E TERMOS (Rodapé Inferior) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 tracking-wide">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} • mentoriabolsas.dev</span>
          </div>
         
          <div className="flex items-center gap-4">
            <span className="text-slate-500 italic">Feito em Angola</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

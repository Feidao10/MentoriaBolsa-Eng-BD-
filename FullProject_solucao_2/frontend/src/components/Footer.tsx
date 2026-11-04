
export function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t border-[#164b63] bg-[#0b526e] text-slate-300">

      <div className="mx-auto max-w-7xl px-5 pt-12 pb-6 sm:px-8">

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 gap-9 border-b border-white/10 pb-9 sm:grid-cols-2 lg:grid-cols-4">

          {/* Coluna 1: Identidade e missão */}
          <section aria-label="Sobre a MentoriaBolsas" className="space-y-4">

            <a
              href="/"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-white transition hover:text-cyan-200"
              aria-label="MentoriaBolsas - Página inicial"
            >
              

              MentoriaBolsas
            </a>

            <p className="max-w-xs text-xs leading-6 text-slate-300/80">
              Plataforma académica desenvolvida para aproximar os estudantes
              das melhores oportunidades de financiamento internacional e
              orientação especializada.
            </p>

            <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-medium tracking-wide text-cyan-100">
              MVP Web · v1.0
            </span>

          </section>

          {/* Coluna 2: Navegação */}
          <section aria-labelledby="footer-plataforma" className="space-y-4">

            <h2
              id="footer-plataforma"
              className="text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Plataforma
            </h2>

            <nav aria-label="Links da plataforma">
              <ul className="space-y-3 text-xs">

                <li>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-300/80 transition hover:translate-x-1 hover:text-white"
                  >
                    <span aria-hidden="true" className="text-cyan-300">›</span>
                    Explorar Bolsas
                  </a>
                </li>

                <li>
                  <a
                    href="/autenticacao"
                    className="inline-flex items-center gap-2 text-slate-300/80 transition hover:translate-x-1 hover:text-white"
                  >
                    <span aria-hidden="true" className="text-cyan-300">›</span>
                    Portal de Autenticação
                  </a>
                </li>

              </ul>
            </nav>

          </section>

          {/* Coluna 3: Suporte e contactos */}
          <section aria-labelledby="footer-suporte" className="space-y-4">

            <h2
              id="footer-suporte"
              className="text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Suporte
            </h2>

            <ul className="space-y-3 text-xs">

              <li className="space-y-2">

                <a
                  href="tel:+244922334466"
                  className="block text-slate-300/80 transition hover:text-white"
                >
                  +244 922 334 466
                </a>

                <a
                  href="tel:+244922334766"
                  className="block text-slate-300/80 transition hover:text-white"
                >
                  +244 922 334 766
                </a>

              </li>

              <li>
                <a
                  href="mailto:suporte.mentoriabolsas@isptec.co.ao"
                  className="break-all text-slate-300/80 transition hover:text-cyan-200"
                >
                  suporte.mentoriabolsas@isptec.co.ao
                </a>
              </li>

            </ul>

          </section>

          {/* Coluna 4: Instituição */}
          <section aria-labelledby="footer-instituicao" className="space-y-4">

            <h2
              id="footer-instituicao"
              className="text-xs font-bold uppercase tracking-[0.15em] text-white"
            >
              Instituição
            </h2>

            <p className="text-xs leading-6 text-slate-300/80">
              Projecto desenvolvido no âmbito do curso de Engenharia
              Informática do ISPTEC.
            </p>

          </section>

        </div>

        {/* Barra inferior */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center sm:flex-row sm:text-left">

          <p className="text-[11px] tracking-wide text-slate-300/70">
            © {anoAtual} MentoriaBolsas. Todos os direitos reservados.
          </p>

          <span className="text-[11px] font-medium tracking-wide text-cyan-200/80">
            Feito em Angola
          </span>

        </div>

      </div>

    </footer>
  );
}

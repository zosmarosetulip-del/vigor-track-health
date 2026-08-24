import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const navegacao = [
  { para: "/", rotulo: "Painel" },
  { para: "/testes", rotulo: "Testes" },
  { para: "/plano", rotulo: "Plano" },
  { para: "/evolucao", rotulo: "Evolução" },
  { para: "/perfil", rotulo: "Perfil" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-brand font-display text-lg text-brand-foreground">
              V
            </div>
            <div>
              <p className="font-display text-xl leading-none">Vitalidade</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-mute">
                Longevidade Funcional
              </p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-6 text-[15px] text-mute">
            {navegacao.map((item) => (
              <Link
                key={item.para}
                to={item.para}
                activeOptions={{ exact: item.para === "/" }}
                activeProps={{ className: "text-ink font-medium" }}
                className="transition-colors hover:text-ink"
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>
        </header>

        {children}

        <footer className="mt-12 border-t border-border pt-6 text-[12px] leading-relaxed text-mute">
          Vitalidade é uma ferramenta de bem-estar funcional. Não substitui avaliação clínica, não
          fornece diagnóstico e não estima anos de vida. As probabilidades derivam de modelo
          prognóstico publicado (Studenski et al., JAMA 2011) e variam conforme a população.
          Reavaliação recomendada a cada 4–6 semanas.
        </footer>
      </div>
    </div>
  );
}

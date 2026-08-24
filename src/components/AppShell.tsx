import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useI18n, type Idioma } from "@/lib/i18n";

const navegacao = [
  { para: "/", chave: "dashboard" },
  { para: "/testes", chave: "tests" },
  { para: "/plano", chave: "plan" },
  { para: "/evolucao", chave: "progress" },
  { para: "/perfil", chave: "profile" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { idioma, setIdioma, t } = useI18n();

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
                {t.common.brandTagline}
              </p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-5">
            <nav className="flex flex-wrap items-center gap-6 text-[15px] text-mute">
              {navegacao.map((item) => (
                <Link
                  key={item.para}
                  to={item.para}
                  activeOptions={{ exact: item.para === "/" }}
                  activeProps={{ className: "text-ink font-medium" }}
                  className="transition-colors hover:text-ink"
                >
                  {t.common.nav[item.chave]}
                </Link>
              ))}
            </nav>
            <div
              className="flex items-center gap-1 rounded-full border border-border bg-surface p-1"
              aria-label={t.common.language}
            >
              {(["pt", "en"] as Idioma[]).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => setIdioma(opcao)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    idioma === opcao ? "bg-brand text-brand-foreground" : "text-mute hover:text-ink"
                  }`}
                  aria-pressed={idioma === opcao}
                >
                  {opcao === "pt" ? t.common.pt : t.common.en}
                </button>
              ))}
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-12 border-t border-border pt-6 text-[12px] leading-relaxed text-mute">
          {t.common.footer}
        </footer>
      </div>
    </div>
  );
}

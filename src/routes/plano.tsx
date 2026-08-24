import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/plano")({
  head: () => ({
    meta: [
      { title: "Plano funcional — Vitalidade" },
      {
        name: "description",
        content:
          "Plano progressivo para força, marcha e equilíbrio, preparado para evoluir com resultados funcionais reais.",
      },
      { property: "og:title", content: "Plano funcional — Vitalidade" },
      {
        property: "og:description",
        content:
          "Orientação inicial segura para acompanhar força, marcha e equilíbrio sem inventar resultados clínicos.",
      },
    ],
  }),
  component: PaginaPlano,
});

function PaginaPlano() {
  const { t } = useI18n();
  const areasPlano = t.plan.areas;
  return (
    <AppShell>
      <section className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
          {t.plan.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">{t.plan.heading}</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-mute">{t.plan.intro}</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {areasPlano.map((area) => (
          <article key={area.titulo} className="rounded-3xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terra">
              {area.titulo}
            </p>
            <p className="mt-4 min-h-20 text-[15px] leading-relaxed text-mute">{area.descricao}</p>
            <div className="mt-6 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-center text-xs font-semibold text-brand">
              {area.status}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-brand-deep p-6 text-brand-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground/60">
          {t.plan.reassessment}
        </p>
        <h2 className="mt-3 font-display text-3xl">{t.plan.reassessment}</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-foreground/75">
          {t.plan.reassessmentText}
        </p>
        <Link
          to="/testes"
          className="mt-6 inline-block rounded-full bg-cream px-7 py-3 text-[15px] font-semibold text-brand-deep"
        >
          {t.plan.startAssessment}
        </Link>
      </section>
    </AppShell>
  );
}

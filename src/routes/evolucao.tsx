import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAvaliacoes } from "@/lib/store";

export const Route = createFileRoute("/evolucao")({
  head: () => ({
    meta: [
      { title: "Acompanhamento funcional — Vitalidade" },
      {
        name: "description",
        content:
          "Acompanhe histórico e evolução funcional de força de preensão, velocidade da marcha e equilíbrio.",
      },
      { property: "og:title", content: "Acompanhamento funcional — Vitalidade" },
      {
        property: "og:description",
        content:
          "Estrutura preparada para receber medições reais e comparar sua evolução funcional.",
      },
    ],
  }),
  component: PaginaEvolucao,
});

const areasEvolucao = ["FORÇA DE PREENSÃO", "VELOCIDADE DA MARCHA", "EQUILÍBRIO"] as const;

function PaginaEvolucao() {
  const { avaliacoes, hidratado } = useAvaliacoes();
  const temAvaliacoes = avaliacoes.length > 0;

  return (
    <AppShell>
      <section className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
          ACOMPANHAMENTO
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
          Veja sua <span className="italic text-brand">evolução funcional</span>
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-mute">
          Compare suas medições ao longo do tempo e acompanhe mudanças na força, marcha e
          equilíbrio.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {areasEvolucao.map((area) => (
          <article key={area} className="rounded-3xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terra">{area}</p>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-background/60 p-5 text-[14px] text-mute">
              {hidratado && temAvaliacoes
                ? "Estrutura pronta para comparar medições reais em próximas versões."
                : "Ainda não há medições"}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-terra">
          Histórico de avaliações
        </p>
        <h2 className="mt-3 font-display text-3xl">Histórico de avaliações</h2>
        {!hidratado || !temAvaliacoes ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">
            Nenhuma avaliação registrada ainda. Complete sua primeira bateria de testes para começar
            a acompanhar sua evolução.
          </p>
        ) : (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">
            {avaliacoes.length} avaliação{avaliacoes.length === 1 ? "" : "ões"} registrada
            {avaliacoes.length === 1 ? "" : "s"}. Os dados reais já estão disponíveis para futuras
            visualizações comparativas.
          </p>
        )}
        <Link
          to="/testes"
          className="mt-6 inline-block rounded-full bg-brand px-7 py-3 text-[15px] font-semibold text-brand-foreground"
        >
          Fazer primeira avaliação
        </Link>
      </section>
    </AppShell>
  );
}

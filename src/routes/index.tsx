import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAvaliacoes, usePerfil, formatarData } from "@/lib/store";
import { calcularPercentis, calcularRisco, triagem } from "@/lib/risk";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de risco funcional — Vitalidade" },
      {
        name: "description",
        content:
          "Acompanhe força de preensão, velocidade de marcha e equilíbrio e veja sua estratificação de risco probabilística por idade e sexo.",
      },
      { property: "og:title", content: "Painel de risco funcional — Vitalidade" },
      {
        property: "og:description",
        content:
          "Estratificação de risco probabilística com força, marcha e equilíbrio, mais plano de exercícios adaptativo.",
      },
    ],
  }),
  component: Painel,
});

const testes = [
  { n: 1, titulo: "Força de preensão", detalhe: "3 tentativas · maior valor usado" },
  { n: 2, titulo: "Velocidade de marcha", detalhe: "4 m · cronômetro do app" },
  { n: 3, titulo: "Equilíbrio", detalhe: "apoio unipodal · apoio próximo" },
];

function Painel() {
  const { perfil, hidratado } = usePerfil();
  const { ultima, avaliacoes } = useAvaliacoes();

  if (!hidratado) return <AppShell><div className="py-20" /></AppShell>;

  if (!perfil) {
    return (
      <AppShell>
        <section className="mt-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
            Comece por aqui
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
            Monitore sua <span className="italic text-brand">função</span>, não a sua idade.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-mute">
            Em menos de 5 minutos você registra seu perfil e faz a primeira bateria de testes de
            força, marcha e equilíbrio. Nenhum resultado é um diagnóstico.
          </p>
          <Link
            to="/perfil"
            className="mt-7 inline-block rounded-full bg-brand px-7 py-3 text-[15px] font-semibold text-brand-foreground"
          >
            Criar meu perfil
          </Link>
        </section>
      </AppShell>
    );
  }

  const medicoes = ultima ?? {};
  const p = calcularPercentis(perfil, medicoes);
  const risco = calcularRisco(perfil, medicoes);
  const alertas = triagem(perfil);
  const temMedicao = Boolean(ultima);

  return (
    <AppShell>
      <section className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
            Painel de risco relativo
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
            {temMedicao ? (
              <>
                {risco.resumo.split(" está ")[0]} está{" "}
                <span className="italic text-brand">
                  {risco.categoria === "desempenho preservado"
                    ? "acima da média"
                    : risco.categoria === "desempenho intermediário"
                      ? "na média"
                      : "abaixo da média"}
                </span>{" "}
                para a sua faixa etária.
              </>
            ) : (
              <>
                Faça sua <span className="italic text-brand">primeira bateria</span> de testes.
              </>
            )}
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-mute">
            {temMedicao
              ? `Estimativa baseada em modelo prognóstico calibrado por idade e sexo (${perfil.idade} anos, ${perfil.sexo}). É uma probabilidade populacional, não uma previsão individual. Última medição em ${formatarData(ultima!.data)}.`
              : "As probabilidades abaixo usam apenas os valores médios da sua faixa etária até que você registre suas medições."}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {risco.faixas.map((f) => {
              const destaque = f.horizonteAnos === 5;
              return (
                <div
                  key={f.horizonteAnos}
                  className={`rounded-2xl border p-4 ${
                    destaque ? "border-brand/30 bg-brand/5" : "border-border bg-surface"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.12em] ${destaque ? "text-brand" : "text-mute"}`}
                  >
                    {f.horizonteAnos} {f.horizonteAnos === 1 ? "ano" : "anos"}
                  </p>
                  <p className={`mt-1 font-display text-2xl ${destaque ? "text-brand" : ""}`}>
                    {f.probabilidade}%
                  </p>
                  <p className="text-[11px] text-mute">
                    IC {f.ic[0]}–{f.ic[1]}%
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-terra/25 bg-terra/5 px-4 py-3 text-[12px] leading-relaxed text-ink/70">
            <span className="font-semibold text-terra">Nota de segurança:</span> este valor não é um
            diagnóstico nem uma contagem de anos de vida. Mantenha acompanhamento com seu
            profissional de saúde.
          </div>

          {risco.foraDeValidacao && (
            <div className="mt-3 rounded-xl border border-border bg-surface px-4 py-3 text-[12px] leading-relaxed text-mute">
              Seu perfil está fora da faixa etária em que o modelo foi validado (50 anos ou mais).
              A confiabilidade da estimativa é reduzida e o intervalo de incerteza foi ampliado.
            </div>
          )}

          {alertas.map((a) => (
            <div
              key={a.titulo}
              className="mt-3 rounded-xl border border-border bg-surface px-4 py-3 text-[12px] leading-relaxed text-mute"
            >
              <span className="font-semibold text-ink">{a.titulo}:</span> {a.texto}
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-brand-deep p-6 text-brand-foreground">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Próximos testes</h2>
              <span className="text-[11px] uppercase tracking-[0.15em] text-brand-foreground/60">
                Bateria guiada
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {testes.map((t) => (
                <div
                  key={t.n}
                  className="flex items-center gap-3 rounded-2xl bg-cream/10 p-3"
                >
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                      t.n === 1 ? "bg-terra/90" : "bg-cream/15"
                    }`}
                  >
                    {t.n}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.titulo}</p>
                    <p className="text-[11px] text-brand-foreground/60">{t.detalhe}</p>
                  </div>
                  <span className="text-brand-foreground/70">→</span>
                </div>
              ))}
            </div>
            <Link
              to="/testes"
              className="mt-5 block w-full rounded-full bg-cream py-3 text-center text-sm font-semibold text-brand-deep"
            >
              Iniciar bateria de testes
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-12">
        <CartaoMetrica
          titulo="Força de preensão"
          rotulo="percentil"
          valor={ultima?.forcaKg != null ? ultima.forcaKg.toFixed(0) : "—"}
          unidade="kg"
          percentil={p.forca}
          cor="text-brand"
          barra="bg-brand"
        />
        <CartaoMetrica
          titulo="Velocidade de marcha"
          rotulo="percentil"
          valor={ultima?.marchaMs != null ? ultima.marchaMs.toFixed(2) : "—"}
          unidade="m/s"
          percentil={p.marcha}
          cor="text-terra"
          barra="bg-terra"
        />
        <CartaoMetrica
          titulo="Equilíbrio"
          rotulo="apoio unipodal"
          valor={ultima?.equilibrioS != null ? ultima.equilibrioS.toFixed(0) : "—"}
          unidade="seg"
          percentil={p.equilibrio}
          cor="text-brand-deep"
          barra="bg-brand-deep"
        />
      </section>

      <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-surface p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
            Plano adaptativo
          </p>
          <h2 className="mt-2 font-display text-2xl">Sua semana de movimento está pronta</h2>
          <p className="mt-1 text-sm text-mute">
            {avaliacoes.length} {avaliacoes.length === 1 ? "avaliação registrada" : "avaliações registradas"} ·
            reavaliação sugerida em 4–6 semanas
          </p>
        </div>
        <Link
          to="/plano"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
        >
          Ver plano de exercícios
        </Link>
      </section>
    </AppShell>
  );
}

function CartaoMetrica({
  titulo,
  rotulo,
  valor,
  unidade,
  percentil,
  cor,
  barra,
}: {
  titulo: string;
  rotulo: string;
  valor: string;
  unidade: string;
  percentil?: number;
  cor: string;
  barra: string;
}) {
  return (
    <div className="lg:col-span-4">
      <div className="rounded-3xl border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg">{titulo}</h2>
          <span className="text-[11px] uppercase tracking-[0.12em] text-mute">{rotulo}</span>
        </div>
        <p className={`mt-2 font-display text-5xl ${cor}`}>
          {valor} <span className="text-xl text-mute">{unidade}</span>
        </p>
        <p className="mt-1 text-sm text-mute">
          {percentil != null ? `${percentil}º percentil da sua faixa` : "sem medição registrada"}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand">
          <div className={`h-full rounded-full ${barra}`} style={{ width: `${percentil ?? 0}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.1em] text-mute">
          <span>Baixo</span>
          <span>Alto</span>
        </div>
      </div>
    </div>
  );
}

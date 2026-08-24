import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { perfilPadrao, usePerfil } from "@/lib/store";
import type { Perfil } from "@/lib/risk";
import { MODELO_IDADE_MINIMA, triagem } from "@/lib/risk";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "{t.profile.eyebrow} de segurança — Vitalidade" },
      {
        name: "description",
        content:
          "Informe idade, sexo, histórico de quedas e condições relevantes para calibrar sua estratificação de risco e adaptar os testes.",
      },
      { property: "og:title", content: "{t.profile.eyebrow} de segurança — Vitalidade" },
      {
        property: "og:description",
        content: "Onboarding em menos de 5 minutos com triagem de contraindicações.",
      },
    ],
  }),
  component: PaginaPerfil,
});

function PaginaPerfil() {
  const { perfil, salvarPerfil, hidratado } = usePerfil();
  const [form, setForm] = useState<Perfil>(perfilPadrao);
  const [salvo, setSalvo] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (perfil) setForm(perfil);
  }, [perfil]);

  const alertas = triagem(form);

  function campo<K extends keyof Perfil>(chave: K, valor: Perfil[K]) {
    setForm((f) => ({ ...f, [chave]: valor }));
    setSalvo(false);
  }

  if (!hidratado)
    return (
      <AppShell>
        <div className="py-20" />
      </AppShell>
    );

  return (
    <AppShell>
      <section className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
          {t.profile.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl">{t.profile.heading}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">{t.profile.intro}</p>

        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            salvarPerfil(form);
            setSalvo(true);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo rotulo={t.profile.name}>
              <input
                className="entrada"
                value={form.nome}
                maxLength={80}
                onChange={(e) => campo("nome", e.target.value)}
                placeholder={t.profile.namePlaceholder}
              />
            </Campo>
            <Campo rotulo={t.profile.age}>
              <input
                type="number"
                min={18}
                max={110}
                className="entrada"
                value={form.idade}
                onChange={(e) => campo("idade", Number(e.target.value))}
              />
            </Campo>
            <Campo rotulo={t.profile.sex}>
              <select
                className="entrada"
                value={form.sexo}
                onChange={(e) => campo("sexo", e.target.value as Perfil["sexo"])}
              >
                <option value="feminino">{t.common.female}</option>
                <option value="masculino">{t.common.male}</option>
              </select>
            </Campo>
            <Campo rotulo={t.profile.activity}>
              <select
                className="entrada"
                value={form.nivelAtividade}
                onChange={(e) =>
                  campo("nivelAtividade", e.target.value as Perfil["nivelAtividade"])
                }
              >
                <option value="sedentario">{t.common.activity.sedentario}</option>
                <option value="leve">{t.common.activity.leve}</option>
                <option value="moderado">{t.common.activity.moderado}</option>
                <option value="ativo">{t.common.activity.ativo}</option>
              </select>
            </Campo>
            <Campo rotulo={t.profile.height}>
              <input
                type="number"
                min={120}
                max={220}
                className="entrada"
                value={form.alturaCm}
                onChange={(e) => campo("alturaCm", Number(e.target.value))}
              />
            </Campo>
            <Campo rotulo={t.profile.weight}>
              <input
                type="number"
                min={30}
                max={250}
                className="entrada"
                value={form.pesoKg}
                onChange={(e) => campo("pesoKg", Number(e.target.value))}
              />
            </Campo>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="font-display text-xl">{t.profile.safety}</h2>
            <div className="mt-4 space-y-3">
              <Marcador
                rotulo={t.profile.aid}
                valor={form.usaAuxilioMarcha}
                aoMudar={(v) => campo("usaAuxilioMarcha", v)}
              />
              <Marcador
                rotulo={t.profile.fall}
                valor={form.quedaUltimos6Meses}
                aoMudar={(v) => campo("quedaUltimos6Meses", v)}
              />
              <Marcador
                rotulo={t.profile.surgery}
                valor={form.cirurgiaRecente}
                aoMudar={(v) => campo("cirurgiaRecente", v)}
              />
              <Marcador
                rotulo={t.profile.cardio}
                valor={form.doencaCardiovascular}
                aoMudar={(v) => campo("doencaCardiovascular", v)}
              />
            </div>
          </div>

          {form.idade < MODELO_IDADE_MINIMA && (
            <p className="rounded-xl border border-terra/25 bg-terra/5 px-4 py-3 text-[12px] leading-relaxed text-ink/70">
              {t.profile.underAge}
            </p>
          )}

          {alertas.map((a) => (
            <p
              key={a.titulo}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-[12px] leading-relaxed text-mute"
            >
              <span className="font-semibold text-ink">{a.titulo}:</span> {a.texto}
            </p>
          ))}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="rounded-full bg-brand px-7 py-3 text-[15px] font-semibold text-brand-foreground"
            >
              {t.profile.save}
            </button>
            {salvo && (
              <button
                type="button"
                onClick={() => navigate({ to: "/testes" })}
                className="rounded-full border border-brand px-7 py-3 text-[15px] font-semibold text-brand"
              >
                {t.profile.goTests}
              </button>
            )}
          </div>
        </form>
      </section>
    </AppShell>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-mute">
        {rotulo}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Marcador({
  rotulo,
  valor,
  aoMudar,
}: {
  rotulo: string;
  valor: boolean;
  aoMudar: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-[15px]">
      <input
        type="checkbox"
        checked={valor}
        onChange={(e) => aoMudar(e.target.checked)}
        className="size-5 accent-[var(--brand)]"
      />
      <span>{rotulo}</span>
    </label>
  );
}

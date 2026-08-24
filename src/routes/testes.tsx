import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bluetooth,
  Camera,
  Footprints,
  Gauge,
  HeartPulse,
  MapPin,
  Smartphone,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAvaliacoes, usePerfil } from "@/lib/store";
import { triagem } from "@/lib/risk";

export const Route = createFileRoute("/testes")({
  head: () => ({
    meta: [
      { title: "Bateria de testes funcionais — Vitalidade" },
      {
        name: "description",
        content:
          "Registre força de preensão, teste de marcha de 4 metros e apoio unipodal com protocolos guiados passo a passo.",
      },
      { property: "og:title", content: "Bateria de testes funcionais — Vitalidade" },
      {
        property: "og:description",
        content: "Protocolos guiados de força, marcha e equilíbrio para uso doméstico seguro.",
      },
    ],
  }),
  component: PaginaTestes,
});

function useCronometro() {
  const [ms, setMs] = useState(0);
  const [rodando, setRodando] = useState(false);
  const inicio = useRef(0);

  useEffect(() => {
    if (!rodando) return;
    inicio.current = Date.now() - ms;
    const id = window.setInterval(() => setMs(Date.now() - inicio.current), 50);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodando]);

  return {
    segundos: ms / 1000,
    rodando,
    iniciar: () => setRodando(true),
    parar: () => setRodando(false),
    zerar: () => {
      setRodando(false);
      setMs(0);
    },
  };
}

function PaginaTestes() {
  const { perfil, hidratado } = usePerfil();
  const { adicionar } = useAvaliacoes();
  const navigate = useNavigate();

  const [tentativasForca, setTentativasForca] = useState<string[]>(["", "", ""]);
  const [maoDominante, setMaoDominante] = useState<"direita" | "esquerda">("direita");
  const [tempos, setTempos] = useState<number[]>([]);
  const [equilibrio, setEquilibrio] = useState<number | null>(null);

  const cronoMarcha = useCronometro();
  const cronoEquilibrio = useCronometro();

  if (!hidratado)
    return (
      <AppShell>
        <div className="py-20" />
      </AppShell>
    );

  if (!perfil) {
    return (
      <AppShell>
        <section className="mt-10 max-w-xl">
          <h1 className="font-display text-3xl">Crie seu perfil antes dos testes</h1>
          <p className="mt-3 text-[15px] text-mute">
            Precisamos de idade, sexo e triagem de segurança para escolher o protocolo correto.
          </p>
          <Link
            to="/perfil"
            className="mt-6 inline-block rounded-full bg-brand px-7 py-3 text-[15px] font-semibold text-brand-foreground"
          >
            Ir para o perfil
          </Link>
        </section>
      </AppShell>
    );
  }

  const alertas = triagem(perfil);
  const valoresForca = tentativasForca
    .map((v) => Number(v.replace(",", ".")))
    .filter((v) => Number.isFinite(v) && v > 0);
  const maiorForca = valoresForca.length ? Math.max(...valoresForca) : undefined;
  const mediaForca = valoresForca.length
    ? valoresForca.reduce((a, b) => a + b, 0) / valoresForca.length
    : undefined;

  const velocidades = tempos.map((t) => 4 / t);
  const divergencia =
    velocidades.length >= 2
      ? Math.abs(velocidades[0] - velocidades[1]) / Math.max(...velocidades)
      : 0;
  const precisaTerceira = velocidades.length === 2 && divergencia > 0.1;
  const marchaFinal = velocidades.length
    ? velocidades.reduce((a, b) => a + b, 0) / velocidades.length
    : undefined;

  const podeSalvar = maiorForca != null || marchaFinal != null || equilibrio != null;

  return (
    <AppShell>
      <section className="mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
          Bateria guiada
        </p>
        <h1 className="mt-3 font-display text-4xl">Três medições, uma sessão</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">
          Faça os testes com calçado habitual, em piso plano e sem obstáculos. Tenha uma parede ou
          cadeira ao alcance da mão. Interrompa em caso de tontura ou dor.
        </p>
        <div className="mt-5 rounded-2xl border border-brand/20 bg-brand/5 p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold text-ink">Smartphone como sensor funcional</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-mute">
                O Vitalidade começa com cronômetro e registro manual, mas o protocolo já prepara a
                evolução para acelerômetro e giroscópio no teste de marcha. Mantenha o telefone no
                bolso, cinto ou próximo à cintura para reduzir variação entre reavaliações.
              </p>
            </div>
          </div>
        </div>
        {alertas.map((a) => (
          <p
            key={a.titulo}
            className="mt-3 rounded-xl border border-terra/25 bg-terra/5 px-4 py-3 text-[12px] leading-relaxed text-ink/70"
          >
            <span className="font-semibold text-terra">{a.titulo}:</span> {a.texto}
          </p>
        ))}
      </section>

      {/* 1. Força de preensão */}
      <section className="mt-8 rounded-3xl border border-border bg-surface p-6">
        <Cabecalho numero={1} titulo="Força de preensão" subtitulo="Inserção manual em kg" />
        <p className="mt-3 text-[14px] leading-relaxed text-mute">
          Sentado, cotovelo a 90°, faça 3 tentativas com 30 segundos de descanso. Nenhum dinamômetro
          Bluetooth pareado — o registro manual não bloqueia o uso do app.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {tentativasForca.map((v, i) => (
            <label key={i} className="block">
              <span className="text-[12px] uppercase tracking-[0.1em] text-mute">
                Tentativa {i + 1}
              </span>
              <input
                inputMode="decimal"
                className="entrada mt-2"
                value={v}
                placeholder="kg"
                onChange={(e) => {
                  const novo = [...tentativasForca];
                  novo[i] = e.target.value.slice(0, 5);
                  setTentativasForca(novo);
                }}
              />
            </label>
          ))}
          <label className="block">
            <span className="text-[12px] uppercase tracking-[0.1em] text-mute">Mão</span>
            <select
              className="entrada mt-2"
              value={maoDominante}
              onChange={(e) => setMaoDominante(e.target.value as "direita" | "esquerda")}
            >
              <option value="direita">Direita</option>
              <option value="esquerda">Esquerda</option>
            </select>
          </label>
        </div>
        {maiorForca != null && (
          <p className="mt-4 text-[14px] text-ink">
            Maior valor <strong>{maiorForca.toFixed(1)} kg</strong> · média {mediaForca!.toFixed(1)}{" "}
            kg — o maior valor é o utilizado no cálculo de risco, conforme prática clínica de
            referência.
          </p>
        )}
      </section>

      {/* 2. Marcha */}
      <section className="mt-6 rounded-3xl border border-border bg-surface p-6">
        <Cabecalho numero={2} titulo="Velocidade de marcha" subtitulo="Percurso de 4 metros" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <CartaoTecnologia
            icone={Gauge}
            titulo="Agora"
            texto="Cronômetro do app calcula velocidade = 4 m ÷ tempo e salva a média das tentativas."
          />
          <CartaoTecnologia
            icone={Activity}
            titulo="Próximo passo"
            texto="Acelerômetro e giroscópio podem detectar início, fim, passos, cadência e regularidade."
          />
          <CartaoTecnologia
            icone={HeartPulse}
            titulo="Longitudinal"
            texto="HealthKit e Health Connect podem complementar a tendência diária de caminhada na fase 2."
          />
        </div>
        <ol className="mt-4 space-y-2 text-[14px] leading-relaxed text-mute">
          <li>1. Marque 4 m, com 1 m extra de aceleração antes e desaceleração depois.</li>
          <li>2. Inicie parado. Toque em “Iniciar” ao cruzar a primeira marca.</li>
          <li>3. Toque em “Parar” ao cruzar a marca dos 4 m. Faça 2 tentativas.</li>
        </ol>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="font-display text-5xl tabular-nums text-terra">
            {cronoMarcha.segundos.toFixed(2)}s
          </span>
          {!cronoMarcha.rodando ? (
            <button
              onClick={cronoMarcha.iniciar}
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => {
                cronoMarcha.parar();
                if (cronoMarcha.segundos > 0.5) {
                  setTempos((t) => [...t, cronoMarcha.segundos]);
                }
                cronoMarcha.zerar();
              }}
              className="rounded-full bg-terra px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Parar
            </button>
          )}
          <button
            onClick={() => {
              cronoMarcha.zerar();
              setTempos([]);
            }}
            className="text-sm text-mute underline"
          >
            Refazer tentativas
          </button>
        </div>
        {tempos.length > 0 && (
          <ul className="mt-4 space-y-1 text-[14px] text-ink">
            {tempos.map((t, i) => (
              <li key={i}>
                Tentativa {i + 1}: {t.toFixed(2)}s · {(4 / t).toFixed(2)} m/s
              </li>
            ))}
          </ul>
        )}
        {precisaTerceira && (
          <p className="mt-4 rounded-xl border border-terra/25 bg-terra/5 px-4 py-3 text-[12px] leading-relaxed text-ink/70">
            As duas tentativas divergiram mais de 10%. Faça uma terceira tentativa para que a média
            seja confiável na comparação ao longo do tempo.
          </p>
        )}
        {marchaFinal != null && (
          <p className="mt-4 text-[14px] text-ink">
            Velocidade média: <strong>{marchaFinal.toFixed(2)} m/s</strong>
          </p>
        )}
        <p className="mt-4 text-[12px] leading-relaxed text-mute">
          GPS não é usado como medida principal neste teste curto: para 4 metros, sensores inerciais
          e um protocolo padronizado tendem a ser mais adequados do que localização externa.
        </p>
      </section>

      {/* 3. Equilíbrio */}
      <section className="mt-6 rounded-3xl border border-border bg-surface p-6">
        <Cabecalho numero={3} titulo="Equilíbrio" subtitulo="Apoio unipodal cronometrado" />
        <p className="mt-3 text-[14px] leading-relaxed text-mute">
          Fique de pé perto de uma parede ou cadeira. Levante um pé do chão e mantenha o equilíbrio
          sem apoiar-se. Pare ao tocar o chão, apoiar-se ou completar 45 segundos.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <CartaoTecnologia
            icone={Camera}
            titulo="Fase posterior"
            texto="Câmera com estimativa de pose pode acompanhar tronco, quadril, joelho e tornozelo."
          />
          <CartaoTecnologia
            icone={Footprints}
            titulo="Validação clínica"
            texto="A detecção corporal não substitui automaticamente uma medida prognóstica sem validação local."
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="font-display text-5xl tabular-nums text-brand-deep">
            {cronoEquilibrio.segundos.toFixed(1)}s
          </span>
          {!cronoEquilibrio.rodando ? (
            <button
              onClick={cronoEquilibrio.iniciar}
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => {
                cronoEquilibrio.parar();
                setEquilibrio(Math.min(45, cronoEquilibrio.segundos));
              }}
              className="rounded-full bg-terra px-6 py-3 text-sm font-semibold text-accent-foreground"
            >
              Parar
            </button>
          )}
          <button
            onClick={() => {
              cronoEquilibrio.zerar();
              setEquilibrio(null);
            }}
            className="text-sm text-mute underline"
          >
            Refazer
          </button>
        </div>
        {equilibrio != null && (
          <p className="mt-4 text-[14px] text-ink">
            Resultado: <strong>{equilibrio.toFixed(1)}s</strong>.{" "}
            {equilibrio < 5
              ? "Abaixo de 5 segundos — seu plano de equilíbrio começará pelo nível introdutório, sempre com apoio ao alcance."
              : "Registrado. Mantenha a reavaliação a cada 4–6 semanas."}
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          disabled={!podeSalvar}
          onClick={() => {
            adicionar({
              forcaKg: maiorForca,
              marchaMs: marchaFinal,
              equilibrioS: equilibrio ?? undefined,
              protocoloForca: `dinamômetro manual · mão ${maoDominante} · ${valoresForca.length} tentativas · maior valor`,
              tentativasForca: valoresForca,
              protocoloMarcha: "4 m com zona de aceleração · cronômetro do app",
            });
            navigate({ to: "/" });
          }}
          className="rounded-full bg-brand px-7 py-3 text-[15px] font-semibold text-brand-foreground disabled:opacity-40"
        >
          Salvar avaliação e recalcular risco
        </button>
        <span className="text-sm text-mute">
          Os dados ficam no seu dispositivo e o registro funciona offline.
        </span>
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
          Roadmap técnico
        </p>
        <h2 className="mt-2 font-display text-2xl">Tecnologias planejadas para o Vitalidade</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <CartaoTecnologia
            icone={Bluetooth}
            titulo="Força"
            texto="MVP com dinamômetro manual e digitação; Bluetooth fica para integração futura."
          />
          <CartaoTecnologia
            icone={Smartphone}
            titulo="Marcha 4 m"
            texto="MVP com cronômetro; sensores do telefone são a primeira evolução instrumental."
          />
          <CartaoTecnologia
            icone={HeartPulse}
            titulo="Atividade diária"
            texto="HealthKit no iPhone e Health Connect no Android entram como acompanhamento longitudinal."
          />
          <CartaoTecnologia
            icone={MapPin}
            titulo="GPS"
            texto="Reservado para caminhadas externas maiores, não para o teste clínico curto de 4 metros."
          />
        </div>
      </section>
    </AppShell>
  );
}

function CartaoTecnologia({
  icone: Icone,
  titulo,
  texto,
}: {
  icone: typeof Smartphone;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-cream/35 p-4">
      <div className="flex items-start gap-3">
        <Icone className="mt-0.5 size-5 shrink-0 text-terra" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">{titulo}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-mute">{texto}</p>
        </div>
      </div>
    </div>
  );
}

function Cabecalho({
  numero,
  titulo,
  subtitulo,
}: {
  numero: number;
  titulo: string;
  subtitulo: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
        {numero}
      </div>
      <div>
        <h2 className="font-display text-xl leading-none">{titulo}</h2>
        <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-mute">{subtitulo}</p>
      </div>
    </div>
  );
}

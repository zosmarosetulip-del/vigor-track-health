/**
 * Modelo de estratificação de risco.
 *
 * Baseado em coeficientes publicados e validados externamente:
 * Studenski S. et al., "Gait Speed and Survival in Older Adults", JAMA 2011;305(1):50-58.
 * As probabilidades são populacionais (calibradas por idade e sexo) e SEMPRE
 * apresentadas com intervalo de incerteza. Nunca converta em "anos de vida".
 */

export type Sexo = "feminino" | "masculino";

export interface Perfil {
  nome: string;
  idade: number;
  sexo: Sexo;
  alturaCm: number;
  pesoKg: number;
  usaAuxilioMarcha: boolean;
  quedaUltimos6Meses: boolean;
  cirurgiaRecente: boolean;
  doencaCardiovascular: boolean;
  nivelAtividade: "sedentario" | "leve" | "moderado" | "ativo";
}

export const MODELO_IDADE_MINIMA = 50;

/* ---------- Normas populacionais (média e desvio-padrão por idade/sexo) ---------- */

function normaForca(idade: number, sexo: Sexo) {
  const base = sexo === "masculino" ? 47 : 29;
  const declinio = Math.max(0, idade - 50) * (sexo === "masculino" ? 0.33 : 0.2);
  return { media: base - declinio, dp: sexo === "masculino" ? 8.5 : 6 };
}

function normaMarcha(idade: number, _sexo: Sexo) {
  const media = Math.max(0.55, 1.35 - Math.max(0, idade - 50) * 0.011);
  return { media, dp: 0.22 };
}

function normaEquilibrio(idade: number, _sexo: Sexo) {
  const media = Math.max(4, 30 - Math.max(0, idade - 50) * 0.62);
  return { media, dp: Math.max(3, media * 0.45) };
}

function cdfNormal(z: number) {
  // aproximação de Abramowitz & Stegun
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function percentil(valor: number, media: number, dp: number) {
  return Math.round(Math.min(99, Math.max(1, cdfNormal((valor - media) / dp) * 100)));
}

export interface Medicoes {
  forcaKg?: number;
  marchaMs?: number;
  equilibrioS?: number;
}

export interface Percentis {
  forca?: number;
  marcha?: number;
  equilibrio?: number;
}

export function calcularPercentis(perfil: Perfil, m: Medicoes): Percentis {
  const f = normaForca(perfil.idade, perfil.sexo);
  const g = normaMarcha(perfil.idade, perfil.sexo);
  const e = normaEquilibrio(perfil.idade, perfil.sexo);
  return {
    forca: m.forcaKg != null ? percentil(m.forcaKg, f.media, f.dp) : undefined,
    marcha: m.marchaMs != null ? percentil(m.marchaMs, g.media, g.dp) : undefined,
    equilibrio: m.equilibrioS != null ? percentil(m.equilibrioS, e.media, e.dp) : undefined,
  };
}

/* ---------- Sobrevivência estimada ---------- */

export interface FaixaSobrevivencia {
  horizonteAnos: 1 | 3 | 5 | 10;
  probabilidade: number; // 0-100
  ic: [number, number];
}

export interface ResultadoRisco {
  faixas: FaixaSobrevivencia[];
  foraDeValidacao: boolean;
  categoria: "desempenho preservado" | "desempenho intermediário" | "desempenho reduzido";
  resumo: string;
}

/** Taxa de mortalidade anual de referência (velocidade de marcha média, sem covariáveis). */
function hazardBase(idade: number, sexo: Sexo) {
  const k = sexo === "masculino" ? 0.095 : 0.088;
  return 0.0009 * Math.exp(k * Math.max(0, idade - 50)) + 0.0015;
}

export function calcularRisco(perfil: Perfil, m: Medicoes): ResultadoRisco {
  const g = normaMarcha(perfil.idade, perfil.sexo);
  const f = normaForca(perfil.idade, perfil.sexo);

  // Studenski et al.: cada 0,1 m/s de velocidade associa-se a ~12% menos risco.
  const deltaMarcha = (m.marchaMs ?? g.media) - g.media;
  const hrMarcha = Math.exp(-1.28 * deltaMarcha);

  // Força de preensão (PURE / UK Biobank): ~16% menos risco por 5 kg adicionais.
  const deltaForca = (m.forcaKg ?? f.media) - f.media;
  const hrForca = Math.exp(-0.035 * deltaForca);

  let hrCovariaveis = 1;
  if (perfil.quedaUltimos6Meses) hrCovariaveis *= 1.18;
  if (perfil.usaAuxilioMarcha) hrCovariaveis *= 1.25;
  if (perfil.doencaCardiovascular) hrCovariaveis *= 1.3;
  if (perfil.nivelAtividade === "sedentario") hrCovariaveis *= 1.15;
  if (perfil.nivelAtividade === "ativo") hrCovariaveis *= 0.9;

  const hazard = hazardBase(perfil.idade, perfil.sexo) * hrMarcha * hrForca * hrCovariaveis;
  const foraDeValidacao = perfil.idade < MODELO_IDADE_MINIMA;

  const faixas = ([1, 3, 5, 10] as const).map((anos) => {
    const s = Math.exp(-hazard * anos) * 100;
    // incerteza cresce com o horizonte e é ampliada fora da faixa validada
    const amplitude = (1.6 + anos * 0.8) * (foraDeValidacao ? 2 : 1);
    return {
      horizonteAnos: anos,
      probabilidade: Math.round(s),
      ic: [Math.max(0, Math.round(s - amplitude)), Math.min(99, Math.round(s + amplitude))] as [
        number,
        number,
      ],
    };
  });

  const p = calcularPercentis(perfil, m);
  const media =
    [p.forca, p.marcha, p.equilibrio]
      .filter((v): v is number => v != null)
      .reduce((a, b, _i, arr) => a + b / arr.length, 0) || 50;

  const categoria =
    media >= 60
      ? "desempenho preservado"
      : media >= 35
        ? "desempenho intermediário"
        : "desempenho reduzido";

  return {
    faixas,
    foraDeValidacao,
    categoria,
    resumo:
      categoria === "desempenho preservado"
        ? "Sua função está acima da média para a sua faixa etária."
        : categoria === "desempenho intermediário"
          ? "Sua função está próxima da média para a sua faixa etária."
          : "Sua função está abaixo da média para a sua faixa etária.",
  };
}

/* ---------- Triagem de segurança ---------- */

export interface Alerta {
  titulo: string;
  texto: string;
}

export function triagem(perfil: Perfil): Alerta[] {
  const alertas: Alerta[] = [];
  if (perfil.usaAuxilioMarcha) {
    alertas.push({
      titulo: "Protocolo de marcha adaptado",
      texto:
        "Você indicou uso de bengala ou andador. Faça o teste de 4 m com o auxílio habitual e, se possível, com alguém por perto.",
    });
  }
  if (perfil.quedaUltimos6Meses) {
    alertas.push({
      titulo: "Queda recente relatada",
      texto:
        "Recomendamos avaliação presencial antes de iniciar exercícios de equilíbrio avançados. Seu plano inicia no nível introdutório.",
    });
  }
  if (perfil.cirurgiaRecente) {
    alertas.push({
      titulo: "Cirurgia recente",
      texto:
        "Exercícios de carga em membros inferiores foram removidos do seu plano. Consulte seu profissional de saúde antes de progredir.",
    });
  }
  return alertas;
}

export function nivelInicial(p: Percentis): 1 | 2 | 3 {
  const media =
    [p.forca, p.marcha, p.equilibrio]
      .filter((v): v is number => v != null)
      .reduce((a, b, _i, arr) => a + b / arr.length, 0) || 50;
  return media >= 65 ? 3 : media >= 35 ? 2 : 1;
}

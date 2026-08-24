import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Idioma = "pt" | "en";
const CHAVE_IDIOMA = "vitalidade.idioma";

const traducoes = {
  pt: {
    common: {
      brandTagline: "Longevidade Funcional",
      nav: {
        dashboard: "Painel",
        tests: "Testes",
        plan: "Plano",
        progress: "Evolução",
        profile: "Perfil",
      },
      language: "Idioma",
      pt: "PT",
      en: "EN",
      year: "ano",
      years: "anos",
      low: "Baixo",
      high: "Alto",
      percentile: "percentil",
      noMeasurement: "sem medição registrada",
      percentileRange: "º percentil da sua faixa",
      footer:
        "Vitalidade é uma ferramenta de bem-estar funcional. Não substitui avaliação clínica, não fornece diagnóstico e não estima anos de vida. As probabilidades derivam de modelo prognóstico publicado (Studenski et al., JAMA 2011) e variam conforme a população. Reavaliação recomendada a cada 4–6 semanas.",
      goProfile: "Ir para o perfil",
      start: "Iniciar",
      stop: "Parar",
      retry: "Refazer",
      attempt: "Tentativa",
      status: "Status",
      samples: "Amostras",
      peak: "Pico",
      female: "Feminino",
      male: "Masculino",
      right: "Direita",
      left: "Esquerda",
      hand: "Mão",
      activity: { sedentario: "Sedentário", leve: "Leve", moderado: "Moderado", ativo: "Ativo" },
    },
    risk: {
      preserved: "acima da média",
      intermediate: "na média",
      reduced: "abaixo da média",
      safetyNoteTitle: "Nota de segurança:",
      safetyNote:
        "este valor não é um diagnóstico nem uma contagem de anos de vida. Mantenha acompanhamento com seu profissional de saúde.",
      outsideValidation:
        "Seu perfil está fora da faixa etária em que o modelo foi validado (50 anos ou mais). A confiabilidade da estimativa é reduzida e o intervalo de incerteza foi ampliado.",
      gaitTitle: "Protocolo de marcha adaptado",
      gaitText:
        "Você indicou uso de bengala ou andador. Faça o teste de 4 m com o auxílio habitual e, se possível, com alguém por perto.",
      fallTitle: "Queda recente relatada",
      fallText:
        "Recomendamos avaliação presencial antes de iniciar exercícios de equilíbrio avançados. Seu plano inicia no nível introdutório.",
      surgeryTitle: "Cirurgia recente",
      surgeryText:
        "Exercícios de carga em membros inferiores foram removidos do seu plano. Consulte seu profissional de saúde antes de progredir.",
    },
    dashboard: {
      title: "Painel de risco funcional — Vitalidade",
      description:
        "Acompanhe força de preensão, velocidade de marcha e equilíbrio e veja sua estratificação de risco probabilística por idade e sexo.",
      ogDescription:
        "Estratificação de risco probabilística com força, marcha e equilíbrio, mais plano de exercícios adaptativo.",
      startHere: "Comece por aqui",
      hero: (
        <>
          Monitore sua <span className="italic text-brand">função</span>, não a sua idade.
        </>
      ),
      intro:
        "Em menos de 5 minutos você registra seu perfil e faz a primeira bateria de testes de força, marcha e equilíbrio. Nenhum resultado é um diagnóstico.",
      createProfile: "Criar meu perfil",
      relativeRisk: "Painel de risco relativo",
      firstTests: (
        <>
          Faça sua <span className="italic text-brand">primeira bateria</span> de testes.
        </>
      ),
      summaryPrefix: "Sua função está",
      summarySuffix: "para a sua faixa etária.",
      measuredDescription: (age: number, sex: string, date: string) =>
        `Estimativa baseada em modelo prognóstico calibrado por idade e sexo (${age} anos, ${sex}). É uma probabilidade populacional, não uma previsão individual. Última medição em ${date}.`,
      emptyDescription:
        "As probabilidades abaixo usam apenas os valores médios da sua faixa etária até que você registre suas medições.",
      nextTests: "Próximos testes",
      guidedBattery: "Bateria guiada",
      tests: [
        { n: 1, titulo: "Força de preensão", detalhe: "3 tentativas · maior valor usado" },
        { n: 2, titulo: "Velocidade de marcha", detalhe: "4 m · cronômetro do app" },
        { n: 3, titulo: "Equilíbrio", detalhe: "apoio unipodal · apoio próximo" },
      ],
      startBattery: "Iniciar bateria de testes",
      grip: "Força de preensão",
      gait: "Velocidade de marcha",
      balance: "Equilíbrio",
      singleLeg: "apoio unipodal",
      adaptivePlan: "Plano adaptativo",
      weekReady: "Sua semana de movimento está pronta",
      evaluations: (n: number) =>
        `${n} ${n === 1 ? "avaliação registrada" : "avaliações registradas"} · reavaliação sugerida em 4–6 semanas`,
      viewPlan: "Ver plano de exercícios",
    },
    profile: {
      title: "Perfil e triagem de segurança — Vitalidade",
      description:
        "Informe idade, sexo, histórico de quedas e condições relevantes para calibrar sua estratificação de risco e adaptar os testes.",
      ogDescription: "Onboarding em menos de 5 minutos com triagem de contraindicações.",
      eyebrow: "Perfil e triagem",
      heading: "Seus dados basais",
      intro:
        "Usamos estas informações para escolher o protocolo de teste adequado, ajustar a estratificação por covariáveis e sinalizar contraindicações antes de qualquer exercício.",
      name: "Nome",
      namePlaceholder: "Como quer ser chamado(a)",
      age: "Idade",
      sex: "Sexo (para calibração do modelo)",
      activity: "Nível de atividade física",
      height: "Altura (cm)",
      weight: "Peso (kg)",
      safety: "Triagem de segurança",
      aid: "Uso bengala, andador ou outro auxílio para caminhar",
      fall: "Sofri uma queda nos últimos 6 meses",
      surgery: "Passei por cirurgia recente (quadril, joelho, coluna)",
      cardio: "Tenho doença cardiovascular diagnosticada",
      underAge:
        "O modelo prognóstico foi validado para 50 anos ou mais. Abaixo dessa idade, as probabilidades serão exibidas com confiabilidade reduzida e intervalo ampliado.",
      save: "Salvar perfil",
      goTests: "Ir para os testes →",
    },
    plan: {
      title: "Plano funcional — Vitalidade",
      description:
        "Plano progressivo para força, marcha e equilíbrio, preparado para evoluir com resultados funcionais reais.",
      ogDescription:
        "Orientação inicial segura para acompanhar força, marcha e equilíbrio sem inventar resultados clínicos.",
      eyebrow: "PLANO FUNCIONAL",
      heading: (
        <>
          Seu plano de <span className="italic text-brand">evolução</span>
        </>
      ),
      intro:
        "Um plano progressivo baseado nos seus resultados de força, marcha e equilíbrio. O objetivo é melhorar sua função com segurança e acompanhar sua evolução ao longo do tempo.",
      areas: [
        {
          titulo: "FORÇA",
          descricao: "Exercícios progressivos para força de preensão e membros inferiores.",
          status: "Aguardando avaliação",
        },
        {
          titulo: "MARCHA",
          descricao: "Exercícios para melhorar velocidade, cadência e capacidade funcional.",
          status: "Aguardando avaliação",
        },
        {
          titulo: "EQUILÍBRIO",
          descricao: "Exercícios progressivos de estabilidade e equilíbrio.",
          status: "Aguardando avaliação",
        },
      ],
      reassessment: "Próxima reavaliação",
      reassessmentText:
        "Após completar os testes funcionais, o aplicativo poderá recomendar uma reavaliação em 4–6 semanas.",
      startAssessment: "Começar avaliação",
    },
    progress: {
      title: "Acompanhamento funcional — Vitalidade",
      description:
        "Acompanhe histórico e evolução funcional de força de preensão, velocidade da marcha e equilíbrio.",
      ogDescription:
        "Estrutura preparada para receber medições reais e comparar sua evolução funcional.",
      eyebrow: "ACOMPANHAMENTO",
      heading: (
        <>
          Veja sua <span className="italic text-brand">evolução funcional</span>
        </>
      ),
      intro:
        "Compare suas medições ao longo do tempo e acompanhe mudanças na força, marcha e equilíbrio.",
      areas: ["FORÇA DE PREENSÃO", "VELOCIDADE DA MARCHA", "EQUILÍBRIO"],
      ready: "Estrutura pronta para comparar medições reais em próximas versões.",
      empty: "Ainda não há medições",
      history: "Histórico de avaliações",
      noEvaluations:
        "Nenhuma avaliação registrada ainda. Complete sua primeira bateria de testes para começar a acompanhar sua evolução.",
      count: (n: number) =>
        `${n} avaliação${n === 1 ? "" : "ões"} registrada${n === 1 ? "" : "s"}. Os dados reais já estão disponíveis para futuras visualizações comparativas.`,
      first: "Fazer primeira avaliação",
    },
  },
  en: {
    common: {
      brandTagline: "Functional Longevity",
      nav: {
        dashboard: "Dashboard",
        tests: "Tests",
        plan: "Plan",
        progress: "Progress",
        profile: "Profile",
      },
      language: "Language",
      pt: "PT",
      en: "EN",
      year: "year",
      years: "years",
      low: "Low",
      high: "High",
      percentile: "percentile",
      noMeasurement: "no measurement recorded",
      percentileRange: "th percentile for your range",
      footer:
        "Vitalidade is a functional wellness tool. It does not replace clinical evaluation, provide diagnosis, or estimate years of life. Probabilities come from a published prognostic model (Studenski et al., JAMA 2011) and vary by population. Reassessment is recommended every 4–6 weeks.",
      goProfile: "Go to profile",
      start: "Start",
      stop: "Stop",
      retry: "Repeat",
      attempt: "Attempt",
      status: "Status",
      samples: "Samples",
      peak: "Peak",
      female: "Female",
      male: "Male",
      right: "Right",
      left: "Left",
      hand: "Hand",
      activity: { sedentario: "Sedentary", leve: "Light", moderado: "Moderate", ativo: "Active" },
    },
    risk: {
      preserved: "above average",
      intermediate: "average",
      reduced: "below average",
      safetyNoteTitle: "Safety note:",
      safetyNote:
        "this value is not a diagnosis or a count of years of life. Keep follow-up with your healthcare professional.",
      outsideValidation:
        "Your profile is outside the age range in which the model was validated (50 years or older). Estimate reliability is reduced and the uncertainty interval was widened.",
      gaitTitle: "Adapted gait protocol",
      gaitText:
        "You reported using a cane or walker. Complete the 4 m test with your usual aid and, if possible, with someone nearby.",
      fallTitle: "Recent fall reported",
      fallText:
        "We recommend an in-person evaluation before starting advanced balance exercises. Your plan starts at the introductory level.",
      surgeryTitle: "Recent surgery",
      surgeryText:
        "Lower-limb weight-bearing exercises were removed from your plan. Consult your healthcare professional before progressing.",
    },
    dashboard: {
      title: "Functional risk dashboard — Vitalidade",
      description:
        "Track grip strength, gait speed, and balance, and view your probabilistic risk stratification by age and sex.",
      ogDescription:
        "Probabilistic risk stratification with strength, gait, and balance, plus an adaptive exercise plan.",
      startHere: "Start here",
      hero: (
        <>
          Track your <span className="italic text-brand">function</span>, not your age.
        </>
      ),
      intro:
        "In under 5 minutes you can enter your profile and complete the first strength, gait, and balance test battery. No result is a diagnosis.",
      createProfile: "Create my profile",
      relativeRisk: "Relative risk dashboard",
      firstTests: (
        <>
          Complete your <span className="italic text-brand">first battery</span> of tests.
        </>
      ),
      summaryPrefix: "Your function is",
      summarySuffix: "for your age range.",
      measuredDescription: (age: number, sex: string, date: string) =>
        `Estimate based on a prognostic model calibrated by age and sex (${age} years, ${sex}). It is a population probability, not an individual prediction. Last measurement on ${date}.`,
      emptyDescription:
        "The probabilities below use only average values for your age range until you record your measurements.",
      nextTests: "Upcoming tests",
      guidedBattery: "Guided battery",
      tests: [
        { n: 1, titulo: "Grip strength", detalhe: "3 attempts · highest value used" },
        { n: 2, titulo: "Gait speed", detalhe: "4 m · app stopwatch" },
        { n: 3, titulo: "Balance", detalhe: "single-leg stance · nearby support" },
      ],
      startBattery: "Start test battery",
      grip: "Grip strength",
      gait: "Gait speed",
      balance: "Balance",
      singleLeg: "single-leg stance",
      adaptivePlan: "Adaptive plan",
      weekReady: "Your movement week is ready",
      evaluations: (n: number) =>
        `${n} ${n === 1 ? "evaluation recorded" : "evaluations recorded"} · reassessment suggested in 4–6 weeks`,
      viewPlan: "View exercise plan",
    },
    profile: {
      title: "Profile and safety screening — Vitalidade",
      description:
        "Enter age, sex, fall history, and relevant conditions to calibrate risk stratification and adapt tests.",
      ogDescription: "Onboarding in under 5 minutes with contraindication screening.",
      eyebrow: "Profile and screening",
      heading: "Your baseline data",
      intro:
        "We use this information to choose the appropriate test protocol, adjust stratification by covariates, and flag contraindications before any exercise.",
      name: "Name",
      namePlaceholder: "What should we call you?",
      age: "Age",
      sex: "Sex (for model calibration)",
      activity: "Physical activity level",
      height: "Height (cm)",
      weight: "Weight (kg)",
      safety: "Safety screening",
      aid: "I use a cane, walker, or another walking aid",
      fall: "I had a fall in the last 6 months",
      surgery: "I had recent surgery (hip, knee, spine)",
      cardio: "I have diagnosed cardiovascular disease",
      underAge:
        "The prognostic model was validated for ages 50 and older. Below this age, probabilities are shown with reduced reliability and a widened interval.",
      save: "Save profile",
      goTests: "Go to tests →",
    },
    plan: {
      title: "Functional plan — Vitalidade",
      description:
        "Progressive plan for strength, gait, and balance, ready to evolve with real functional results.",
      ogDescription:
        "Safe initial guidance to track strength, gait, and balance without inventing clinical results.",
      eyebrow: "FUNCTIONAL PLAN",
      heading: (
        <>
          Your <span className="italic text-brand">progress</span> plan
        </>
      ),
      intro:
        "A progressive plan based on your strength, gait, and balance results. The goal is to improve your function safely and track progress over time.",
      areas: [
        {
          titulo: "STRENGTH",
          descricao: "Progressive exercises for grip strength and lower limbs.",
          status: "Waiting for assessment",
        },
        {
          titulo: "GAIT",
          descricao: "Exercises to improve speed, cadence, and functional capacity.",
          status: "Waiting for assessment",
        },
        {
          titulo: "BALANCE",
          descricao: "Progressive stability and balance exercises.",
          status: "Waiting for assessment",
        },
      ],
      reassessment: "Next reassessment",
      reassessmentText:
        "After completing the functional tests, the app may recommend reassessment in 4–6 weeks.",
      startAssessment: "Start assessment",
    },
    progress: {
      title: "Functional tracking — Vitalidade",
      description:
        "Track history and functional progress for grip strength, gait speed, and balance.",
      ogDescription:
        "Structure ready to receive real measurements and compare functional progress.",
      eyebrow: "TRACKING",
      heading: (
        <>
          View your <span className="italic text-brand">functional progress</span>
        </>
      ),
      intro:
        "Compare your measurements over time and follow changes in strength, gait, and balance.",
      areas: ["GRIP STRENGTH", "GAIT SPEED", "BALANCE"],
      ready: "Structure ready to compare real measurements in future versions.",
      empty: "There are no measurements yet",
      history: "Assessment history",
      noEvaluations:
        "No assessment recorded yet. Complete your first test battery to start tracking your progress.",
      count: (n: number) =>
        `${n} ${n === 1 ? "assessment" : "assessments"} recorded. Real data is already available for future comparative views.`,
      first: "Complete first assessment",
    },
  },
} as const;

const I18nContext = createContext<{
  idioma: Idioma;
  setIdioma: (idioma: Idioma) => void;
  t: typeof traducoes.pt;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>("pt");
  useEffect(() => {
    const salvo = window.localStorage.getItem(CHAVE_IDIOMA);
    if (salvo === "pt" || salvo === "en") setIdiomaState(salvo);
  }, []);
  const setIdioma = (novo: Idioma) => {
    setIdiomaState(novo);
    if (typeof window !== "undefined") window.localStorage.setItem(CHAVE_IDIOMA, novo);
  };
  const value = useMemo(() => ({ idioma, setIdioma, t: traducoes[idioma] }), [idioma]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

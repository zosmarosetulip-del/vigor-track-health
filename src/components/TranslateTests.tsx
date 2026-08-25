import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const STATIC: Record<string, string> = {
  "Bateria guiada": "Guided battery",
  "Três medições, uma sessão": "Three measurements, one session",
  "Faça os testes com calçado habitual, em piso plano e sem obstáculos. Tenha uma parede ou cadeira ao alcance da mão. Interrompa em caso de tontura ou dor.":
    "Perform the tests in your usual footwear, on a flat surface with no obstacles. Keep a wall or chair within reach. Stop if you feel dizzy or experience pain.",
  "Smartphone como sensor funcional": "Smartphone as a functional sensor",
  "O Vitalidade começa com cronômetro e registro manual, mas o protocolo já prepara a evolução para acelerômetro e giroscópio no teste de marcha. Mantenha o telefone no bolso, cinto ou próximo à cintura para reduzir variação entre reavaliações.":
    "Vitalidade starts with a stopwatch and manual recording, while the protocol is already designed to evolve toward accelerometer and gyroscope support for the gait test. Keep the phone in a pocket, belt, or near your waist to reduce variation between reassessments.",
  "Crie seu perfil antes dos testes": "Create your profile before testing",
  "Precisamos de idade, sexo e triagem de segurança para escolher o protocolo correto.":
    "We need your age, sex, and safety screening information to choose the appropriate protocol.",
  "Ir para o perfil": "Go to profile",
  "Força de preensão": "Grip strength",
  "Inserção manual em kg": "Manual entry in kg",
  "Sentado, cotovelo a 90°, faça 3 tentativas com 30 segundos de descanso. Nenhum dinamômetro Bluetooth pareado — o registro manual não bloqueia o uso do app.":
    "While seated with your elbow at 90°, complete 3 attempts with 30 seconds of rest. No paired Bluetooth dynamometer is required — manual recording does not prevent you from using the app.",
  "Tentativa": "Attempt",
  "Mão": "Hand",
  "Direita": "Right",
  "Esquerda": "Left",
  "Maior valor ": "Highest value ",
  " kg — o maior valor é o utilizado no cálculo de risco, conforme prática clínica de referência.":
    " kg — the highest value is used for risk calculation, following reference clinical practice.",
  "Velocidade de marcha": "Gait speed",
  "Percurso de 4 metros": "4-metre course",
  "Agora": "Now",
  "Próximo passo": "Next step",
  "Longitudinal": "Longitudinal",
  "Cronômetro do app calcula velocidade = 4 m ÷ tempo e salva a média das tentativas.":
    "The app stopwatch calculates speed = 4 m ÷ time and saves the average across attempts.",
  "Acelerômetro e giroscópio podem detectar início, fim, passos, cadência e regularidade.":
    "The accelerometer and gyroscope can detect start, finish, steps, cadence, and regularity.",
  "HealthKit e Health Connect podem complementar a tendência diária de caminhada na fase 2.":
    "HealthKit and Health Connect can complement daily walking trends in phase 2.",
  "Refazer tentativas": "Repeat attempts",
  "As duas tentativas divergiram mais de 10%. Faça uma terceira tentativa para que a média seja confiável na comparação ao longo do tempo.":
    "The two attempts differed by more than 10%. Complete a third attempt so the average is more reliable for comparison over time.",
  "Velocidade média:": "Average speed:",
  "Sensores do smartphone": "Smartphone sensors",
  "Opcional no MVP: autorize movimento no celular, coloque o aparelho próximo à cintura e o Vitalidade registra acelerômetro/giroscópio junto com o cronômetro. A velocidade continua sendo calculada por 4 m ÷ tempo até validação clínica do algoritmo.":
    "Optional in the MVP: allow motion access, place the phone near your waist, and Vitalidade will record accelerometer/gyroscope data alongside the stopwatch. Speed continues to be calculated as 4 m ÷ time until the algorithm receives clinical validation.",
  "Autorizar sensores": "Allow sensors",
  "Status:": "Status:",
  "Amostras:": "Samples:",
  "Pico:": "Peak:",
  "Cadência exploratória:": "Exploratory cadence:",
  "passos/min.": "steps/min.",
  "GPS não é usado como medida principal neste teste curto: para 4 metros, sensores inerciais e um protocolo padronizado tendem a ser mais adequados do que localização externa.":
    "GPS is not used as the primary measure in this short test: for 4 metres, inertial sensors and a standardized protocol tend to be more suitable than external location data.",
  "Equilíbrio": "Balance",
  "Apoio unipodal cronometrado": "Timed single-leg stance",
  "Fique de pé perto de uma parede ou cadeira. Levante um pé do chão e mantenha o equilíbrio sem apoiar-se. Pare ao tocar o chão, apoiar-se ou completar 45 segundos.":
    "Stand near a wall or chair. Lift one foot off the floor and maintain your balance without support. Stop if your foot touches the floor, you need support, or you reach 45 seconds.",
  "Fase posterior": "Later phase",
  "Validação clínica": "Clinical validation",
  "Câmera com estimativa de pose pode acompanhar tronco, quadril, joelho e tornozelo.":
    "A camera with pose estimation may track the trunk, hip, knee, and ankle.",
  "A detecção corporal não substitui automaticamente uma medida prognóstica sem validação local.":
    "Body detection does not automatically replace a prognostic measure without local validation.",
  "Refazer": "Repeat",
  "Resultado:": "Result:",
  "Abaixo de 5 segundos — seu plano de equilíbrio começará pelo nível introdutório, sempre com apoio ao alcance.":
    "Below 5 seconds — your balance plan will start at the introductory level, always with support within reach.",
  "Registrado. Mantenha a reavaliação a cada 4–6 semanas.":
    "Recorded. Keep reassessing every 4–6 weeks.",
  "Salvar avaliação e recalcular risco": "Save assessment and recalculate risk",
  "Os dados ficam no seu dispositivo e o registro funciona offline.":
    "Your data stays on your device and recording works offline.",
  "Roadmap técnico": "Technical roadmap",
  "Tecnologias planejadas para o Vitalidade": "Planned technologies for Vitalidade",
  "Força": "Strength",
  "MVP com dinamômetro manual e digitação; Bluetooth fica para integração futura.":
    "MVP with a manual dynamometer and typed entry; Bluetooth is planned for future integration.",
  "Marcha 4 m": "4-metre gait",
  "MVP com cronômetro; sensores do telefone são a primeira evolução instrumental.":
    "MVP with a stopwatch; phone sensors are the first instrumental upgrade.",
  "Atividade diária": "Daily activity",
  "HealthKit no iPhone e Health Connect no Android entram como acompanhamento longitudinal.":
    "HealthKit on iPhone and Health Connect on Android will provide longitudinal tracking.",
  "GPS": "GPS",
  "Reservado para caminhadas externas maiores, não para o teste clínico curto de 4 metros.":
    "Reserved for longer outdoor walks, not for the short 4-metre clinical test.",
};

function translate(text: string): string {
  if (STATIC[text]) return STATIC[text];

  const attempt = text.match(/^Tentativa (\d+): (.+)s · (.+) m\/s$/);
  if (attempt) return `Attempt ${attempt[1]}: ${attempt[2]}s · ${attempt[3]} m/s`;

  const highest = text.match(/^Maior valor (.+) kg · média (.+) kg — (.+)$/);
  if (highest) return `Highest value ${highest[1]} kg · average ${highest[2]} kg — ${highest[3]}`;

  return text;
}

function translateNode(node: ReactNode): ReactNode {
  if (typeof node === "string") return translate(node);
  if (Array.isArray(node)) return node.map(translateNode);
  if (!isValidElement(node)) return node;

  return cloneElement(node, undefined, Children.map(node.props.children, translateNode));
}

export function TranslateTests({ children }: { children: ReactNode }) {
  return <>{translateNode(children)}</>;
}

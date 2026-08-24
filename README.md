# Vitality Compass

PRD — App de Estratificação de Risco e Longevidade Funcional (Força, Marcha e Equilíbrio)

Autor: Mauro Frank L. de Lima Data: 24/08/2026 Status: rascunho Versão: 0.1

0. Nota importante sobre o escopo (leia antes de aprovar)

O pedido original foi um app que "estime a expectativa de vida". O documento técnico usado como base (Força de Preensão e Velocidade da Marcha — Validade Prognóstica, 24/08/2026) é explícito sobre isso:

"A estimativa depende de um modelo prognóstico externo, validado para uma população específica, e deve ser apresentada como risco de sobrevivência — não como previsão individual determinística."

Por isso, este PRD não especifica uma feature de "quantos anos você vai viver". Em vez disso, especifica:

uma estratificação de risco probabilística (ex.: "sobrevivência estimada em 5 anos: 72%, IC 68–76%"), calibrada por idade e sexo, com força de preensão e velocidade da marcha como variáveis contínuas;

programas de exercício para melhorar força de preensão, velocidade de marcha e equilíbrio.

Isso é uma decisão de produto que recomendo fortemente manter — inclusive por risco legal/regulatório (alegação de saúde não validada) — mas está sinalizada aqui explicitamente porque diverge do pedido literal. Se o time de negócio insistir em comunicar "expectativa de vida" na interface, isso deve passar por revisão jurídica/regulatória antes do release (ver seção 6).

1. Objetivo

Problema: pessoas com 50+ anos não têm forma acessível de monitorar dois dos marcadores funcionais mais preditivos de mortalidade e incapacidade (força de preensão e velocidade da marcha), nem um caminho claro de exercícios para melhorá-los.

Por que agora: evidência robusta (Studenski et al., JAMA; estudo PURE; UK Biobank) liga essas medidas a sobrevivência, mas ela está presa em literatura científica — não em ferramentas de uso doméstico.

Resultado esperado: usuário consegue medir periodicamente força de preensão, velocidade de marcha e equilíbrio; visualizar sua posição de risco relativo (não absoluto/individual) frente a dados populacionais; seguir um plano de exercícios adaptativo; e observar evolução ao longo do tempo.

Prioridade de implantação:

Medição manual + estratificação de risco (MVP)

Programas de exercício (força de preensão, marcha, equilíbrio)

Acompanhamento longitudinal e ajuste adaptativo do plano

Integração com dispositivos (dinamômetro Bluetooth, sensores de smartphone para marcha)

Compartilhamento com profissional de saúde / exportação de relatório

2. Escopo

Está dentro do escopo:

Cadastro com idade, sexo, altura, peso, comorbidades relevantes (autorreportadas) e nível de atividade física.

Registro de força de preensão (inserção manual de valor obtido com dinamômetro, ou leitura via dispositivo Bluetooth compatível).

Teste de velocidade de marcha guiado (protocolo padronizado: distância fixa, zona de aceleração/desaceleração, cronômetro do próprio app ou sensores do smartphone).

Teste de equilíbrio (protocolos validados simples: apoio unipodal, teste de alcance funcional, ou similar).

Painel de estratificação de risco relativo, apresentado como faixas/percentis populacionais e probabilidade de sobrevivência em 1/3/5/10 anos com intervalo de incerteza — nunca como número fixo de anos de vida.

Biblioteca de exercícios com progressão para força de preensão, marcha (velocidade, cadência, passo) e equilíbrio.

Plano de exercícios personalizado e adaptativo, com lembretes.

Histórico e gráficos de evolução das três métricas.

Avisos de segurança (triagem de contraindicações antes de exercícios, ex.: histórico de quedas, cirurgia recente).

Textos de disclaimer clínico visíveis nos resultados (ver seção 6).

Está fora do escopo (nesta versão):

Diagnóstico médico ou substituição de avaliação clínica.

Estimativa determinística de "anos restantes de vida".

Validação clínica própria do modelo prognóstico (o app deve usar, no lançamento, coeficientes publicados e validados externamente — ver Dependências; não deve computar seu próprio modelo sem validação, conforme Fase 3 do documento de base).

Telemedicina, prescrição de medicamentos, integração com prontuário eletrônico.

Suporte a idiomas além de português/inglês na v1.

Dispositivos médicos certificados próprios (o app não fabrica hardware).

3. Features

Feature 1: Onboarding e perfil de risco basal

Descrição: usuário informa idade, sexo, comorbidades, uso de bengala/andador, histórico de quedas. O app usa isso para (a) selecionar o protocolo de teste adequado e (b) alertar sobre contraindicações antes de qualquer teste físico.

Objetivo: garantir segurança e que a estratificação de risco seja ajustada por covariáveis relevantes, não só pelas duas métricas centrais.

Caso(s) de teste:

Dado que o usuário reporta uso de andador, quando ele tenta iniciar o teste de marcha padrão, então o app oferece um protocolo adaptado ou orienta supervisão.

Dado que o usuário reporta queda nos últimos 6 meses, quando finaliza o onboarding, então recebe alerta recomendando avaliação presencial antes de iniciar exercícios de equilíbrio avançados.

Feature 2: Teste de força de preensão

Descrição: usuário insere manualmente o valor (kg) obtido com dinamômetro próprio, ou conecta um dispositivo Bluetooth suportado. App registra mão dominante, número de tentativas, e usa o maior valor (conforme prática clínica comum), sinalizando quando o protocolo diverge do padrão de referência.

Objetivo: capturar a métrica com o mínimo de viés de medição possível dado o hardware disponível ao usuário comum.

Caso(s) de teste:

Dado que o usuário insere 3 tentativas, quando salva o teste, então o app registra o maior valor e a média, e mostra qual foi usado no cálculo de risco.

Dado que nenhum dispositivo Bluetooth está pareado, quando o usuário tenta o teste, então o app oferece o fluxo de inserção manual sem bloquear o uso.

Feature 3: Teste de velocidade de marcha

Descrição: protocolo guiado por voz/tela: distância fixa (ex.: 4 metros com zona de aceleração/desaceleração), início parado, uso do cronômetro do app ou do acelerômetro do smartphone (quando no bolso/cinto) para estimar tempo e velocidade.

Objetivo: padronizar a coleta o suficiente para permitir comparação longitudinal confiável no mesmo usuário, mesmo sem tapete instrumentado.

Caso(s) de teste:

Dado que o usuário completa o teste duas vezes na mesma sessão, quando os resultados divergem mais que um limiar predefinido, então o app solicita uma terceira tentativa e informa o usuário do porquê.

Dado que o smartphone não tem sensores confiáveis disponíveis, quando o usuário inicia o teste, então o app usa cronômetro manual como fallback.

Feature 4: Teste de equilíbrio

Descrição: protocolos simples e seguros para uso doméstico (ex.: apoio unipodal cronometrado, teste de alcance funcional), com instruções em vídeo e aviso para ter apoio próximo (parede/cadeira).

Objetivo: adicionar uma terceira dimensão funcional (equilíbrio) associada a risco de queda, complementando força e marcha.

Caso(s) de teste:

Dado que o usuário não consegue completar 5 segundos de apoio unipodal, quando finaliza o teste, então o app classifica o resultado e sugere iniciar pelo nível introdutório do programa de equilíbrio.

Feature 5: Painel de estratificação de risco

Descrição: tela de resultado que compara os valores do usuário a distribuições populacionais por idade/sexo, exibindo: (a) percentil relativo; (b) probabilidade de sobrevivência em 1/3/5/10 anos com intervalo de confiança, baseada em modelo prognóstico publicado (ex.: coeficientes derivados de Studenski et al.); (c) evolução histórica das métricas.

Objetivo: comunicar risco de forma estatisticamente honesta, sem prometer previsão individual exata.

Caso(s) de teste:

Dado que o usuário visualiza seu resultado, quando abre a tela de risco, então o app nunca exibe um número fixo de "anos restantes de vida", apenas probabilidades com intervalo.

Dado que os dados do usuário estão fora da faixa etária/população em que o modelo foi validado (ex.: <50 anos), quando o app calcula o risco, então exibe aviso explícito de que a estimativa tem confiabilidade reduzida para esse perfil.

Feature 6: Programas de exercício (força, marcha, equilíbrio)

Descrição: biblioteca de exercícios progressivos por categoria, com vídeos/ilustrações, séries/repetições, e critérios de progressão de nível baseados em testes de reavaliação periódica.

Objetivo: oferecer caminho de ação prático a partir do resultado do teste, não apenas diagnóstico.

Caso(s) de teste:

Dado que o usuário está no nível "baixo desempenho físico" de marcha, quando acessa o plano, então recebe um programa introdutório com progressão gradual e reavaliação agendada em 4–6 semanas.

Dado que o usuário reportou contraindicação (ex.: cirurgia recente de quadril), quando o app monta o plano, então exclui exercícios incompatíveis e sugere consulta a profissional.

Feature 7: Acompanhamento longitudinal

Descrição: histórico de todos os testes, gráficos de tendência, e recálculo do painel de risco a cada nova medição.

Objetivo: permitir ao usuário ver progresso real e reforçar adesão ao programa de exercícios.

Caso(s) de teste:

Dado que o usuário tem 3+ medições ao longo de 6 meses, quando acessa "evolução", então vê gráfico de tendência de força, velocidade e equilíbrio, com data de cada medição.

Feature 8: Exportação / compartilhamento com profissional de saúde

Descrição: geração de relatório em PDF com histórico de medições e explicação metodológica, para levar a consulta médica/fisioterapêutica.

Objetivo: transformar o app em ferramenta complementar ao cuidado profissional, não substituto.

Caso(s) de teste:

Dado que o usuário solicita exportação, quando o PDF é gerado, então inclui data de cada teste, protocolo usado, e disclaimer de que não é diagnóstico.

4. Fluxo de UX & Notas de Design

Fluxo do usuário: Onboarding (dados + triagem de segurança) → Bateria de testes (força → marcha → equilíbrio) → Painel de risco relativo → Plano de exercícios recomendado → Reavaliação periódica (notificação push) → Evolução/relatório.

Integrações: notificações push para lembretes de exercício e reavaliação; integração opcional com Apple Health / Google Fit para nível de atividade física; integração Bluetooth com dinamômetros compatíveis (fase posterior).

Notas gerais de design: tom acolhedor e não alarmista — o risco deve ser comunicado como informação acionável, não como sentença. Evitar cores/ícones que remetam a "contagem regressiva" ou expectativa de vida (ex.: nada de relógios, ampulhetas). Priorizar linguagem de "estou melhorando minha função" em vez de "estou monitorando minha morte". Wireframes detalhados ficam em documento de design à parte.

5. Requerimentos Sistêmicos

Plataformas suportadas: iOS (13+), Android (10+), Web responsivo (navegadores modernos).

Requisitos técnicos mínimos: acelerômetro/giroscópio para teste de marcha via smartphone (opcional, com fallback manual); conexão Bluetooth Low Energy para dispositivos externos (opcional); conexão à internet para sincronização e atualização de modelos de risco (uso offline básico deve ser possível para registrar testes).

6. Premissas, Restrições e Dependências

Premissas:

Usuários terão acesso a pelo menos um método de medição de força de preensão (dinamômetro próprio, emprestado, ou visita a farmácia/clínica que ofereça o teste) — o app não fabrica hardware na v1.

A maioria dos usuários fará os testes em ambiente doméstico sem supervisão profissional direta.

Conectividade intermitente é aceitável para sincronização, não para o uso básico do app.

Restrições:

O app não pode, em nenhuma tela, copy ou notificação, apresentar "expectativa de vida" como número determinístico de anos. Toda comunicação de risco deve ser probabilística, com intervalo de incerteza, e citar a limitação populacional do modelo usado.

O app deve usar, no lançamento, um modelo prognóstico já publicado e validado externamente (não um modelo próprio não validado) — conforme a distinção do documento-base entre "validação do aparelho", "validação prognóstica" e "utilidade clínica". Um modelo próprio só pode substituir o modelo de referência após passar por validação equivalente à Fase 3 descrita no documento técnico (coorte prognóstica com eventos suficientes, calibração testada).

Toda claim de saúde na interface deve passar por revisão jurídica/regulatória antes do release (possível enquadramento como software de bem-estar vs. dispositivo médico, dependendo da jurisdição).

Dependências:

Licenciamento ou uso legítimo de coeficientes/modelos prognósticos publicados (ex.: dados agregados de Studenski et al. 2011, JAMA) para o cálculo de probabilidade de sobrevivência.

Validação de equivalência de qualquer dispositivo de terceiros (dinamômetro Bluetooth, sensores de smartphone) contra dispositivo de referência antes de ser oferecido como "compatível" — ICC, Bland-Altman, conforme metodologia do documento-base.

Conteúdo de exercícios revisado por fisioterapeuta ou profissional de educação física licenciado.

7. Critérios de Release

Área Critério Classificação Funcionalidade Testes de força, marcha e equilíbrio funcionais com inserção manual (mínimo para MVP) crítico Funcionalidade Painel de risco probabilístico calibrado por idade/sexo, sem número fixo de "anos de vida" crítico Funcionalidade Biblioteca de exercícios com progressão por nível crítico Funcionalidade Integração Bluetooth com dispositivos externos desejável (fase 2) Usabilidade Onboarding completável em menos de 5 minutos importante Usabilidade Protocolo de teste de marcha claro o suficiente para conclusão sem erro em >90% das tentativas em teste de usabilidade importante Confiabilidade App funciona offline para registro de testes, sincronizando depois importante Confiabilidade Triagem de contraindicações bloqueia/adapta exercícios de risco antes de exibir plano crítico Desempenho Cálculo do painel de risco exibido em até 2 segundos após teste importante Portabilidade & Manutenção Modelo de risco atualizável remotamente sem exigir atualização do app nas lojas desejável Legal/Regulatório Revisão jurídica de todas as claims de saúde antes do lançamento crítico

8. Histórico de Revisão

Data Versão Autor Alterações 24/08/2026 0.1 [preencher] Versão inicial, escopo ajustado de "expectativa de vida" para "estratificação de risco probabilística" com base no documento técnico de referência

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vigor-track-health.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b9c7d00e-5022-4321-8254-b106fcd06ce1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

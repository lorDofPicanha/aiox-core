# Conclave Ciclo 2 — Parecer Rafael Calvo (Wellbeing / Ética)

**Persona:** rafael-calvo (Positive Computing, METUX, SDT, Affective Computing)
**Escopo:** Produto completo frontend Anipis — verificação dos meus pontos do Ciclo 1
**Nota Ciclo 1:** 7,0 · **Nota Ciclo 2:** **8,7**
**Evidência:** `build-qa/faseB-voce-820.png`, `c2-hoje-light-820.png`, `c2-hoje-dark-820.png`, `faseB-onboarding-820.png`, `faseB-diario-820.png`

---

## 1. VERIFICAÇÃO DOS PONTOS DO CICLO 1

No Ciclo 1 dei 7,0 e meu ponto nº1 era duplo: (a) a **rede de crise era um fio único e truncável** — um único link de texto no header, fácil de não ver e fácil de quebrar; e (b) **a autonomia do Art. 18 (exportar/apagar) simplesmente não existia na interface** — a pessoa não tinha as mãos no próprio dado. Verifiquei ambos contra o build.

### 1.1 Rede de crise redundante? — **RESOLVIDO (com 1 ressalva menor)**

A pessoa agora tem **dois caminhos independentes** para a crise, não mais um fio único:

- **Fio 1 — header persistente.** "precisa de ajuda agora?" aparece em TODA tela (Hoje light/dark, Diário, Você) agora **com ícone de salva-vidas + rótulo, em vermelho-terra**. Isso resolve a minha objeção principal de Ciclo 1: deixou de ser texto cinza camuflado e virou um signifier inconfundível. Evidência: `c2-hoje-light-820.png` e `c2-hoje-dark-820.png` mostram o ícone vermelho à esquerda do rótulo no canto superior direito; persiste no tema escuro com contraste preservado.
- **Fio 2 — "2ª via" persistente em Você → Recursos de crise.** `faseB-voce-820.png` mostra uma seção aberta com **CVV 188, SAMU 192 e CAPS**, com botões de ação reais: "Ligar CVV 188 — 24h" (botão sólido, alto contraste) e "Ligar SAMU 192 — emergência" (botão outline). O CAPS vem com explicação ("Centro de Atenção Psicossocial: atendimento gratuito pelo SUS"). Isso é exatamente a **redundância** que pedi: se o header falhar, quebrar, ou a pessoa não o reconhecer, há um segundo nó da rede acessível de forma estável a partir da conta.

Do ponto de vista de positive computing isto é a diferença entre **uma rede com um único nó (frágil)** e **uma rede com redundância (resiliente)**. A regra do meu domínio é clara: pathways de crise nunca podem depender de um único elemento de UI, e jamais "buried in a menu, behind three taps". Agora temos dois caminhos, ambos a no máximo um toque do estado atual da pessoa.

**Ressalva (não bloqueante):** o header leva "precisa de ajuda agora?" a um destino que não vi nesta leva de PNGs — preciso confirmar que ele abre a mesma 2ª via (CVV/SAMU/CAPS com botões de discagem) e não uma tela intermediária com fricção. Se o header e o Você convergirem para o mesmo painel acionável, a redundância está completa. Se o header abrir algo mais leve, ainda assim a 2ª via do Você cobre a falha — por isso classifico RESOLVIDO, não PARCIAL.

### 1.2 Autonomia export/delete nas mãos da pessoa? — **RESOLVIDO**

O "Você" foi construído e entrega a autonomia do Art. 18 de forma explícita e digna:

- **Exportar meus dados** — "Uma cópia completa em JSON (LGPD Art. 18)". A pessoa tem direito de **levar o próprio dado embora**. Em SDT isto é autonomia pura: o dado emocional é dela, e ela exerce controle real sobre ele.
- **Apagar minha conta** — "Anonimizada na hora, excluída após 30 dias (Art. 18)". Esse texto faz **duas** coisas que aprovo fortemente: (1) dá controle (apagar é um direito acessível, não um e-mail para o suporte), e (2) é **honesto sobre o mecanismo** — "anonimizada na hora" é o que de fato protege a pessoa imediatamente, e "excluída após 30 dias" não esconde a janela de retenção. Transparência como segurança, não letra miúda.
- **Consentimentos gerenciáveis** — "Gerencie o que a Anipis pode guardar e processar." Consentimento que pode ser **revogado** é a marca de autonomia real. "Revogar é tão fácil quanto consentir" (texto do onboarding) é literalmente a frase que eu escreveria.

Comparado ao Ciclo 1, onde isto **não existia na interface**, a virada é categórica. A pessoa deixou de ser objeto de uma política de privacidade e passou a ser sujeito com mãos no painel de controle.

### 1.3 Crise inconfundível? — **RESOLVIDO**

Três sinais convergentes tornam a crise inconfundível sem alarmar quem está bem:

1. **Ícone + rótulo + vermelho-terra** no header (signifier explícito, não mais link nu).
2. **Vermelho usado com parcimônia** — só na crise. No estado "Bem" (`c2-hoje-light`), o vermelho aparece exclusivamente no link de ajuda; o resto da tela é creme/verde calmo. Isso é affect-aware design correto: a cor de alarme não está poluindo o ambiente de quem chegou tranquilo, mas está reservada e reconhecível para quem precisa.
3. **Tijolo / alvo de 44px** — o alvo de toque atende ao mínimo acessível, o que importa para alguém com tremor, pressa ou sob distresse (motricidade fina degrada sob crise — é determinante de segurança, não detalhe).

Sobre o **humor como convite, não carimbo** (`c2-hoje-light`): o chip "Bem" vem com "Só um convite — toque se quiser revisar como você está." Isto resolve um risco de autonomia que eu sempre sinalizo: o registro de humor **não pode ser uma cobrança**. Transformá-lo em convite opcional ("toque se quiser") preserva autonomia e evita o anti-pattern de auto-monitoramento compulsório que pode amplificar ruminação em populações vulneráveis. Aprovado.

| Ponto do Ciclo 1 | Status Ciclo 2 | Evidência |
|---|---|---|
| Rede de crise = fio único truncável | **RESOLVIDO** | Header persistente c/ ícone+rótulo+vermelho (todas telas) + 2ª via CVV/SAMU/CAPS com botões em Você |
| Export/delete (autonomia Art. 18) inexistentes | **RESOLVIDO** | "Exportar meus dados" (JSON) + "Apagar minha conta" (anonimiza já / exclui 30d) + Consentimentos gerenciáveis |
| Crise não inconfundível | **RESOLVIDO** | Ícone salva-vidas + vermelho reservado + 44px; humor vira convite não-carimbo |

**Bônus verificado — onboarding (`faseB-onboarding-820.png`):** consentimento em camadas ("O que ela guarda / Sua privacidade / Seu controle") com export/apagar **antecipados** já na entrada, 4 toggles granulares (dados de saúde, processamento por IA OpenAI nomeada, política+termos, 18+) e "Ler o texto completo". Isto é consentimento informado de verdade — a pessoa sabe que a IA é a OpenAI antes de escrever a primeira palavra. Preventive design feito certo.

---

## 2. PROBLEMAS RESIDUAIS (éticos / wellbeing)

### 2.1 Dependência da companheira — INTOCADO (e é o residual mais sério)

Meu juízo: **não bloqueia o 10 visual deste ciclo; é trabalho de Fase C.** Explico o porquê e o que vigiar.

A tela "Hoje" (`c2-hoje-light`) tem uma companheira calorosa, empática, que valida ("Sinto muito que tenha sido assim") e abre ("O que mais está pesando no seu pensamento agora?"). É boa terapia conversacional de superfície — e é exatamente aí que mora o risco que pesei no Ciclo 1: **relatedness simulada pode deslocar relatedness real.** A companheira que está sempre disponível, sempre acolhedora, sem atrito, pode se tornar o caminho de menor resistência e atrofiar a busca por vínculo humano e por acompanhamento profissional. Em METUX isto é o caso clássico de uma tecnologia que **apoia autonomia/relatedness na esfera da interface (Sphere 2) enquanto pode minar relatedness na esfera da vida (Sphere 5).**

O que já mitiga (e por isso não bloqueia agora):
- O disclaimer **"A Anipis acompanha, não substitui acompanhamento profissional"** aparece no rodapé de Hoje, Você e na seção de crise. Bom — mas é passivo.
- O **"Profissional vinculado"** em Você ("Conecte sua conta a um profissional de saúde mental") é uma ponte real para o humano. Excelente sinal de intenção.

O que falta (Fase C, não bloqueia o visual):
- A ponte para o profissional e o lembrete de "isto não substitui humano" são hoje **estáticos**. Dependência se mede em **padrão temporal**, não em uma sessão. Recomendo (Fase C) um sinal **affect-aware e gentil** que, diante de uso intenso e prolongado, convide ativamente — sem culpa, sem streak invertido — para o profissional vinculado ou para contato humano. Algo como "Você tem vindo bastante aqui — quer que eu te ajude a falar com seu profissional?" Isto é *active* design para relatedness na esfera da vida.
- Cuidado para que o convite NUNCA vire fricção punitiva ou "limite de uso" tipo screen-time policialesco. O tom Anipis (convite, não carimbo) já é o tom certo — basta estendê-lo a esse caso.

### 2.2 Botões "Ligar" e o limite do mock

`faseB-voce` mostra botões "Ligar CVV 188" / "Ligar SAMU 192". Em produto vivo, num momento de crise, esses botões **precisam disparar `tel:` de fato** (e idealmente confirmar com um micro-passo para evitar discagem acidental, sem adicionar fricção que atrase quem precisa). Não dá para verificar isso por PNG — fica como item de QA funcional obrigatório antes do beta. Não é falha de design; é validação de implementação.

### 2.3 CAPS sem ação direta — residual menor

CVV e SAMU têm botão; CAPS é só texto ("procure a unidade mais próxima na sua cidade"). Compreensível (CAPS é geolocalizado e não tem número único), mas para alguém em distresse, "procure a unidade mais próxima" é trabalho cognitivo que a pessoa pode não conseguir fazer. Sugestão Fase C: link para o localizador de CAPS / mapa. Não bloqueia.

### 2.4 Acessibilidade do disclaimer e do chip de humor — verificar contraste

O rodapé "não substitui acompanhamento profissional" e o subtítulo do chip de humor aparecem em cinza claro sobre creme. Mensagens de **segurança** (o disclaimer) não podem ficar em contraste de segunda classe. Pedir verificação WCAG AA especificamente nesses dois textos. Provavelmente passa, mas é exatamente o tipo de texto que não pode falhar.

---

## 3. O QUE BLOQUEIA O 10/10 (pela minha lente)

Nenhum desses bloqueia o beta; bloqueiam o **10 ético**:

1. **Confirmar a convergência do header de crise.** O fio 1 (header) precisa provadamente abrir a mesma 2ª via acionável do fio 2 (Você). Verificar e, se necessário, alinhar. (Sai de "RESOLVIDO com ressalva" para "RESOLVIDO pleno".)
2. **Botões `tel:` funcionais e à prova de toque acidental** nos recursos de crise (QA funcional). Crise é o único lugar onde "quase funciona" é falha total.
3. **Tratar a dependência da companheira como requisito, não como acaso (Fase C).** Um convite affect-aware, gentil e não-punitivo ao profissional vinculado diante de uso intenso/prolongado. Isto é o que separa um companion bem-intencionado de um companion *wellbeing-supportive by design* na esfera da vida.
4. **Contraste AA garantido nos textos de segurança** (disclaimer + chip de humor) e CAPS com localizador.

Resolvidos #1 e #2 (pré-beta) e endereçado #3 com um plano concreto de Fase C, eu assino o 10.

---

## 4. NOTA REVISADA

# **8,7 / 10** (era 7,0)

**Por que subiu 1,7:** os dois buracos estruturais do Ciclo 1 foram fechados de forma exemplar — a rede de crise virou redundante e inconfundível, e a autonomia do Art. 18 (exportar/apagar/revogar) está literalmente nas mãos da pessoa, com texto honesto sobre os mecanismos. O onboarding em camadas e o humor-como-convite são positive computing de manual.

**Por que não é 10 ainda:** o risco de **dependência da companheira na esfera da vida (METUX Sphere 5) segue intocado** — é o último determinante de wellbeing não endereçado, e é o mais difícil porque vai contra o incentivo de engajamento. Não bloqueia o lançamento nem o "10 visual", mas é Fase C inadiável. Some-se a isso a verificação funcional dos botões de crise e do contraste dos textos de segurança.

Este produto, do meu ponto de vista, **passa de "tecnologia que não machuca" (Ciclo 1, preventive incompleto) para "tecnologia que cuida com autonomia" (Ciclo 2, active sólido)**. O 10 chega quando ele também cuidar de não se tornar indispensável demais.

-- Calvo. Designing technology that helps people thrive. 🌿

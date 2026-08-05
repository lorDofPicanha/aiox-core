---
name: talos-copy-v2-pivot
description: Site Talos/AIOX — copy reescrita em 28/07/2026 porque a pesquisa refutou o eixo original; mecanismo único é contratual, não tecnológico
metadata:
  type: project
---

O site de serviços do founder (pasta `docs/projects/aiox-site/`, app `apps/talos/`) teve a copy inteira reescrita em 2026-07-28. Entrega em `05-build/squad/COPY-V2.md`.

**Fato central:** o eixo antigo ("trabalho repetitivo") era dor **tolerada** e usava vocabulário de frequência zero. O eixo novo é **cliente que chega no WhatsApp e some** — única formulação em que a dor que ele nomeia (falta de cliente, 33%) e a dor que a Talos resolve (atendimento repetido) são a mesma frase.

**Achado estratégico que vale mais que o H1:** a sofisticação de mercado é **assimétrica**. Ele é quase virgem quanto à *solução* (automação: 3 ocorrências em 3.320 comentários) e **exausto/queimado quanto ao *fornecedor*** — os 4 padrões de falha medidos são todos comerciais (prometeram o que não entregava · quem construiu nunca operou · preço subiu depois · sumiram na implantação). Logo o **mecanismo único é contratual**: escopo por escrito antes de pagar · preço não muda no meio · manutenção no combinado · vê rodando antes de aprovar.

**Arco de preço (ordem do founder):** *"se eu só falar o preço ela não fecha; se eu construir ganho, vira investimento."* Nenhuma menção a valor antes da §5 (o demo, onde o número de horas é informado pelo próprio visitante). Zero preço na página.

**Why:** o founder rejeitou o site inteiro em 27/Jul ("nada funcionou") e não tem cliente nenhum — zero case, zero depoimento, zero logo, zero número inventado.

**How to apply:** antes de mexer em qualquer `.tsx` de `apps/talos/components/`, ler `COPY-V2.md`. Bloqueios que ainda impedem publicação: (a) `lib/mapear.ts` está quebrado — dicionário em 3ª pessoa, motor não lê 1ª pessoa, e ele é a única prova do site; (b) `lib/perfil.ts` vazio; (c) setor-âncora (comércio vs indústria) e porte-alvo (ME vs EPP) não decididos — o primeiro troca o H1 inteiro.

Relacionado: [[copy-pme-br-lexico-medido]]

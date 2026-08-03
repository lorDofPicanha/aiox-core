# Leanware → Talos — decomposição da referência

**Data da captura:** 2026-07-28  
**Referência:** `https://leanware.co/`  
**Captura persistida:** `02-references/inputs/leanware/`

## O que foi verificado

- Home com 9.531 px no probe inicial; a captura persistida mediu 7.764 px.
- 31 seções/nós estruturais identificados no protocolo de captura.
- 45 imagens carregadas.
- 105 KB de CSS inline e 0 KB de CSS externo.
- O teste determinístico classificou a página como **JS-driven / não forkável**.
- Desktop e mobile foram capturados em `pages/home/screens/`.

A tentativa de capturar páginas internas parou ao tratar um arquivo `.woff2` como página. A home,
os assets visuais utilizados nela, as fontes e os screenshots foram preservados antes da falha.
Isso é suficiente para decompor a arquitetura da página sem copiar a implementação.

## O que a Talos aproveita

1. **Hero em duas colunas:** promessa à esquerda, demonstração operacional à direita.
2. **Oferta em quatro formas:** cards claros que ajudam o cliente a reconhecer por onde começar.
3. **Três diferenciais operacionais:** a explicação de por que contratar vem antes de comparar preço.
4. **Tabela de comparação:** transforma diferenças abstratas em critérios verificáveis.
5. **Trabalho real:** projetos e sistemas concretos, sem números de resultado que não estejam documentados.
6. **FAQ e CTA consultiva:** remove objeções antes da conversa e pede o problema, não uma solução pronta.

## O que não é copiado

- marca, verde, logotipo, textos, ilustrações, logos de clientes e cases da Leanware;
- componentes ou código do site;
- métricas, avaliações ou provas sociais;
- oferta comercial e forma de cobrança da empresa de referência.

## Tradução para a identidade Talos

| Leanware | Talos |
|---|---|
| preto + verde | nogueira + bronze |
| AI engineering company | automação de processos para empresas brasileiras |
| chat no hero | workflow executando no hero |
| quatro serviços de engenharia | site, automação, diagnóstico e sistemas com agentes |
| clientes e Clutch | sistemas reais do ecossistema + processo transparente |
| cases com resultados | projetos construídos, explicitamente sem alegar resultado comercial |
| milestones | escopo fechado + marcos visíveis |

## Artefato para aprovação

`05-build/mockup/talos-leanware-direction.html`

Screenshots de revisão:

- `05-build/mockup/talos-leanware-shots/build-1440-00.png` a `build-1440-07.png`
- `05-build/mockup/talos-leanware-shots/build-375-00.png` a `build-375-12.png`

O mockup é estático e não altera `apps/talos/`. O gate F4 continua bloqueado até existir
`05-build/mockup/APROVADO.md` com o aval explícito do founder.

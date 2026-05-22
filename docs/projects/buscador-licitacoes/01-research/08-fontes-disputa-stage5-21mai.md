# Pesquisa — Fontes de disputa (BLL/BNC/SISLOG) + Lance Fácil + decisão Stage 5 — 21/Mai/2026

**Para:** D3 (build-vs-integrate Stage 5) + adapters X1. **Caveat:** plataformas de nicho, docs públicas escassas; ToS completos não legíveis por fetch. Incertezas sinalizadas. Não é aconselhamento jurídico.

## 🔑 Achado estrutural (orienta tudo)
Existem **duas camadas distintas**, e não são o mesmo produto:
1. **Metadados publicados (editais, atas, contratos):** padronizada e consultável — **todas sincronizam ao PNCP** (API pública, sem auth). Resolve o Stage 1 (descoberta/monitor) de forma limpa e legal. **Não scrapear BLL/BNC/SISLOG para isso** — o PNCP dá o mesmo dado, sancionado.
2. **Sessão ao vivo (Stage 5 — disputa: lances, ranking, chat do pregoeiro, auto-bid):** acontece **inteiramente dentro da sessão autenticada de cada plataforma**. **NÃO é exposta por nenhuma API** (nem PNCP, nem bidder-side). Quem faz isso hoje (Lance Fácil/LanceBot) **dirige a UI autenticada com a credencial do próprio licitante** (Playwright/Selenium).

## Por plataforma
| Fonte | API de consulta? | Sync PNCP | Auth do licitante | ToS sobre automação |
|---|---|---|---|---|
| **BLL** | Não (bidder/sessão); web + PNCP | ✅ tempo real | email+senha + **e-CNPJ A1/A3 p/ lançar** | **Cinza** — senha "pessoal e intransferível"; sem proibição expressa de robô |
| **BNC** | "API" anunciada, mas p/ ERP/órgão (não sessão). **Tem feed de e-mail de editais** (até 5 segmentos) | ✅ | termo de adesão + cert | **Cinza/Desconhecido** |
| **SISLOG (GO)** | Não (só painel web read-only `/PanelAquisicao`) | ✅ (Lei 14.133) | **ID Goiás / gov.br / cert** (forte) | **Desconhecido** (sistema gov) — **maior risco** |
| **Lance Fácil / robôs** | n/a (consome as plataformas) | n/a | dirige o login/cert do usuário | **Cinza** — isonomia contestada |

## Lance Fácil (e similares)
- **Faz exatamente o Stage 5:** robô de lances (auto-bid ms, desempate automático), **monitoramento de chat/sessão**, alertas de edital — em ComprasNet, **BLL, BNC, PCP**, Licitanet, Licitações-e, Compras BR, etc.
- **Integração = automação de browser com a credencial do usuário, NÃO API nem parceria.** Análogo open-source: **LanceBot** (Python + Playwright, loga com usuário/senha ou certificado A1/A3). Lance Fácil é SaaS de browser + app desktop (trial 7 dias).
- **Modelo de parceria/OEM:** nenhum público. É produto p/ licitante final, não plataforma de integração. (Confirmar só por contato comercial.)
- **Preço:** não público (modular por CNPJ × portal × módulos).

## 🟢 Decisão Stage 5 (D3) — recomendação
**Dividir por camada:**
- **Descoberta/monitor (Stage 1): INTEGRAR PNCP.** Único caminho documentado, sem auth, sincronizado, legal. Não scrapear as bolsas para descobrir.
- **Sessão ao vivo (Stage 5): BUILD** — automação de sessão **com escopo de credencial, operada pela própria cliente** (Playwright, sob a identidade/consentimento dela). É o **componente de maior risco**. Razões:
  1. **Não existe API** de sessão em nenhuma fonte; PNCP só recebe o resultado pós-sessão.
  2. **Integrar com Lance Fácil não é opção real** (SaaS fechado, sem API/parceiro) — seria revender, não integrar. Vale 1 ligação comercial p/ confirmar OEM antes de descartar, mas assumir "build".
  3. **Postura ToS:** manter como ferramenta que **a cliente opera com a própria credencial/cert** (mesma zona "cinza-mas-não-proibida" do Lance Fácil). A cláusula "senha pessoal e intransferível" torna arriscado **nós** operarmos o login. **Priorizar BLL/BNC; SISLOG é o alvo mais arriscado (auth gov) → menor prioridade.**
  4. **Revisão jurídica** sobre isonomia + transferibilidade de credencial antes do launch.

## Implicações
- **Stage 5 precisa de:** vault de credenciais (X3) + e-CNPJ A1/A3 + consentimento explícito + automação Playwright sob a identidade da cliente.
- **D2:** para descoberta, PNCP cobre tudo; a "prioridade de fonte" importa mesmo é para o **Stage 5** (onde disputar a sessão) — sai da call (B1/B2).
- **BNC feed de e-mail** é um atalho de descoberta de baixo custo no MVP.

## Confiança & lacunas
- **Alta:** separação metadados (PNCP) × sessão (in-platform); Lance Fácil = automação por credencial.
- **Média:** ToS exatos de BLL/BNC (PDFs não parseáveis).
- **Baixa/Desconhecida:** APIs privadas bidder-side; termos de parceria do Lance Fácil — confirmar com os fornecedores.

**Fontes:** bll.org.br (+FAQ PNCP, Regulamento-BLL-2024); bnc.org.br (quem-somos/cadastro/editais); sislog.go.gov.br (/PanelAquisicao, /PerfisDescricao); lancefacil.com; github.com/RodrigoRMarinho/LanceBot; jusbrasil (robôs no pregão).

# Runbook — Religar Conversão do Google Ads (Tocks) · 24/Jun/2026

> **Diagnóstico:** Em 30 dias = 306 cliques, R$1.075 gastos, **0 conversão**. Causa dupla:
> 1. O site `tockscustom.com.br` (loja **Tray**) tem **GA4 + GTM**, mas **nenhuma tag de conversão do Google Ads** (`AW-…`) disparando. Prova: as conversões de site (page view, WhatsApp click) deram 0 absoluto em 30d.
> 2. As 211 conversões antigas vinham de **upload manual offline** ("Lead Qualificado Tocks") que **parou** há 30+ dias.

## IDs reais da conta (já preenchidos)

| Item | Valor |
|---|---|
| Google Ads — conta | `8146675397` (Tocks Indústria e comércio ltda) · BRL · America/Sao_Paulo |
| Auto-tagging (GCLID) | ✅ JÁ LIGADO |
| GA4 — Measurement ID | `G-CT04S2PTT2` |
| GTM — container | `GTM-P4DNHJTK` |
| Conversão offline existente | "Lead Qualificado Tocks" · ID `7550396040` · SUBMIT_LEAD_FORM · valor padrão R$13.000 |
| Destino dos anúncios | `https://www.tockscustom.com.br/` e `/linha-criativa/...` (botão → `api.whatsapp.com`) |

---

## OPÇÃO 1 — GA4 → Google Ads (RÁPIDO, ~1 dia, não mexe no site)
Use isto pra sair do zero hoje. O GA4 já está no site; só falta marcar o evento certo e importar.

### Passo 1 — Garantir que o clique no WhatsApp é um evento no GA4
1. GA4 (`G-CT04S2PTT2`) → **Admin → Eventos**.
2. Verifique se já existe um evento quando alguém clica no botão "Fale no WhatsApp" (procure `click` com `link_domain = api.whatsapp.com`, ou um evento custom tipo `whatsapp_click` / `generate_lead`).
   - **Se NÃO existir:** Admin → **Criar evento** → nome `whatsapp_click`, condição: `event_name = click` **E** `link_url contém wa.me` (ou `api.whatsapp.com`). Salvar.
3. Admin → **Eventos principais (Key events)** → ative `whatsapp_click` (ou `generate_lead`) como **key event**.

### Passo 2 — Vincular GA4 ⇄ Google Ads
1. GA4 → Admin → **Vinculações de produtos → Vínculos do Google Ads** → **Vincular** → escolher a conta `8146675397` → ativar "Personalização de anúncios" → confirmar.
   - (Tem que estar logado com usuário que é admin nos dois.)

### Passo 3 — Importar a conversão no Google Ads
1. Google Ads (`8146675397`) → **Metas → Conversões → + Nova ação de conversão → Importar → Google Analytics 4 (GA4) → Web**.
2. Marque o key event `whatsapp_click` (e `purchase`, se a Tray dispara) → **Importar e continuar**.
3. Em **Conversões → Configurações**, confirme: conversão de WhatsApp = **Primária**; page view/scroll = **Secundária** (nunca primária — foi parte do problema antigo do "sinal cego").

### Passo 4 — Janela de validação
- Aguardar 24–48h. As conversões começam a entrar com GCLID (auto-tagging já liga isso).
- ⚠️ NÃO trocar lance pra Maximize Conversions ainda — esperar acumular ≥15-30 conversões reais antes. Manter **Manual CPC** até lá.

---

## OPÇÃO 2 — Tag de conversão via GTM (ROBUSTO, correto a longo prazo)
Faz cada clique de WhatsApp virar conversão direta do Google Ads, sem depender do GA4.

### Passo 1 — Criar a ação de conversão no Google Ads
1. Ads → Metas → Conversões → **+ Nova → Site → Configurar manualmente (sem código) / Google Tag**.
2. Categoria: **Contato (lead)**. Nome: `WhatsApp Lead (GTM)`. Valor: pode usar R$13.000 ou "sem valor".
3. Anote o **Conversion ID** (`AW-XXXXXXXXX`) e o **Conversion Label** que o Ads gerar.

### Passo 2 — No GTM (`GTM-P4DNHJTK`)
1. **Tags → Nova → Google Tag** com o ID `AW-XXXXXXXXX` → trigger **All Pages** (isso é o Conversion Linker / base).
2. **Tags → Nova → Google Ads Conversion Tracking** → preencher `Conversion ID` + `Conversion Label` do Passo 1.
3. **Trigger** dessa tag: **Click - Just Links**, condição `Click URL contém wa.me` (ou `api.whatsapp.com`).
4. **Publicar** o container.

### Passo 3 — Validar
- GTM **Preview mode** → clicar no botão WhatsApp no site → ver a tag de conversão disparar.
- Ads → Conversões → status muda de "Inativa" → "Gravando conversões" em algumas horas.

---

## TAPA-BURACO IMEDIATO — Retomar upload offline (como na Bretda)
Para os leads que **já fecharam / já estão na mão** enquanto o tracking automático não matura:
- Usar a ação existente **"Lead Qualificado Tocks"** (ID `7550396040`, `UPLOAD_CLICKS`).
- Subir CSV via API `uploadClickConversions` (hash email+telefone, igual fiz na Bretda em `D:/jarvis/mcp-ads-bridge/bretda-sale-closed-upload-18jun.cjs`).
- **Preciso do CSV dos leads** (nome/email/telefone/data) pra montar o upload do Tocks.

---

## Higiene em paralelo (independe do tracking — para a sangria)
- Negativas anti-desperdício na Search `23703520246`: `usada`, `usado`, `barata`, `até`, `caseira`, `como fazer`, `brunswick`, `taco de ouro`, `jhp`, `taguatinga`.
- Pausar ad group `[PESQ] Fábrica de Mesas` (keywords DIY "como construir mesa de sinuca").
- Pausar/revisar keywords com QS 0–3 sem conversão histórica.
- (Isso eu consigo aplicar via API quando você autorizar.)

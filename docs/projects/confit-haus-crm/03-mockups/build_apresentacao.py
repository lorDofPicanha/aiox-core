#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Monta a apresentação client-facing do CRM Confit Haus (HTML autocontido)."""
import base64, pathlib

HERE = pathlib.Path(__file__).parent
def b64(name):
    return base64.b64encode((HERE / name).read_bytes()).decode()

img = {
    "inbox": b64("01-inbox.png"),
    "pipeline": b64("02-pipeline.png"),
    "ficha": b64("03-ficha.png"),
    "analise": b64("04-analise.png"),
}

SECTIONS = [
    ("inbox", "1. Caixa de entrada do WhatsApp",
     "Todas as conversas do WhatsApp num lugar só.",
     [
        "Cada conversa já vem com uma <b>etiqueta de nicho</b> (Restaurante, Empório, Corporativo…) pra você saber na hora com quem está falando.",
        "No painel da direita, você classifica o cliente: <b>qualidade do lead</b> (Quente / Morno / Frio), <b>nicho</b> e <b>status de compra</b>.",
        "O <b>assistente</b> sugere uma resposta pronta no tom da Confit Haus — você só <b>aprova e envia</b> ou edita. Ele nunca envia preço ou compromisso sozinho.",
     ]),
    ("pipeline", "2. Funil de vendas (Pipeline)",
     "O caminho de cada cliente, do primeiro contato à recompra.",
     [
        "Cada cliente é um cartão que caminha pelas colunas: <b>Novo lead → Contato → Qualificado → Amostra/Proposta → Negociação → Ganho → Recompra</b>.",
        "Você arrasta o cartão de uma coluna pra outra conforme a conversa evolui.",
        "A coluna <b>Recompra</b> é o coração do relacionamento: geleia e molho são consumo recorrente — aqui você nunca mais perde o momento de reativar um cliente.",
     ]),
    ("ficha", "3. Ficha do cliente",
     "Tudo sobre um cliente numa página.",
     [
        "Histórico completo: primeira mensagem, amostra enviada, primeira compra, recompras — uma linha do tempo do relacionamento.",
        "Pedidos anteriores com valores, score do lead e responsável pelo atendimento.",
        "Seção de <b>privacidade (LGPD)</b>: consentimento de marketing, exportar e excluir dados — tudo dentro da lei.",
     ]),
    ("analise", "4. Análise e relatórios",
     "Os números que mostram a saúde do seu relacionamento com os clientes.",
     [
        "Indicadores do mês: leads novos, taxa de conversão, clientes recorrentes e tempo médio de resposta.",
        "<b>Conversão por nicho</b>: descubra quais tipos de cliente (restaurantes, empórios, corporativo…) mais compram.",
        "<b>Leads parados</b>: a ferramenta te avisa quem ficou sem contato — pra nenhuma oportunidade esfriar.",
     ]),
]

AJUSTES = [
    "Os <b>nichos</b> (tipos de cliente) — quer adicionar, remover ou renomear algum?",
    "As <b>etapas do funil</b> — fazem sentido pro seu jeito de vender, ou falta/sobra alguma?",
    "Os <b>campos da ficha</b> do cliente — tem alguma informação que você sempre quer registrar?",
    "O <b>tom das respostas</b> sugeridas pelo assistente — mais formal, mais próximo?",
    "Quais <b>relatórios</b> são os mais importantes pra você acompanhar toda semana?",
]

NARRATIVA = """
<section class="story">
  <div class="kicker">Como vai funcionar — no seu dia a dia</div>
  <h2>Uma terça-feira qualquer, na prática</h2>
  <div class="story-steps">
    <p><b>09h12</b> — O dono de um restaurante manda mensagem no WhatsApp da Confit Haus: <i>"vi a geleia de amora de vocês, queria pro café da manhã do meu hotel"</i>. A conversa cai na <b>Caixa de Entrada</b> e o sistema já avisa o vendedor.</p>
    <p><b>09h13</b> — O <b>assistente</b> já deixou um rascunho de resposta pronto, no jeitinho da marca. O vendedor lê, gosta, e clica em <b>"Aprovar e enviar"</b>. Marca o cliente como <b>Restaurante · Quente</b>.</p>
    <p><b>09h30</b> — No <b>Funil</b>, o cartão desse cliente vai de "Novo lead" para "Contato feito". O vendedor combina de mandar uma amostra → arrasta pra <b>"Amostra/Proposta"</b>.</p>
    <p><b>Dias depois</b> — Fechou o pedido. O cartão vai pra <b>"Ganho"</b>. Tudo fica registrado: o que comprou, quanto, quando.</p>
    <p><b>2 meses depois</b> — O sistema lembra que esse cliente costuma recomprar. O cartão aparece em <b>"Recompra"</b> e o vendedor reativa a conversa — sem depender da memória de ninguém.</p>
    <p><b>No fim do mês</b> — Na tela de <b>Análise</b>, o dono vê que os <b>empórios</b> são quem mais converte, que 3 leads estão parados e quanto a recompra cresceu. Decisão com número, não no escuro.</p>
  </div>
  <div class="benefits">
    <div class="ben"><span>1</span> Nenhuma conversa se perde — tudo num lugar só.</div>
    <div class="ben"><span>2</span> O assistente economiza tempo escrevendo as respostas.</div>
    <div class="ben"><span>3</span> Você sabe quem é bom cliente, de qual nicho e em que ponto está.</div>
    <div class="ben"><span>4</span> A recompra deixa de depender de memória e vira processo.</div>
  </div>
</section>
"""

sec_html = ""
for key, titulo, sub, bullets in SECTIONS:
    lis = "".join(f"<li>{b}</li>" for b in bullets)
    sec_html += f"""
    <section class="screen">
      <div class="screen-head">
        <h2>{titulo}</h2>
        <p class="sub">{sub}</p>
      </div>
      <div class="shot"><img src="data:image/png;base64,{img[key]}" alt="{titulo}"/></div>
      <ul class="howto">{lis}</ul>
    </section>"""

ajustes_html = "".join(f"<li>{a}</li>" for a in AJUSTES)

HTML = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Confit Haus — Seu CRM</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=Inter+Tight:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{{
    --bg:#EDE4D9; --surface:#FFFFFF; --border:#DDD6CA;
    --primary:#3C7496; --primary-dark:#2F6A97;
    --brand:#3A5643; --brand-dark:#324C3A;
    --accent:#EFCB83; --text:#1A1A1A; --muted:#6B6B6B;
    --serif:'Newsreader',Georgia,serif; --sans:'Inter Tight',-apple-system,Segoe UI,sans-serif;
  }}
  *{{box-sizing:border-box;margin:0;padding:0}}
  body{{font-family:var(--sans);color:var(--text);background:var(--bg);line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  .page{{max-width:920px;margin:0 auto;padding:0 28px}}

  /* Capa */
  .cover{{background:var(--brand);color:#fff;padding:84px 0 72px;position:relative;overflow:hidden}}
  .cover .stripes{{position:absolute;inset:0;opacity:.10;
    background:repeating-linear-gradient(45deg, #fff 0 14px, transparent 14px 34px)}}
  .cover .page{{position:relative}}
  .brandmark{{font-family:var(--serif);font-weight:600;font-size:30px;letter-spacing:.5px}}
  .brandmark small{{display:block;font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:3px;
    text-transform:uppercase;opacity:.8;margin-top:2px}}
  .cover h1{{font-family:var(--serif);font-weight:600;font-size:52px;line-height:1.08;margin:46px 0 16px;max-width:16ch}}
  .cover p.lead{{font-size:19px;max-width:54ch;opacity:.95}}
  .cover .tag{{display:inline-block;margin-top:30px;background:var(--accent);color:#3a2c10;font-weight:600;
    font-size:13px;padding:9px 16px;border-radius:999px}}

  /* Intro */
  .intro{{padding:56px 0 8px}}
  .kicker{{font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--primary);margin-bottom:10px}}
  .intro h2{{font-family:var(--serif);font-weight:600;font-size:30px;margin-bottom:14px;color:var(--brand-dark)}}
  .intro p{{font-size:16.5px;color:#3a3a3a;max-width:64ch;margin-bottom:12px}}
  .pills{{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}}
  .pill{{background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:500;color:var(--brand-dark)}}

  /* Telas */
  .screen{{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:30px;margin:26px 0;
    box-shadow:0 6px 26px rgba(60,116,150,.06)}}
  .screen-head h2{{font-family:var(--serif);font-weight:600;font-size:25px;color:var(--brand-dark)}}
  .screen-head .sub{{color:var(--muted);font-size:15px;margin-top:2px}}
  .shot{{margin:20px 0 16px;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:var(--bg)}}
  .shot img{{display:block;width:100%;height:auto}}
  ul.howto{{list-style:none;display:grid;gap:10px}}
  ul.howto li{{position:relative;padding-left:26px;font-size:15px;color:#333}}
  ul.howto li::before{{content:"";position:absolute;left:0;top:8px;width:11px;height:11px;border-radius:3px;
    background:var(--accent);border:2px solid var(--brand)}}

  /* Narrativa dia a dia */
  .story{{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:32px 30px;margin:28px 0;
    box-shadow:0 6px 26px rgba(60,116,150,.06)}}
  .story h2{{font-family:var(--serif);font-weight:600;font-size:26px;color:var(--brand-dark);margin:4px 0 18px}}
  .story-steps p{{font-size:15.5px;color:#333;padding:11px 0 11px 18px;border-left:3px solid var(--accent);margin-bottom:10px;background:linear-gradient(90deg,rgba(239,203,131,.08),transparent)}}
  .story-steps p b{{color:var(--primary-dark)}}
  .benefits{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}}
  .ben{{display:flex;gap:11px;align-items:flex-start;background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:14px 16px;font-size:14.5px;font-weight:500;color:var(--brand-dark)}}
  .ben span{{flex:0 0 24px;height:24px;border-radius:50%;background:var(--brand);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center}}

  /* Fluxo */
  .flow{{background:var(--brand-dark);color:#fff;border-radius:18px;padding:34px 30px;margin:34px 0}}
  .flow h2{{font-family:var(--serif);font-weight:600;font-size:26px;margin-bottom:20px}}
  .steps{{display:grid;grid-template-columns:1fr;gap:0}}
  .step{{display:flex;gap:14px;align-items:flex-start;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.12)}}
  .step:last-child{{border-bottom:0}}
  .step .n{{flex:0 0 30px;height:30px;border-radius:50%;background:var(--accent);color:#3a2c10;font-weight:700;
    display:flex;align-items:center;justify-content:center;font-size:14px}}
  .step .t{{font-size:15.5px;padding-top:3px}}
  .step .t b{{color:var(--accent)}}

  /* Ajustes */
  .adjust{{background:var(--surface);border:2px solid var(--accent);border-radius:18px;padding:30px;margin:30px 0}}
  .adjust h2{{font-family:var(--serif);font-weight:600;font-size:25px;color:var(--brand-dark);margin-bottom:6px}}
  .adjust p.note{{color:var(--muted);font-size:14.5px;margin-bottom:16px}}
  .adjust ul{{list-style:none;display:grid;gap:12px}}
  .adjust li{{position:relative;padding-left:34px;font-size:15.5px;color:#333}}
  .adjust li::before{{content:"";position:absolute;left:0;top:1px;width:20px;height:20px;border-radius:5px;
    border:2px solid var(--primary);background:#fff}}

  /* Rodapé */
  footer{{text-align:center;padding:48px 0 64px;color:var(--muted)}}
  footer .fm{{font-family:var(--serif);font-size:22px;color:var(--brand);font-weight:600}}
  footer .tl{{font-size:14px;margin-top:4px}}

  @media print{{ .screen,.adjust{{break-inside:avoid}} .flow{{break-inside:avoid}} }}
</style>
</head>
<body>
  <div class="cover">
    <div class="stripes"></div>
    <div class="page">
      <div class="brandmark">Confit Haus<small>CRM &amp; Relacionamento</small></div>
      <h1>Seu novo jeito de cuidar dos clientes.</h1>
      <p class="lead">Um painel único, conectado ao seu WhatsApp, com um assistente que te ajuda no dia a dia — pra nenhum cliente, pedido ou recompra passar batido.</p>
      <span class="tag">Prévia visual — pronta pra você opinar</span>
    </div>
  </div>

  <div class="page">
    <section class="intro">
      <div class="kicker">O que é</div>
      <h2>Tudo num lugar só, do jeito Confit Haus</h2>
      <p>Hoje as conversas, os pedidos e o relacionamento ficam espalhados. Este sistema reúne tudo: cada mensagem do WhatsApp vira um cliente organizado, com seu nicho, sua qualidade e seu histórico — e um assistente sugere as respostas pra você ganhar tempo.</p>
      <p>Como você atende clientes de tipos bem diferentes, o sistema separa cada um pelo seu <b>nicho</b>, e o vendedor marca se o lead é bom ou não e em que ponto da compra está.</p>
      <div class="pills">
        <span class="pill">Restaurantes</span><span class="pill">Cafés &amp; Padarias</span>
        <span class="pill">Empórios &amp; Lojas de Presente</span><span class="pill">Corporativo / Brindes</span>
        <span class="pill">Consumidor Final</span><span class="pill">Revendedores</span>
      </div>
      <p style="margin-top:14px;font-size:13.5px;color:var(--muted)">As telas abaixo são uma <b>prévia do visual</b> (com dados de exemplo). A ideia é você ver como vai ficar e pedir os ajustes que quiser <b>antes</b> de começarmos a construir.</p>
    </section>

    {NARRATIVA}

    {sec_html}

    <div class="flow">
      <h2>Como funciona, do começo ao fim</h2>
      <div class="steps">
        <div class="step"><div class="n">1</div><div class="t">O cliente manda mensagem no <b>WhatsApp</b> da Confit Haus.</div></div>
        <div class="step"><div class="n">2</div><div class="t">A conversa cai na <b>caixa de entrada</b> do painel e o assistente já avisa o vendedor na hora.</div></div>
        <div class="step"><div class="n">3</div><div class="t">O vendedor classifica: <b>nicho</b>, <b>qualidade do lead</b> e <b>status de compra</b>.</div></div>
        <div class="step"><div class="n">4</div><div class="t">O assistente <b>sugere a resposta</b> no tom da marca — o vendedor aprova ou edita e envia.</div></div>
        <div class="step"><div class="n">5</div><div class="t">O cliente avança no <b>funil</b> até a compra — e depois entra no acompanhamento de <b>recompra</b>.</div></div>
        <div class="step"><div class="n">6</div><div class="t">Tudo vira <b>número e relatório</b>: o que converte, quem parou, onde estão as oportunidades.</div></div>
      </div>
    </div>

    <div class="adjust">
      <h2>O que você pode pedir pra ajustar</h2>
      <p class="note">Nada aqui está fechado. Dá uma olhada e me diga o que mudar — é o melhor momento, antes da construção:</p>
      <ul>{ajustes_html}</ul>
    </div>

    <footer>
      <div class="fm">Confit Haus</div>
      <div class="tl">Sabores que criam memórias.</div>
    </footer>
  </div>
</body>
</html>"""

out = HERE / "Confit-Haus-CRM-Apresentacao.html"
out.write_text(HTML, encoding="utf-8")
print("OK ->", out, len(HTML), "chars")

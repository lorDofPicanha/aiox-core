#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Landing page HTML (client-facing) do CRM Confit Haus — tema custom 'Confit Haus'."""
import base64, pathlib

HERE = pathlib.Path(__file__).parent
def b64(name): return base64.b64encode((HERE / name).read_bytes()).decode()
IMG = {k: b64(f"{k}.png") for k in ["01-inbox","02-pipeline","03-ficha","04-analise","05-assistente"]}

# ---- telas ----
SCREENS = [
    ("inbox","01-inbox","Caixa de entrada do WhatsApp","Todas as conversas num lugar só.", False,
     ["Cada conversa já vem com a <b>etiqueta de nicho</b> (Restaurante, Empório, Corporativo…).",
      "No painel da direita você classifica: <b>qualidade do lead</b> (Quente/Morno/Frio), <b>nicho</b> e <b>status de compra</b>.",
      "O <b>assistente</b> sugere a resposta no tom da marca — você só <b>aprova e envia</b> ou edita. Nunca manda preço sozinho."]),
    ("funil","02-pipeline","Funil de vendas","O caminho de cada cliente, do 1º contato à recompra.", True,
     ["Cada cliente é um cartão que anda pelas colunas: <b>Novo lead → Contato → Qualificado → Amostra → Negociação → Ganho → Recompra</b>.",
      "Você arrasta o cartão conforme a conversa evolui.",
      "A coluna <b>Recompra</b> é o coração do relacionamento — geleia e molho são consumo recorrente, e aqui você nunca perde o momento de reativar."]),
    ("ficha","03-ficha","Ficha do cliente","Tudo sobre um cliente numa página.", False,
     ["Linha do tempo do relacionamento: 1ª mensagem, amostra, 1ª compra, recompras.",
      "Pedidos anteriores com valores, score do lead e responsável.",
      "Bloco <b>Privacidade (LGPD)</b>: consentimento, exportar e excluir dados — tudo dentro da lei."]),
    ("analise","04-analise","Análise e relatórios","Os números da saúde do seu relacionamento.", False,
     ["Indicadores do mês: leads novos, conversão, clientes recorrentes, tempo de resposta.",
      "<b>Conversão por nicho</b>: descubra quais tipos de cliente mais compram.",
      "<b>Leads parados</b>: o sistema avisa quem ficou sem contato — nenhuma oportunidade esfria."]),
]
AJUSTES = [
    "Os <b>nichos</b> (tipos de cliente) — adicionar, remover ou renomear algum?",
    "As <b>etapas do funil</b> — fazem sentido pro seu jeito de vender?",
    "Os <b>campos da ficha</b> — alguma info que você sempre quer registrar?",
    "O <b>tom das respostas</b> do assistente — mais formal, mais próximo?",
    "Quais <b>relatórios</b> são os mais importantes pra acompanhar toda semana?",
]
NARRA = [
    ("09h12","O dono de um restaurante manda mensagem no WhatsApp: <i>“vi a geleia de amora, queria pro café do meu hotel”</i>. Cai na <b>Caixa de Entrada</b> e o sistema avisa o vendedor."),
    ("09h13","O <b>assistente</b> já deixou um rascunho pronto, no jeito da marca. O vendedor lê, aprova e clica em <b>“Aprovar e enviar”</b>. Marca como <b>Restaurante · Quente</b>."),
    ("09h30","No <b>Funil</b>, o cartão vai de “Novo lead” para “Contato feito”. Combinou amostra → arrasta pra <b>“Amostra/Proposta”</b>."),
    ("Dias depois","Fechou o pedido → cartão em <b>“Ganho”</b>. Fica tudo registrado: o que comprou, quanto, quando."),
    ("2 meses depois","O sistema lembra que esse cliente recompra. O cartão aparece em <b>“Recompra”</b> e o vendedor reativa — sem depender de memória."),
    ("Fim do mês","Na <b>Análise</b>, o dono vê que os <b>empórios</b> convertem mais, quais leads estão parados e quanto a recompra cresceu."),
]
FLUXO = [
    "O cliente manda mensagem no <b>WhatsApp</b> da Confit Haus.",
    "A conversa cai na <b>caixa de entrada</b> e o assistente avisa o vendedor na hora.",
    "O vendedor classifica: <b>nicho</b>, <b>qualidade</b> e <b>status de compra</b>.",
    "O assistente <b>sugere a resposta</b> no tom da marca — o vendedor aprova/edita e envia.",
    "O cliente avança no <b>funil</b> até a compra — e depois entra na <b>recompra</b>.",
    "Tudo vira <b>número e relatório</b>: o que converte, quem parou, onde estão as oportunidades.",
]

def browser_frame(imgkey, scroll):
    body = f'<div class="bw-scroll"><img src="data:image/png;base64,{IMG[imgkey]}" class="bw-img-wide" alt=""></div>' if scroll \
        else f'<img src="data:image/png;base64,{IMG[imgkey]}" class="bw-img" alt="">'
    hint = '<div class="scroll-hint">↔ role para o lado para ver todas as etapas</div>' if scroll else ''
    return f'''<div class="browser">
      <div class="bw-bar"><span class="dot d1"></span><span class="dot d2"></span><span class="dot d3"></span>
        <span class="bw-url">app.confithaus.com.br</span></div>
      {body}
    </div>{hint}'''

screens_html = ""
for i,(sid,imgkey,titulo,sub,scroll,bullets) in enumerate(SCREENS, 1):
    lis = "".join(f"<li>{b}</li>" for b in bullets)
    screens_html += f'''
    <section class="screen" id="{sid}">
      <div class="screen-head"><span class="num">{i}</span><div><h3>{titulo}</h3><p>{sub}</p></div></div>
      {browser_frame(imgkey, scroll)}
      <ul class="howto">{lis}</ul>
    </section>'''

ASSIST_BULLETS = [
    "Funciona no <b>SEU WhatsApp</b> — é só conversar com ele, como com uma pessoa.",
    "Todo dia de manhã ele te manda seus <b>lembretes</b> (ligar pra fulano, enviar amostra, cobrar retorno).",
    "Você pergunta em linguagem natural: <i>“como foram as vendas essa semana?”</i>, <i>“quem não fechou?”</i>, <i>“quais clientes são bons?”</i> — e ele responde na hora.",
    "Toda semana ele te manda o <b>relatório de vendas automático</b>: fechados, em negociação, quem não fechou (e por quê), melhor nicho e recompra prevista.",
    "Ajuda nas <b>tarefas do dia a dia</b>: cria lembretes, cobra retornos e até prepara mensagens de reativação pra você aprovar.",
]
assist_bullets_html = "".join(f"<li>{b}</li>" for b in ASSIST_BULLETS)
ASSIST_HTML = f'''
<section class="block" id="assistente">
  <div class="kicker">O assistente</div>
  <h2>Seu assistente, no seu WhatsApp</h2>
  <p class="lead">Além de ajudar o vendedor a responder os clientes, o assistente também é <b>seu</b>: ele vive no seu WhatsApp, te lembra do que importa, puxa as informações que você pedir e te entrega relatórios — sem você precisar abrir o sistema.</p>
  <div class="assist">
    <div class="phone"><img src="data:image/png;base64,{IMG["05-assistente"]}" alt="Assistente no WhatsApp"></div>
    <ul class="howto assist-list">{assist_bullets_html}</ul>
  </div>
</section>'''

narra_html = "".join(f'<div class="ev"><div class="when">{w}</div><div class="what">{t}</div></div>' for w,t in NARRA)
fluxo_html = "".join(f'<div class="step"><span class="n">{i}</span><p>{t}</p></div>' for i,t in enumerate(FLUXO,1))
ajustes_html = "".join(f'<li><span class="chk"></span><span>{a}</span></li>' for a in AJUSTES)

CSS = """
:root{
 --bg:#EDE4D9;--surface:#fff;--border:#DDD6CA;--primary:#3C7496;--primary-dark:#2F6A97;
 --brand:#3A5643;--brand-dark:#324C3A;--accent:#EFCB83;--text:#1A1A1A;--muted:#6B6B6B;
 --serif:'Newsreader',Georgia,serif;--sans:'Inter Tight',-apple-system,Segoe UI,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--sans);color:var(--text);background:var(--bg);line-height:1.6}
.wrap{max-width:1080px;margin:0 auto;padding:0 32px}
a{color:inherit;text-decoration:none}

/* top nav */
.nav{position:sticky;top:0;z-index:50;background:rgba(237,228,217,.88);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:62px}
.nav .bm{font-family:var(--serif);font-weight:600;font-size:21px;color:var(--brand-dark)}
.nav .links{display:flex;gap:26px;font-size:14px;font-weight:500;color:var(--muted)}
.nav .links a:hover{color:var(--primary-dark)}
@media(max-width:720px){.nav .links{display:none}}

/* hero */
.hero{background:var(--brand);color:#fff;position:relative;overflow:hidden}
.hero .stripes{position:absolute;inset:0;opacity:.10;background:repeating-linear-gradient(45deg,#fff 0 16px,transparent 16px 38px)}
.hero .wrap{position:relative;padding:84px 32px 76px}
.hero .eyebrow{font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;opacity:.85}
.hero h1{font-family:var(--serif);font-weight:600;font-size:clamp(38px,6vw,58px);line-height:1.06;margin:18px 0 16px;max-width:17ch}
.hero p{font-size:19px;max-width:56ch;opacity:.95}
.hero .tag{display:inline-block;margin-top:30px;background:var(--accent);color:#3a2c10;font-weight:600;font-size:13.5px;padding:10px 18px;border-radius:999px}

/* sections */
section.block{padding:64px 0 12px}
.kicker{font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--primary);margin-bottom:10px}
h2{font-family:var(--serif);font-weight:600;font-size:32px;color:var(--brand-dark);margin-bottom:14px}
.lead{font-size:17px;color:#3a3a3a;max-width:66ch;margin-bottom:12px}
.pills{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}
.pill{background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:8px 15px;font-size:13.5px;font-weight:500;color:var(--brand-dark)}
.fine{font-size:13px;color:var(--muted);margin-top:16px}

/* narrativa */
.story{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:34px;margin-top:26px;box-shadow:0 8px 30px rgba(60,116,150,.06)}
.ev{display:grid;grid-template-columns:120px 1fr;gap:16px;padding:12px 0;border-bottom:1px solid var(--border)}
.ev:last-of-type{border-bottom:0}
.when{font-weight:700;color:var(--primary-dark);font-size:14px;padding-top:2px}
.what{font-size:15.5px;color:#333}
.benefits{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
.ben{display:flex;gap:11px;align-items:center;background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:14px 16px;font-size:14.5px;font-weight:500;color:var(--brand-dark)}
.ben b{flex:0 0 26px;height:26px;border-radius:50%;background:var(--brand);color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center}
@media(max-width:680px){.benefits{grid-template-columns:1fr}.ev{grid-template-columns:80px 1fr}}

/* telas */
.screen{margin:30px 0}
.screen-head{display:flex;gap:16px;align-items:center;margin-bottom:18px}
.screen-head .num{flex:0 0 40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;font-family:var(--serif);font-size:20px;display:flex;align-items:center;justify-content:center}
.screen-head h3{font-family:var(--serif);font-weight:600;font-size:25px;color:var(--brand-dark)}
.screen-head p{color:var(--muted);font-size:15px}
.browser{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 12px 40px rgba(50,76,58,.10)}
.bw-bar{display:flex;align-items:center;gap:7px;padding:11px 16px;background:#f4ede3;border-bottom:1px solid var(--border)}
.dot{width:11px;height:11px;border-radius:50%}.d1{background:#E7A0A0}.d2{background:#EFCB83}.d3{background:#9DBE9F}
.bw-url{margin-left:12px;font-size:12.5px;color:var(--muted);background:#fff;border:1px solid var(--border);border-radius:6px;padding:3px 12px}
.bw-img{display:block;width:100%;height:auto}
.bw-scroll{overflow-x:auto}
.bw-img-wide{display:block;height:560px;width:auto;max-width:none}
.scroll-hint{font-size:13px;color:var(--muted);margin-top:8px;text-align:center;font-style:italic}
ul.howto{list-style:none;display:grid;gap:11px;margin-top:18px}
ul.howto li{position:relative;padding-left:28px;font-size:15.5px;color:#333}
ul.howto li::before{content:"";position:absolute;left:0;top:7px;width:12px;height:12px;border-radius:3px;background:var(--accent);border:2px solid var(--brand)}

/* fluxo */
.flow{background:var(--brand-dark);color:#fff;border-radius:20px;padding:38px 34px;margin:34px 0}
.flow h2{color:#fff}
.steps{display:grid;gap:0;margin-top:18px}
.step{display:flex;gap:15px;align-items:flex-start;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.13)}
.step:last-child{border-bottom:0}
.step .n{flex:0 0 32px;height:32px;border-radius:50%;background:var(--accent);color:#3a2c10;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:15px}
.step p{font-size:16px;padding-top:4px}.step b{color:var(--accent)}

/* ajustes */
.adjust{background:var(--surface);border:2px solid var(--accent);border-radius:20px;padding:34px;margin:30px 0}
.adjust ul{list-style:none;display:grid;gap:13px;margin-top:16px}
.adjust li{display:flex;gap:13px;align-items:flex-start;font-size:15.5px;color:#333}
.chk{flex:0 0 20px;height:20px;border-radius:5px;border:2px solid var(--primary);background:#fff;margin-top:1px}

/* assistente */
.assist{display:grid;grid-template-columns:340px 1fr;gap:40px;align-items:center;margin-top:26px}
.phone{justify-self:center}
.phone img{width:320px;max-width:100%;border-radius:26px;border:8px solid #1f1b14;box-shadow:0 18px 50px rgba(50,76,58,.22)}
.assist-list{margin-top:0}
@media(max-width:760px){.assist{grid-template-columns:1fr;gap:26px}}

footer{text-align:center;padding:56px 0 40px;color:var(--muted)}
footer .fm{font-family:var(--serif);font-size:24px;color:var(--brand);font-weight:600}
"""

HTML = """<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Confit Haus — Seu CRM</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=Inter+Tight:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>__CSS__</style></head><body>

<nav class="nav"><div class="wrap">
  <div class="bm">Confit Haus</div>
  <div class="links"><a href="#visao">Visão geral</a><a href="#como">Como funciona</a><a href="#inbox">Telas</a><a href="#assistente">Assistente</a><a href="#ajustar">Ajustes</a></div>
</div></nav>

<header class="hero"><div class="stripes"></div><div class="wrap">
  <div class="eyebrow">CRM &amp; Relacionamento</div>
  <h1>Seu novo jeito de cuidar dos clientes.</h1>
  <p>Um painel único, conectado ao seu WhatsApp, com um assistente que te ajuda no dia a dia — pra nenhum cliente, pedido ou recompra passar batido.</p>
  <span class="tag">Prévia visual — pronta pra você opinar</span>
</div></header>

<main class="wrap">
  <section class="block" id="visao">
    <div class="kicker">O que é</div>
    <h2>Tudo num lugar só, do jeito Confit Haus</h2>
    <p class="lead">Hoje as conversas, os pedidos e o relacionamento ficam espalhados. Este sistema reúne tudo: cada mensagem do WhatsApp vira um cliente organizado — com seu nicho, sua qualidade e seu histórico — e um assistente sugere as respostas pra você ganhar tempo.</p>
    <p class="lead">Como você atende clientes de tipos bem diferentes, o sistema separa cada um pelo seu <b>nicho</b>, e o vendedor marca se o lead é bom ou não e em que ponto da compra está.</p>
    <div class="pills">
      <span class="pill">Restaurantes</span><span class="pill">Cafés &amp; Padarias</span><span class="pill">Empórios &amp; Lojas de Presente</span>
      <span class="pill">Corporativo / Brindes</span><span class="pill">Consumidor Final</span><span class="pill">Revendedores</span>
    </div>
    <p class="fine">As telas abaixo são uma <b>prévia do visual</b> (com dados de exemplo) — pra você ver como vai ficar e pedir ajustes <b>antes</b> de começarmos a construir.</p>
  </section>

  <section class="block" id="como">
    <div class="kicker">Como vai funcionar — no seu dia a dia</div>
    <h2>Uma terça-feira qualquer, na prática</h2>
    <div class="story">
      __NARRA__
      <div class="benefits">
        <div class="ben"><b>1</b> Nenhuma conversa se perde — tudo num lugar só.</div>
        <div class="ben"><b>2</b> O assistente economiza tempo escrevendo as respostas.</div>
        <div class="ben"><b>3</b> Você sabe quem é bom cliente, de qual nicho e em que ponto está.</div>
        <div class="ben"><b>4</b> A recompra vira processo, não memória.</div>
      </div>
    </div>
  </section>

  <section class="block"><div class="kicker">As telas</div><h2>Como vai ficar</h2></section>
  __SCREENS__

  __ASSIST__

  <div class="flow" id="fluxo">
    <h2>Do começo ao fim, em 6 passos</h2>
    <div class="steps">__FLUXO__</div>
  </div>

  <section class="block" id="ajustar"><div class="adjust">
    <div class="kicker">Sua vez</div><h2>O que você pode pedir pra ajustar</h2>
    <p class="lead">Nada aqui está fechado. Dá uma olhada e me diga o que mudar — é o melhor momento, antes da construção:</p>
    <ul>__AJUSTES__</ul>
  </div></section>
</main>

<footer><div class="fm">Confit Haus</div><div>Sabores que criam memórias.</div></footer>
</body></html>"""

HTML = (HTML.replace("__CSS__", CSS).replace("__NARRA__", narra_html)
        .replace("__SCREENS__", screens_html).replace("__ASSIST__", ASSIST_HTML)
        .replace("__FLUXO__", fluxo_html).replace("__AJUSTES__", ajustes_html))
out = HERE / "Confit-Haus-CRM-Apresentacao-site.html"
out.write_text(HTML, encoding="utf-8")
print("OK ->", out, len(HTML), "chars")

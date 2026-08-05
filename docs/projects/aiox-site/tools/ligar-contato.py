# -*- coding: utf-8 -*-
"""Liga os canais de contato do talos-site.

O formulario herdado do template e da Webflow: `method=get`, sem `action`, com
`data-wf-page-id` e Turnstile. Fora da Webflow ele dispara 11 requisicoes para o
Cloudflare e NENHUMA entrega o lead — e nem o painel de sucesso nem o de erro
aparecem. Aqui ele passa a postar num endpoint real e a mostrar o estado certo.
"""
import re, os

BASE = r"D:/AIOS/docs/projects/aiox-site/05-build/talos-site"
P = os.path.join(BASE, "index.html")

FONE = "5547992789991"          # +55 47 99278-9991
EMAIL_U, EMAIL_D = "agenciytalos", "gmail.com"   # montado em JS: evita colheita trivial
SAUDACAO = "Ola! Vim pelo site da Talos e queria falar sobre automatizar um processo."

h = open(P, encoding="utf-8").read()
log = []

# ---------------------------------------------------------------- 1. limpa o form
antes = h
h = re.sub(r'\s+data-wf-page-id="[^"]*"', "", h)
h = re.sub(r'\s+data-wf-element-id="[^"]*"', "", h)
h = re.sub(r'\s+data-turnstile-sitekey="[^"]*"', "", h)
h = re.sub(r'<div><div><input type="hidden" name="cf-turnstile-response"[^>]*></div></div>', "", h)
if h != antes:
    log.append("form: removidos data-wf-page-id, data-wf-element-id, turnstile (sitekey + input oculto)")

h = h.replace('<form id="email-form" name="email-form" data-name="Email Form" method="get" class="form_form"',
              '<form id="email-form" name="email-form" data-name="Email Form" method="post" class="form_form"', 1)
log.append("form: method=get -> method=post")

# wrapper preso em estado de carregamento herdado da captura
if 'class="cta-form w-form w-form-loading"' in h:
    h = h.replace('class="cta-form w-form w-form-loading"', 'class="cta-form w-form"', 1)
    log.append("form: removida a classe w-form-loading (estado congelado da captura)")

# ---------------------------------------------------------------- 2. botao de WhatsApp
# A variante "contact-button" e o botao QUIETO do template (o "Ver como funciona" do hero).
# Sem ela o link herda `.button` puro, que e o gradiente iridescente — e o WhatsApp
# passa a parecer mais importante que o proprio enviar do formulario.
VAR = "w-variant-9943b888-52fe-aefa-9593-d1e9001eb671"
BTN_WA = (
    '<a href="https://wa.me/{fone}?text={txt}" target="_blank" rel="noopener" '
    'class="button ' + VAR + ' w-inline-block" data-wf--button--variant="contact-button" '
    'aria-label="Falar no WhatsApp">'
    '<div class="button-inner ' + VAR + '"><div class="button-text-wrap">'
    '<div class="button-text">Ou chamar no WhatsApp</div></div>'
    '<div class="button-icon"><div class="icon-button w-embed">'
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="100%" height="100%" '
    'fill="currentColor" aria-hidden="true" role="img">'
    '<path d="M8.02 1.6a6.35 6.35 0 0 0-5.4 9.7l-.71 2.6 2.66-.7A6.35 6.35 0 1 0 8.02 1.6Zm0 1.15a5.2 5.2 0 1 1-2.65 9.67l-.19-.11-1.58.41.42-1.54-.12-.2A5.2 5.2 0 0 1 8.02 2.75Zm-2.2 2.6c-.1 0-.28.04-.42.2-.15.16-.55.54-.55 1.32 0 .78.56 1.53.64 1.64.08.1 1.1 1.76 2.72 2.4 1.35.53 1.62.42 1.92.4.3-.03.96-.4 1.1-.78.13-.38.13-.7.1-.77-.04-.07-.14-.11-.3-.19-.15-.08-.9-.45-1.04-.5-.14-.05-.24-.08-.34.08-.1.15-.39.5-.48.6-.09.1-.18.12-.33.04a4.16 4.16 0 0 1-1.23-.76 4.6 4.6 0 0 1-.85-1.06c-.09-.15 0-.24.07-.31.07-.07.15-.18.23-.27.07-.1.1-.16.15-.27.05-.1.02-.2-.01-.27-.04-.08-.34-.82-.47-1.12-.12-.29-.24-.25-.33-.26h-.28Z"/>'
    '</svg></div></div></div><div class="button-innershadow"></div></a>'
).format(fone=FONE, txt=SAUDACAO.replace(" ", "%20"))

alvo = '<input type="submit" data-wait="Enviando..." class="submit-button w-button" value="Quero falar sobre meu processo">'
if alvo in h:
    h = h.replace(alvo, alvo + BTN_WA, 1)
    log.append("form: botao de WhatsApp adicionado ao lado do enviar")
else:
    log.append("AVISO: nao achei o botao de enviar para ancorar o WhatsApp")

# ---------------------------------------------------------------- 3. "Marcar conversa" -> WhatsApp
k = h.find('aria-label="Marcar conversa"')
if k > 0:
    j = h.rfind("<a ", 0, k)
    trecho = h[j:k]
    novo = trecho.replace('href="#CTA-Form"',
                          f'href="https://wa.me/{FONE}?text={SAUDACAO.replace(" ", "%20")}" target="_blank" rel="noopener"', 1)
    if novo != trecho:
        h = h[:j] + novo + h[k:]
        log.append('"Marcar conversa" (card de 30 min) agora vai direto para o WhatsApp')

# ---------------------------------------------------------------- 4. handler proprio
JS = """
<script id="tl-form">
/* O handler da Webflow nao entrega nada fora da Webflow. Este intercepta na fase de
   captura e para a propagacao antes que o jQuery dela rode. */
(function () {
  var FONE = '%FONE%';
  var END = 'https://formsubmit.co/ajax/' + ['%EU%', '%ED%'].join('@');
  var form = document.getElementById('email-form');
  if (!form) return;
  var wrap = form.closest('.w-form') || form.parentNode;
  var ok = wrap.querySelector('.w-form-done');
  var falha = wrap.querySelector('.w-form-fail');
  var botao = form.querySelector('input[type="submit"]');
  var rotulo = botao ? botao.value : '';

  function mostrar(el) { if (el) el.style.display = 'block'; }
  function esconder(el) { if (el) el.style.display = 'none'; }

  document.addEventListener('submit', function (ev) {
    if (ev.target !== form) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (!form.reportValidity()) return;
    esconder(falha);
    if (botao) { botao.value = botao.getAttribute('data-wait') || 'Enviando...'; botao.disabled = true; }

    var dados = {
      _subject: 'Talos — novo contato pelo site',
      _template: 'table',
      _captcha: 'false',
      nome: form.Name.value,
      empresa: form.Company.value,
      email: form.Email.value,
      mensagem: form['Share-project-details'].value,
      origem: location.href
    };

    fetch(END, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) {
        if (j && String(j.success) === 'true') {
          esconder(form); mostrar(ok);
        } else {
          throw new Error(j && j.message ? j.message : 'falha no envio');
        }
      })
      .catch(function () {
        /* Nada se perde: leva o que ele digitou para o WhatsApp em vez de sumir. */
        mostrar(falha);
        var t = 'Ola! Vim pelo site da Talos.\\n\\nNome: ' + form.Name.value +
                '\\nEmpresa: ' + form.Company.value +
                '\\nE-mail: ' + form.Email.value +
                '\\n\\n' + form['Share-project-details'].value;
        var a = falha && falha.querySelector('a.tl-wa-fallback');
        if (falha && !a) {
          a = document.createElement('a');
          a.className = 'tl-wa-fallback';
          a.style.cssText = 'display:inline-block;margin-top:10px;text-decoration:underline;color:inherit';
          a.target = '_blank'; a.rel = 'noopener';
          a.textContent = 'Mandar isso pelo WhatsApp';
          falha.appendChild(a);
        }
        if (a) a.href = 'https://wa.me/' + FONE + '?text=' + encodeURIComponent(t);
      })
      .then(function () {
        if (botao) { botao.value = rotulo; botao.disabled = false; }
      });
  }, true);
})();
</script>
""".replace("%FONE%", FONE).replace("%EU%", EMAIL_U).replace("%ED%", EMAIL_D)

if 'id="tl-form"' in h:
    h = re.sub(r'<script id="tl-form">.*?</script>', JS.strip(), h, flags=re.S)
    log.append("handler do form atualizado")
else:
    h = h.replace("</body>", JS + "</body>", 1)
    log.append("handler proprio do form instalado (intercepta na captura, entrega por fetch)")

open(P, "w", encoding="utf-8").write(h)
print("\n".join("  " + x for x in log))
print()
print(f"  WhatsApp: +{FONE}   |   destino do form: {EMAIL_U}@{EMAIL_D} (montado em JS)")

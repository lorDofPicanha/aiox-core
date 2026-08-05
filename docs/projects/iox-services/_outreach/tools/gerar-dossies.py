# -*- coding: utf-8 -*-
"""Gera um dossie por construtora com os 3 e-mails ja personalizados a partir do
contrato real dela no PNCP.

Nada aqui envia nada. A saida e um markdown para o founder revisar e disparar na mao
(cold-outreach-v2-RDO.md: "Envio 100% humano, nenhum disparo automatico").
"""
import json, os, re, textwrap, unicodedata, datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRADA = os.path.join(BASE, "construtoras-enriquecidas-v2.json")
SAIDA = os.path.join(BASE, "dossies-construtoras-RDO.md")

SUFIXOS = re.compile(
    r"\s+(ltda|epp|me|eireli|s[/.]?a|sa|-?\s*ir\s*[\d,.%]+|em recuperacao judicial)\b\.?",
    re.I)


def normal(s):
    s = unicodedata.normalize("NFKD", (s or ""))
    return "".join(c for c in s if not unicodedata.combining(c))


MINUSC = {"e", "de", "da", "do", "das", "dos", "em", "para", "com"}


def bonito(txt):
    """Title case que respeita conectivo em minuscula e mantem sigla curta em caixa alta."""
    saida = []
    for i, p in enumerate(txt.split()):
        pl = p.lower()
        if i and pl in MINUSC:
            saida.append(pl)
        elif p.isupper() and (len(p) <= 2 or (i == 0 and len(p) <= 3)):
            saida.append(p)          # MG, SC, JR, LH · e MLC/GRS/CCT no inicio do nome.
            # 3 letras fora da 1a posicao costuma ser palavra, nao sigla ("LUZ", "SUL").
        elif any(c.isdigit() for c in p):
            saida.append(p.upper())  # R3, EMUO-020
        else:
            saida.append(p.capitalize())
    return " ".join(saida)


def nome_curto(razao, alternativo=None):
    # prefere a grafia que preservou acento (o PNCP costuma ter; a Receita nem sempre)
    if alternativo and not re.search(r"[À-ÿ]", razao or "") and re.search(r"[À-ÿ]", alternativo):
        razao = alternativo
    n = SUFIXOS.sub("", razao or "").strip(" .-,")
    n = re.sub(r"\s{2,}", " ", n)
    return bonito(n)


def pessoa_fisica(s):
    """Socio pessoa juridica tem faixa etaria 'Nao se aplica' e CNPJ de 14 digitos.
    Tratar holding como decisor manda 'Alpes, tudo bem?' — spam instantaneo."""
    faixa = normal(s.get("faixa_etaria") or "").lower()
    doc = (s.get("cnpj_cpf_do_socio") or s.get("doc") or "")
    if "nao se aplica" in faixa:
        return False
    if re.fullmatch(r"\d{14}", doc.strip()):
        return False
    return True


def primeiro_nome(socios):
    fisicas = [s for s in (socios or []) if pessoa_fisica(s)]
    # quem administra vem antes de quem so participa
    fisicas.sort(key=lambda s: 0 if "administrador" in normal(s.get("qualificacao") or "").lower() else 1)
    for s in fisicas:
        partes = [p for p in (s.get("nome") or "").split() if len(p) > 1]
        if partes:
            return partes[0].capitalize()
    return None


LOCAL = re.compile(r"\b(RUA|AVENIDA|RODOVIA|ESTRADA|TRAVESSA|SERVID[ÃA]O)\s+([A-ZÀ-Ú0-9][^,;.]{3,40})", re.I)
MUNI = re.compile(r"MUNIC[ÍI]PIO DE\s+([A-ZÀ-Ú][^,;./]{2,30})", re.I)
TIPO = [("pavimenta", "pavimentação"), ("revitaliza", "revitalização"),
        ("drenagem", "drenagem"), ("terraplan", "terraplanagem"),
        ("reforma", "reforma"), ("amplia", "ampliação"),
        ("constru", "construção"), ("recapea", "recapeamento"),
        ("calcam", "calçamento"), ("saneamento", "saneamento"), ("ponte", "ponte")]


def limpa_local(bruto):
    """Corta o nome do logradouro num limite legivel, sem partir palavra.
    O objeto do PNCP encadeia varios ('RODOVIA X E RODOVIA Y ...'): fica so o primeiro."""
    t = re.split(r"\s+E\s+(?:RODOVIA|RUA|AVENIDA|ESTRADA|TRAVESSA)\b", bruto, 1, re.I)[0]
    t = re.split(r"\s+(?:NO|NA|EM|DO|DA)\s+MUNIC[ÍI]PIO\b", t, 1, re.I)[0]
    t = t.strip(" ,;.-–")
    if len(t) > 34:                       # corta em espaco, nunca no meio da palavra
        corte = t[:34].rsplit(" ", 1)[0]
        t = corte if len(corte) >= 12 else t[:34]
    # o corte costuma deixar conectivo pendurado: "... Trecho 1 da" / "... Fernandes e"
    t = re.sub(r"\s+(?:e|de|da|do|das|dos|em|no|na|-|–)$", "", t.strip(), flags=re.I)
    return bonito(t)


def referencia(objetos, municipios):
    """Uma frase curta e verificavel sobre UM contrato real."""
    for o in objetos or []:
        on = normal(o).lower()
        tipo = next((rot for chave, rot in TIPO if chave in on), None)
        m = LOCAL.search(o)
        mu = MUNI.search(o)
        local = None
        if m:
            alvo = limpa_local(m.group(2))
            if alvo:
                local = f"{m.group(1).lower()} {alvo}"
        cidade = (bonito(mu.group(1).strip()) if mu else
                  (municipios[0] if municipios else None))
        if tipo and local and cidade:
            return f"Uma delas é a {tipo} da {local}, em {cidade}."
        if tipo and cidade:
            return f"Uma delas é de {tipo} em {cidade}."
    if municipios:
        return f"A mais recente em {municipios[0]}."
    return ""


def escolhe_porta(c):
    cid = len(c.get("municipios") or [])
    if cid >= 3:
        return ("descubro tarde",
                "quando uma frente atrasa numa das cidades, você fica sabendo em quanto tempo?")
    if c.get("wins", 0) >= 8:
        return ("não consigo contratar",
                "você tem achado gente pra montar esse controle, ou está sobrando pro engenheiro?")
    return ("meu cliente cobra",
            "quem monta a medição e o diário, e o que acontece se atrasa?")


LIVRES = {"gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br", "yahoo.com",
          "bol.com.br", "uol.com.br", "terra.com.br", "live.com", "ig.com.br",
          "globo.com", "icloud.com", "msn.com", "outlook.com.br", "hotmail.com.br"}


def reclassifica(email):
    """Reclassifica com regra mais larga que a do enriquecimento: escritorio contabil
    aparece como 'andradecont.com.br', que nao casa com 'contab'. E-mail do contador
    nao e o decisor — ele repassa (ou nao) e a mensagem morre no caminho."""
    if not email:
        return "sem e-mail"
    dom = email.split("@")[-1].lower()
    raiz = dom.split(".")[0]
    if dom.endswith(".gov.br"):
        return "órgão público"
    if dom in LIVRES:
        return "pessoal (provedor livre)"
    if (re.search(r"contab|contad|escritorio|assessoria|fiscal|tribut", dom)
            or raiz.endswith("cont") or raiz.endswith("conta")):
        return "provável contador"
    return "corporativo"


def ente_publico(c):
    """Consorcio intermunicipal e autarquia aparecem como fornecedor no PNCP, mas nao sao
    comprador privado: venda para eles passa por licitacao. Fora desta lista."""
    email = (c.get("email_receita") or "").lower()
    nome = normal(c.get("razao_social") or c.get("name") or "").lower()
    return (email.endswith(".gov.br") or ".gov.br" in email
            or "consorcio" in nome or "intermunicipal" in nome
            or "autarquia" in nome or "prefeitura" in nome)


PRIOR = {"corporativo": 0, "provável contador": 1, "provavel contador": 1,
         "pessoal (provedor livre)": 2, "sem e-mail": 3}

d = json.load(open(ENTRADA, encoding="utf-8"))
todas = d["construtoras"]

def _janela():
    """Le a janela real dos extratos do PNCP. Cravar 'jun-jul' no texto ja ficou errado
    assim que a extracao passou a cobrir 6 meses — e esse rotulo vai pra ligacao."""
    import glob
    ini, fim = None, None
    for f in glob.glob(os.path.join(BASE, "*.json")):
        try:
            j = json.load(open(f, encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(j, dict) or "suppliers" not in j:
            continue
        a_, b_ = str(j.get("from") or ""), str(j.get("to") or "")
        if len(a_) == 8:
            ini = a_ if not ini else min(ini, a_)
        if len(b_) == 8:
            fim = b_ if not fim else max(fim, b_)
    if not ini or not fim:
        return "PNCP"
    MES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"]
    return f"{MES[int(ini[4:6])-1]}–{MES[int(fim[4:6])-1]}/{fim[2:4]}"

JANELA = _janela()
for c in todas:
    c["email_tipo"] = reclassifica(c.get("email_receita") or "")
publicos = [c for c in todas if ente_publico(c)]
cs = [c for c in todas if not ente_publico(c)]
if publicos:
    print(f"excluidos por serem ente publico: {len(publicos)}")
    for c in publicos:
        print(f"   {c.get('razao_social') or c['name']}  ({c.get('email_receita','')})")
cs.sort(key=lambda c: (PRIOR.get(c.get("email_tipo", "sem e-mail"), 4), -c.get("totalBRL", 0)))

out = []
out.append("# Dossiês — construtoras de obra pública (produto: RDO Conversacional)\n")
out.append(f"**Gerado:** {datetime.date.today().isoformat()} · "
           f"**Copy:** `cold-outreach-v2-RDO.md` · **Produto:** `DECISAO-PRODUTO-v1.md`\n")
out.append("> 🔴 **Envio 100% humano.** Nada aqui dispara sozinho. Revisar cada peça antes de enviar.\n")
out.append("> 🔴 Preencher `{seu_nome}` e `{telefone}` antes do primeiro disparo.\n")
out.append(f"> **Origem do dado (LGPD art. 7º IX):** contratos públicos do PNCP, "
           f"{JANELA}, UF SC + Receita Federal (dados públicos).\n")

por_tipo = {}
for c in cs:
    por_tipo.setdefault(c.get("email_tipo", "?"), []).append(c)
out.append("\n## Resumo\n")
out.append("| Classificação do e-mail | Empresas | Disparar? |")
out.append("|---|---|---|")
regra = {"corporativo": "✅ sim", "pessoal (provedor livre)": "🔴 não — buscar canal profissional",
         "provável contador": "🟡 avaliar", "sem e-mail": "🔴 não tem — usar telefone/LinkedIn"}
for k, v in sorted(por_tipo.items(), key=lambda x: PRIOR.get(x[0], 4)):
    out.append(f"| {k} | {len(v)} | {regra.get(k, '?')} |")
out.append("")

for i, c in enumerate(cs, 1):
    nome = nome_curto(c.get("razao_social") or c["name"], c.get("name"))
    pn = primeiro_nome(c.get("socios"))
    cidades = c.get("municipios") or []
    lista_cidades = (", ".join(cidades[:-1]) + " e " + cidades[-1]) if len(cidades) > 1 else (cidades[0] if cidades else "—")
    ref = referencia(c.get("objetos"), cidades)
    porta, pergunta = escolhe_porta(c)
    email = c.get("email_receita") or ""
    tipo = c.get("email_tipo", "sem e-mail")
    tels = c.get("telefones") or ([c["telefone"]] if c.get("telefone") else [])

    out.append(f"\n---\n\n## {i}. {nome}\n")
    out.append("| | |")
    out.append("|---|---|")
    out.append(f"| **CNPJ** | `{c['cnpj']}` |")
    out.append(f"| **Contratos ({JANELA})** | {c.get('wins')} · R$ {c.get('totalBRL',0)/1e6:,.2f} mi |")
    out.append(f"| **Cidades** | {lista_cidades} |")
    out.append(f"| **Porte / situação** | {c.get('porte','?')} · {c.get('situacao','?')} |")
    out.append(f"| **Decisor** | {pn or '🔴 sem nome de sócio'} "
               f"{'· ' + '; '.join(s['nome'] for s in c.get('socios',[])[:3]) if c.get('socios') else ''} |")
    out.append(f"| **E-mail** | {email or '—'} — **{tipo}** |")
    out.append(f"| **Telefone** | {' · '.join(tels) if tels else '—'} |")
    out.append(f"| **Porta escolhida** | {porta} |")
    if tipo != "corporativo":
        out.append(f"\n> 🔴 **Não disparar para este e-mail.** Classificado como *{tipo}* — "
                   "ver `cold-outreach-v2-RDO.md` §9. Buscar contato profissional antes.\n")
    if not pn:
        out.append("\n> 🔴 **Sem nome de sócio na Receita.** Sem `{primeiro_nome}` real, "
                   "não enviar — abertura genérica vira spam.\n")

    saud = pn or "{primeiro_nome}"
    out.append(f"\n**E-mail 1** — assunto: `medição de {c.get('wins')} obras em "
               f"{len(cidades)} cidade{'s' if len(cidades)!=1 else ''}`\n")
    out.append("```")
    out.append(f"{saud}, tudo bem?")
    out.append("")
    out.append("Sou o {seu_nome}, da Talos. Construo sistemas de IA pra dentro de")
    out.append("operação — não sou consultor de slide.")
    out.append("")
    corpo = (f"Olhando os contratos publicados no PNCP, a {nome} está com "
             f"{c.get('wins')} obras em {lista_cidades}. {ref}")
    out.extend(textwrap.wrap(corpo, 66))
    out.append("")
    out.append("Em obra pública o diário e a medição mensal não são opcionais: são")
    out.append("o que destrava o pagamento. E na maioria das construtoras desse")
    out.append("porte quem monta esse relatório é uma pessoa só, no fim do mês,")
    out.append("juntando foto de WhatsApp com anotação de caderno.")
    out.append("")
    out.extend(textwrap.wrap(f"Minha pergunta é direta: hoje, {pergunta}", 66))
    out.append("")
    out.append("Não vou te prometer percentual nenhum — não conheço a operação de")
    out.append("vocês. Mas se quiser, eu te mostro em 3 linhas como eu levantaria")
    out.append("esse número aí dentro. Sem apresentação e sem compromisso.")
    out.append("")
    out.append("Faz sentido?")
    out.append("")
    out.append("{seu_nome}")
    out.append("{telefone}")
    out.append("```")
    out.append(f"\n**E-mail 2 (D+4)** e **E-mail 3 (D+10)**: usar os modelos §5 e §6 do "
               f"`cold-outreach-v2-RDO.md`, trocando `{{primeiro_nome}}` por **{saud}**.\n")

    # Telefone e o unico canal liberado antes do dominio aquecer (2-3 semanas).
    # WhatsApp frio esta proibido: Cloud API exige opt-in e disparo frio derruba o numero.
    if tels:
        primario = "📞 **CANAL PRIMÁRIO**" if tipo != "corporativo" else "📞 alternativa"
        out.append(f"\n**Roteiro de ligação** — {primario} · {' · '.join(tels)}\n")
        out.append("```")
        out.append(f"[se atender a recepção]")
        out.extend(textwrap.wrap(
            f"Oi, tudo bem? Queria falar com o {saud}, por favor. É sobre o controle "
            "das obras de vocês — ele vai saber. Meu nome é {seu_nome}.", 66))
        out.append("")
        out.append(f"[com o {saud}]")
        out.append(f"{saud}, {{seu_nome}}. Tem um minuto? Se não for hora eu ligo depois.")
        out.append("")
        out.extend(textwrap.wrap(
            f"Vi nos contratos publicados no PNCP que vocês estão com "
            f"{c.get('wins')} obras em {lista_cidades}.", 66))
        out.append("")
        out.extend(textwrap.wrap(f"Minha pergunta é uma só: hoje, {pergunta}", 66))
        out.append("")
        out.append("[ouvir. não emendar pitch.]")
        out.append("")
        out.append("Perguntei porque eu construo sistema que monta esse relatório a")
        out.append("partir de foto e áudio que o mestre já manda no WhatsApp. Não")
        out.append("vou te prometer número nenhum — não conheço a operação de vocês.")
        out.append("")
        out.append("Faço o seguinte: me manda o material bruto de UMA obra de um mês,")
        out.append("do jeito que estiver, e eu te devolvo o relatório pronto. De")
        out.append("graça. Se não servir, você me fala e a gente encerra.")
        out.append("")
        out.append("Posso te mandar por onde — e-mail ou WhatsApp?")
        out.append("```")
        out.append("\n> Depois do 'pode mandar', o WhatsApp está liberado (opt-in dado na ligação). "
                   "Antes disso, não.\n")

open(SAIDA, "w", encoding="utf-8").write("\n".join(out))
print(f"dossies gerados: {len(cs)}")
for k, v in sorted(por_tipo.items(), key=lambda x: PRIOR.get(x[0], 4)):
    print(f"   {len(v):3d}  {k}")
print(f"\nsalvo: {SAIDA}")

# traduzir-imagens.py — repinta o texto em inglês cravado em pixel nas ilustrações do
# template Conicorn, usando a própria fonte Geist que veio no fork.
#
# Por que existe: o founder apontou em 02/Ago que "muitas imagens ainda estão em inglês".
# Não é texto de HTML — está dentro do PNG. Só três imagens têm texto: Cap2 (balões de
# chat), Cap3 (rótulo do gráfico) e Cap4 (cartão de contato). Cap1 e Cap5 são neutras.
#
# Método: o miolo dos balões é COR CHAPADA (medido: #525252 no escuro, #ffffff no claro),
# então dá para preencher a caixa do texto e reescrever, sem reconstruir gradiente.
# O corpo da fonte é ajustado por busca para a largura renderizada bater com o original —
# assim o texto ocupa o mesmo espaço e o layout não desloca.
#
# Uso: python traduzir-imagens.cjs.py          (roda a partir de 05-build/)
#      Rodar DEPOIS de fork-talos.cjs, que recria a pasta.

from PIL import Image, ImageDraw, ImageFont
import os, sys

IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'talos-site', 'assets', 'img')
FONTES = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'talos-site', 'assets', 'fonts')

REG = os.path.join(FONTES, '69abbcf306b3cfc08aeaf20d_Geist-Regular.ttf')
MED = os.path.join(FONTES, '69abbcf3b9d1a5952a9496e5_Geist-Medium.ttf')
SEMI = os.path.join(FONTES, '69abbcf3e497e6345c29999a_Geist-SemiBold.ttf')

rel = []


def ajustar(texto, caminho_fonte, largura_alvo, teto=64):
    """Acha o corpo de fonte cuja largura renderizada mais se aproxima do original."""
    melhor, melhor_dif = 12, 10**9
    for tam in range(8, teto):
        f = ImageFont.truetype(caminho_fonte, tam)
        w = f.getbbox(texto)[2] - f.getbbox(texto)[0]
        d = abs(w - largura_alvo)
        if d < melhor_dif:
            melhor, melhor_dif = tam, d
    return ImageFont.truetype(caminho_fonte, melhor)


def escrever(dr, xy, texto, fonte, cor, ancora='ls'):
    dr.text(xy, texto, font=fonte, fill=cor, anchor=ancora)


# ── CAP2 — balões de chat ────────────────────────────────────────────────────
def cap2():
    p = os.path.join(IMG, '69ad5041ea93e995c9064911_Cap2.png')
    im = Image.open(p).convert('RGBA')
    dr = ImageDraw.Draw(im)

    # Geometria medida no original:
    #   balão escuro x 90-561 y 100-179 · balão branco x 94-515 y 194-273 · raio ~26px
    # O preenchimento fica na FAIXA CENTRAL de cada balão, longe dos cantos arredondados —
    # o miolo é cor chapada, então repintar ali não deixa emenda. Encostar no canto come
    # o arredondamento (já aconteceu uma vez nesta sessão).
    ESCURO = (82, 82, 82, 255)      # medido no miolo do balão

    # A conversa tem que fazer sentido lida de cima para baixo: o balão escuro é o CLIENTE
    # (avatar de pessoa à direita) e o branco é a MÁQUINA respondendo (ícone à esquerda).
    # Na 1ª versão eu tinha posto uma saudação embaixo da pergunta — o atendimento
    # cumprimentava depois de ser perguntado. Agora é pergunta → resposta.

    # 1) balão escuro — pergunta do cliente. Texto original x115-535 y130-153
    dr.rectangle([112, 126, 540, 158], fill=ESCURO)
    t1 = 'Qual o prazo de entrega do meu pedido?'
    f1 = ajustar(t1, REG, 535 - 115)
    escrever(dr, (115, 151), t1, f1, (255, 255, 255, 255))

    # 2) balão branco — resposta da máquina. Texto original x119-488 y224-247
    dr.rectangle([116, 220, 492, 252], fill=(255, 255, 255, 255))
    t2 = 'Chega quinta. Quer o rastreio?'
    f2 = ajustar(t2, REG, 488 - 119)
    escrever(dr, (119, 245), t2, f2, (26, 26, 26, 255))

    im.save(p)
    rel.append(f'Cap2  balões: "{t1}" / "{t2}"  (fonte {f1.size}/{f2.size}px)')


# ── CAP3 — rótulo do gráfico ─────────────────────────────────────────────────
def cap3():
    p = os.path.join(IMG, '69ad504197f79fd83b9978e2_Cap3.png')
    im = Image.open(p).convert('RGBA')
    dr = ImageDraw.Draw(im)

    # apaga a pílula antiga (x419-620 y60-98) deixando transparente
    dr.rectangle([415, 56, 624, 102], fill=(0, 0, 0, 0))

    rotulo, valor = 'Vendas:', '10 mil'
    fr = ImageFont.truetype(REG, 24)
    fv = ImageFont.truetype(SEMI, 24)
    wr = fr.getbbox(rotulo)[2] - fr.getbbox(rotulo)[0]
    wv = fv.getbbox(valor)[2] - fv.getbbox(valor)[0]
    pad_x, gap = 22, 12
    larg = pad_x * 2 + wr + gap + wv
    x1, y0, y1 = 620, 60, 98
    x0 = x1 - larg
    dr.rounded_rectangle([x0, y0, x1, y1], radius=(y1 - y0) // 2, fill=(255, 255, 255, 255))
    meio = (y0 + y1) // 2
    escrever(dr, (x0 + pad_x, meio), rotulo, fr, (125, 125, 125, 255), ancora='lm')
    escrever(dr, (x0 + pad_x + wr + gap, meio), valor, fv, (55, 55, 55, 255), ancora='lm')

    im.save(p)
    rel.append(f'Cap3  gráfico: "{rotulo} {valor}"  (pílula {larg}px, alinhada à direita como o original)')


# ── CAP4 — cartão de contato ─────────────────────────────────────────────────
def cap4():
    """Cartão de contato. Tem texto em DOIS planos: o cartão da frente (nítido) e quatro
    cartões de fundo esmaecidos com nomes em inglês (Ethan, Samantha, Bennett, Carter).
    Os de trás são parcialmente cobertos pelo cartão da frente — por isso o truque de
    guardar a faixa da frente, pintar o fundo à vontade e recolar a frente por cima."""
    p = os.path.join(IMG, '69ad5041e96214864aa8b126_Cap4.png')
    im = Image.open(p).convert('RGBA')
    dr = ImageDraw.Draw(im)

    # ── plano da frente ──────────────────────────────────────────────────────
    dr.rectangle([210, 158, 446, 196], fill=(255, 255, 255, 255))
    nome = 'Contato novo'
    fn = ajustar(nome, MED, 398 - 200)
    # centro do CARTÃO (x206-449), não do texto antigo. Eu vinha usando o meio do bbox do
    # "Liam Foster" (299), que era menor que o cartão — o nome ficava puxado para a esquerda.
    escrever(dr, ((206 + 449) // 2, 188), nome, fn, (26, 26, 26, 255), ancora='ms')

    px0, py0, px1, py1 = 258, 236, 398, 274
    dr.rounded_rectangle([px0, py0, px1, py1], radius=(py1 - py0) // 2, fill=(232, 246, 238, 255))
    rot = 'Qualificado'
    fq = ajustar(rot, MED, 382 - 272 - 14)
    cyq = (py0 + py1) // 2
    dr.ellipse([px0 + 16, cyq - 4, px0 + 24, cyq + 4], fill=(31, 143, 90, 255))
    escrever(dr, (px0 + 32, cyq), rot, fq, (24, 122, 76, 255), ancora='lm')

    # Guarda a faixa do cartão da frente (medido: x206-449). A faixa tem que ser JUSTA:
    # com folga de 6px ela recolava fundo original por cima do que eu tinha traduzido, e
    # ressuscitava a farpa do "Bennett" ao lado do "Beatriz".
    FRENTE = (205, 0, 451, im.size[1])
    frente = im.crop(FRENTE).copy()

    # ── plano de fundo — nomes esmaecidos ────────────────────────────────────
    px = im.load()

    def apagar(x0, y0, x1, y1, y_limpa):
        """Cobre a faixa do texto replicando uma LINHA LIMPA do mesmo cartão.
        Pintar com cor média deixa remendo visível — os cartões têm gradiente e
        transparência própria. Copiar a linha real preserva os dois."""
        linha = im.crop((x0, y_limpa, x1, y_limpa + 1))
        for y in range(y0, y1):
            im.paste(linha, (x0, y))

    def cor_texto(x0, y0, x1, y1):
        cand = [px[x, y][:3] for x in range(x0, x1) for y in range(y0, y1) if px[x, y][3] > 60]
        cand.sort(key=lambda c: sum(c))
        return cand[len(cand) // 20] + (255,) if cand else (150, 150, 150, 255)

    # (x0, x1, y0, y1, y_limpa, largura_alvo, nome) — a faixa apagada é mais larga que o
    # texto medido porque os nomes originais eram maiores e deixavam farpas nas bordas.
    FUNDO = [
        (58, 116, 168, 190, 197, 42, 'Marina'),
        (118, 205, 170, 196, 200, 67, 'Eduardo'),
        (452, 527, 172, 196, 201, 54, 'Beatriz'),
        (538, 600, 169, 190, 197, 41, 'Camila'),
    ]
    for x0, x1, y0, y1, ylimpa, alvo, novo in FUNDO:
        tinta = cor_texto(x0, y0, x1, y1)
        apagar(x0, y0, x1, y1, ylimpa)
        f = ajustar(novo, MED, alvo)
        escrever(dr, (x0 + 8, y1 - 4), novo, f, tinta)

    # pílulas de fundo com inglês cortado ("Exc", "llent", "air"): some o texto, fica o chip.
    for x0, x1, y0, y1, ylimpa in [(72, 116, 204, 224, 199), (452, 476, 215, 236, 240),
                                   (538, 580, 204, 224, 199),
                                   (160, 205, 210, 238, 203)]:   # pílula rosa do 2º cartão ("F" de Fair)
        apagar(x0, y0, x1, y1, ylimpa)

    # recola a frente — restaura a oclusão exatamente como era
    im.paste(frente, FRENTE)

    im.save(p)
    rel.append(f'Cap4  frente: "{nome}" / "{rot}" · fundo: Marina, Eduardo, Beatriz, Camila')


# ── LOGO DO RODAPÉ — o wordmark gigante ──────────────────────────────────────
def logo_rodape():
    """O rodapé fecha a página com um wordmark enorme: [símbolo estrela] + 'Conicorn'.
    É imagem, não texto — por isso passou por todas as varreduras de tradução.

    O founder pediu explicitamente para MANTER o símbolo e a mesma tipografia, trocando só
    a palavra. Medido no arquivo original: o desenho é branco puro (255,255,255) com
    GRADIENTE DE OPACIDADE — alfa ~200 no topo do texto caindo para ~25 na base. Não é
    gradiente de cor; pintar cinza chapado erraria o efeito.
    Símbolo ocupa x 0-119; o texto começa depois do vão em x≈132.
    """
    p = os.path.join(IMG, '69b0b9ed30b3db9a0f666b2b_logofooter.png')
    if not os.path.exists(p):
        rel.append('⚠ logo do rodapé não encontrado — pulei')
        return
    orig = Image.open(p).convert('RGBA')
    L, A = orig.size                      # 535 × 120

    im = Image.new('RGBA', (L, A), (0, 0, 0, 0))
    im.paste(orig.crop((0, 0, 126, A)), (0, 0))     # símbolo preservado como está

    X0, TOPO, BASE = 138, 16, 92          # caixa do texto, medida no original
    palavra = 'Talos'
    alvo_larg = L - X0 - 6
    f = ajustar(palavra, SEMI, alvo_larg, teto=140)

    # camada só do texto, branca e opaca
    camada = Image.new('RGBA', (L, A), (0, 0, 0, 0))
    ImageDraw.Draw(camada).text((X0, BASE), palavra, font=f, fill=(255, 255, 255, 255), anchor='ls')

    # rampa vertical de opacidade, como no original
    alfa = camada.split()[3].load()
    for y in range(A):
        t = (y - TOPO) / float(BASE - TOPO)
        t = 0.0 if t < 0 else (1.0 if t > 1 else t)
        fator = (205 - (205 - 25) * t) / 255.0
        for x in range(X0 - 4, L):
            v = alfa[x, y]
            if v:
                alfa[x, y] = int(v * fator)

    im.alpha_composite(camada)
    im.save(p)
    rel.append(f'Logo do rodapé: símbolo mantido + "Talos" (Geist SemiBold {f.size}px, rampa de opacidade 205→25)')


if __name__ == '__main__':
    faltando = [f for f in (REG, MED, SEMI) if not os.path.exists(f)]
    if faltando:
        print('ERRO: fonte Geist não encontrada — rode fork-talos.cjs antes.')
        for f in faltando:
            print('  falta', f)
        sys.exit(1)
    cap2(); cap3(); cap4(); logo_rodape()
    for l in rel:
        print('  ' + l)
    print('\n  Cap1 e Cap5 não têm texto — não foram tocadas.')

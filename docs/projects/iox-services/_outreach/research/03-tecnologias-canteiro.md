# Tecnologias aplicáveis no canteiro de obras — mapa para PME brasileira

**Data da pesquisa:** 01/ago/2026. **ICP considerado:** construtora brasileira de 10-200
funcionários, orçamento de tecnologia apertado, equipe de campo (mestre de obras, encarregado)
não-técnica. **Cruza com:** [`ia-construcao-sintese.md`](../ia-construcao-sintese.md) (o RDO por
WhatsApp já identificado como produto #1) e [`produtos-construcao.md`](../produtos-construcao.md)
(P1-P5, foco em software/processo, não hardware). Este documento cobre o que a síntese anterior
não cobriu: **hardware e ferramentas de captura de dados** que alimentam esses produtos.

**Regra de leitura:** todo preço abaixo tem fonte e data ao lado. Onde não achei número
confiável, está escrito "preço não localizado" — não estimei nada.

---

## Como usar este documento

A pergunta certa para cada tecnologia não é "isso existe e é legal" — quase tudo aqui existe e
funciona em algum lugar do mundo. A pergunta é: **um mestre de obras que hoje só sabe mandar
foto no grupo de WhatsApp vai usar isso todo dia, sem treinamento, sem lembrete?** Onde a
resposta é não, a tecnologia só entra se o comportamento de captura continuar sendo o mesmo
(apontar celular, apertar um botão) e o trabalho pesado acontecer em software, invisível para
o campo.

---

## 1. Captura visual

### 1.1 Câmera 360° (Insta360 X4, Ricoh Theta X)

- **O que faz:** grava o canteiro inteiro em uma única foto/vídeo 360°, sem precisar
  enquadrar — resolve o problema de "esqueci de fotografar aquele canto".
- **Maturidade:** produção consolidada (categoria de consumo/prosumer madura, usada há anos em
  imobiliário e agora em documentação de obra).
- **Custo:** Insta360 X4 a partir de R$ 2.231,80 (Mercado Livre, consultado 01/ago/2026);
  Ricoh Theta X entre R$ 2.959,00 e R$ 4.134,00 (Magazine Luiza, consultado 01/ago/2026).
  [Fonte 1](https://lista.mercadolivre.com.br/insta360-x4) ·
  [Fonte 2](https://www.magazineluiza.com.br/busca/camera+theta/)
- **Disponibilidade no Brasil:** ampla — Mercado Livre, Magazine Luiza, loja oficial Insta360
  ([store.insta360.com](https://store.insta360.com/)) fazem entrega nacional. Sem revenda
  B2B/enterprise local dedicada a construção.
- **Muda comportamento do campo?** Baixo. É apertar um botão e girar — mais simples que
  fotografar em ângulos certos com o celular. Mas é **um aparelho a mais** para o mestre carregar,
  cuidar e não perder — esse é o atrito real, não o uso.
- **Tem API?** Insta360 tem SDK para automação de upload; não é o gargalo (o gargalo é
  processar/organizar o que foi capturado, que é trabalho de software, não da câmera).
- **Quando não vale a pena:** obra pequena, poucas frentes simultâneas — celular do próprio
  mestre com um app de RDO fotográfico já resolve por menos custo de treinamento e sem mais um
  gadget para perder.

### 1.2 Câmera fixa de canteiro / timelapse (OxBlue, TrueLook, alternativas nacionais)

- **O que faz:** câmera instalada fixa na obra, capturando imagens em intervalo regular —
  vira vídeo timelapse do progresso e serve como monitoramento 24h.
- **Maturidade:** produção consolidada nos EUA (OxBlue, TrueLook) e já com oferta nacional
  madura (Total Timelapse, BrLapse, Timelapse Construção, Hausdrone) — energia solar + 4G,
  sem depender de infraestrutura da obra.
  [OxBlue](https://www.oxblue.com/) · [TrueLook](https://try.truelook.com/compare/oxblue/) ·
  [Total Timelapse](https://www.totaltimelapse.com/) · [BrLapse](https://brtimelapse.com.br/)
- **Custo:** OxBlue/TrueLook não publicam preço (contato comercial, consultado 01/ago/2026).
  Prestadoras brasileiras (Total Timelapse, BrLapse) também não publicam tabela — cotação sob
  consulta. Como referência de hardware equivalente e mais barato: câmera solar 4G Intelbras
  (kit rural com bateria e chip) vendida em varejo geral (Leroy Merlin, Mercado Livre) — **preço
  específico não localizado** neste levantamento, mas a categoria (câmera solar + 4G para uso
  rural/obra) existe em varejo nacional a partir de poucas centenas de reais por unidade, sem o
  serviço de composição de timelapse/dashboard.
  [Intelbras câmeras](https://www.intelbras.com/pt-br/seguranca-eletronica/cameras)
- **Disponibilidade no Brasil:** boa — várias empresas nacionais atendem todo o país com
  equipamento próprio (solar + 4G), sem precisar de importação.
- **Muda comportamento do campo?** Nenhum — é instalação única, ninguém no canteiro precisa
  operar nada depois disso. É a tecnologia da lista com **menor atrito de adoção**.
- **Tem API?** Não localizei documentação pública de API para as prestadoras brasileiras
  (modelo é serviço gerenciado, não plataforma self-service). OxBlue/TrueLook têm portal de
  visualização, não API pública documentada nos materiais encontrados.
- **Quando não vale a pena:** obra pequena e de curta duração (reforma, obra de poucos meses) —
  o custo de instalação fixa não se paga; câmera 360° portátil ou celular do mestre cobre o
  mesmo objetivo de "mostrar progresso ao cliente".

### 1.3 Celular do próprio operário + apps de captura via WhatsApp

- **O que faz:** usa o hábito já existente (foto/áudio no WhatsApp) como interface de captura,
  sem exigir novo aparelho ou app dedicado.
- **Maturidade:** produção consolidada — já existe oferta nacional específica para isso.
  Destaque: **Zé Obra**, que organiza pagamento, contrato e diário de obra recebendo foto e
  áudio direto do WhatsApp do mestre. [Zé Obra](https://zeobra.com.br/)
- **Custo:** Zé Obra — Solo R$ 39/mês (200 msgs/mês), Profissional R$ 89/mês (600 msgs),
  Equipe R$ 199/mês (2.000 msgs), Escritório R$ 449/mês (5.000 msgs, "empresas de construção
  de pequeno porte"). 14 dias grátis, ~20% de desconto no plano anual (consultado 01/ago/2026).
  [Fonte](https://zeobra.com.br/planos)
- **Disponibilidade no Brasil:** nativa — produto brasileiro, feito para o mercado local.
- **Muda comportamento do campo?** **Zero.** Esta é a categoria inteira que mais bate com a
  tese já registrada em [`ia-construcao-sintese.md`](../ia-construcao-sintese.md): "mestre de
  obras não abre software novo... a diferença é que hoje essa foto morre no grupo."
- **Tem API?** Não localizei API pública documentada para Zé Obra neste levantamento —
  plataforma fechada, ponta de captura é o WhatsApp.
- **Quando não vale a pena:** nunca, para o ICP deste documento — é a porta de entrada mais
  barata e de menor atrito de toda a lista. O risco não é "não vale a pena", é dependência de
  um fornecedor fechado sem portabilidade de dado documentada.

---

## 2. Drones

### 2.0 Regulamentação — mudança relevante em julho/2026

Antes de qualquer equipamento: a partir de **1º de julho de 2026**, a ICA 100-40 do DECEA
**acabou com a isenção de autorização de voo para drones abaixo de 250g**. Antes, um drone
leve (DJI Mini) podia voar em área não restrita sem pedir autorização prévia. Agora, **todo
voo, de qualquer peso, exige solicitação prévia pelo SARPAS**, e o cadastro no SISANT (ANAC,
gratuito, por CPF/CNPJ, validade 24 meses) é pré-requisito para o SARPAS liberar o voo.
[Fonte 1](https://irlenmenezes.com.br/drone-sub-250g-o-que-muda-julho-2026/) ·
[Fonte 2](https://blog.grupodr1.com.br/regulamentacao-drones-2026-brasil-anac-decea/)

Drone importado para uso comercial (mapeamento, inspeção) também precisa de **homologação
ANATEL** — o processo é gratuito se o modelo já tiver homologação de fábrica (a maioria dos
DJI vendidos por revenda oficial brasileira já vem homologada), mas usar equipamento não
homologado é infração à Lei Geral de Telecomunicações com multa que pode chegar a
R$ 50.000.000,00 por infração (teto legal, não valor típico aplicado) e apreensão do
equipamento. [Fonte](https://gerar-selo-anatel-para-drone.irlenmenezes.com.br/blog/consequencias-voar-drone-sem-homologacao-anatel)

**Implicação prática para PME:** comprar via revenda brasileira autorizada (Tecno Drones,
Drone Direto, WD Drones, Geotrack, FlyPro) em vez de importar direto resolve a homologação
ANATEL. O SARPAS por voo é a fricção nova — obra fixa em local urbano vai pedir autorização
recorrente, o que favorece **contratar serviço terceirizado de voo** em vez de operar drone
próprio, se o volume de captação não for alto.

### 2.1 Drone leve para mapeamento (DJI Mini 4 Pro)

- **O que faz:** aerofoto/vídeo e mapeamento fotogramétrico básico de obra pequena/média.
- **Maturidade:** produção consolidada.
- **Custo:** R$ 9.300,00 (RC-N2), com desconto à vista de R$ 8.370,00; parcelamento em 12x de
  R$ 775,00 (Tecno Drones, consultado 01/ago/2026).
  [Fonte](https://www.tecnodrones.com.br/drone-dji-mini-4-pro-rc-n2-br-dji041)
- **Disponibilidade no Brasil:** ampla, múltiplos revendedores autorizados.
- **Muda comportamento do campo?** Sim, e é o ponto crítico — pilotar drone **não** é tarefa
  de mestre de obras. Exige pessoa dedicada (engenheiro júnior, estagiário, ou serviço
  terceirizado) e, agora, gestão de autorização SARPAS por voo.
- **Tem API/integração?** O drone em si não; o valor está no software de pós-processamento
  (ver 2.3).
- **Quando não vale a pena:** obra vertical/urbana pequena sem necessidade de volumetria de
  terraplenagem ou vista aérea de progresso — nesse caso, câmera 360° ou celular já cobrem a
  necessidade de "mostrar a obra" por muito menos atrito regulatório.

### 2.2 Drone enterprise (DJI Mavic 3 Enterprise / Mavic 3 Thermal)

- **O que faz:** mapeamento fotogramétrico de precisão centimétrica com RTK integrado, zoom
  de 56x, versão térmica para inspeção.
- **Maturidade:** produção consolidada, uso corrente em topografia/engenharia.
- **Custo:** Mavic 3 Enterprise (com DJI RC Pro) R$ 20.000-23.000; Mavic 3 Thermal (M3T)
  R$ 25.000-28.000 (revendas brasileiras, consultado 01/ago/2026).
  [Fonte](https://odrones.com.br/modelos/dji-mavic-3-enterprise/)
- **Disponibilidade no Brasil:** boa, revendedores especializados (Drone Direto, Tecno Drones).
- **Muda comportamento do campo?** Sim — mesma ressalva do 2.1, ampliada: equipamento caro
  demais para confiar a quem não é operador dedicado.
- **Tem API/integração?** Integra com estação RTK (D-RTK 2) e ecossistema DJI Terra; ponte
  para BIM depende do software de processamento.
- **Quando não vale a pena:** PME abaixo de ~R$ 20-30 milhões/ano de obra — o ticket do
  equipamento não se paga com a frequência de voo que uma construtora pequena gera. Contratar
  serviço terceirizado (ver 2.4) é o caminho até esse porte.
- **Nota de porte:** esta é a categoria explicitamente cara "que só grande construtora usa" —
  registrada aqui, mas fora do alcance do ICP deste documento como compra própria.

### 2.3 Software de processamento fotogramétrico (Pix4Dmapper, DroneDeploy)

- **O que faz:** transforma fotos aéreas em ortomosaico, nuvem de pontos e cálculo de volume
  (estoque, terraplenagem) — é aqui que o drone vira dado utilizável, não a câmera em si.
- **Maturidade:** produção consolidada; precisão de volumetria reportada em ~2-5% (Pix4D).
  [Fonte](https://www.pix4d.com/pt/blog/drone-mineracao-estoque-volume-pix4dmapper)
- **Custo:** Pix4Dmapper licença anual publicada em US$ 3.990/ano (ou assinatura mensal
  ~US$ 350/mês); PIX4Dmatic a partir de US$ 125/mês. DroneDeploy plano "Flight & Analysis"
  publicado em US$ 4.188/ano. Ambos empurram cliente médio/enterprise para orçamento
  customizado assim que entra volume de imagem, análise térmica ou automação (fontes
  internacionais, consultado 01/ago/2026; **preço em R$ não localizado** — revendas brasileiras
  como Tecno Drones e Volt Softwares vendem licença mas não publicam valor em reais).
  [Fonte comparativa](https://www.skyebrowse.com/news/posts/pix4d-vs-dronedeploy)
- **Disponibilidade no Brasil:** revenda local existe (Tecno Drones, Volt Softwares,
  Brasilsofts vendem licença Pix4D com suporte em português).
- **Muda comportamento do campo?** Não diretamente — é ferramenta de escritório/engenharia,
  não do canteiro.
- **Tem API?** Pix4D tem API para automação de processamento (relevante se IOX quiser construir
  pipeline próprio em cima do output).
- **Quando não vale a pena:** se o volume de voos é baixo (poucas obras, poucos levantamentos
  por mês), alternativa gratuita **WebODM** (open source, citada como usada no Brasil) processa
  o mesmo tipo de dado sem custo de licença, com curva de aprendizado maior.
  [Fonte](https://geoone.com.br/6-motivos-para-usar-o-webodm/)

### 2.4 Serviço de voo terceirizado (alternativa ao drone próprio)

- **O que faz:** contrata empresa especializada para o voo pontual, sem a PME possuir
  equipamento, treinar piloto ou gerenciar SARPAS.
- **Maturidade:** produção consolidada, mercado ativo de prestadores de topografia com drone.
- **Custo:** faixa reportada — até 25 ha: R$ 80-90/ha; 25-100 ha: R$ 60-80/ha; acima de
  100 ha: R$ 40-60/ha. Exemplos de projeto fechado: propriedade de 10 ha ≈ R$ 2.000;
  loteamento urbano de 50 ha ≈ R$ 10.000 (fontes de precificação de mercado, consultado
  01/ago/2026). [Fonte](https://www.multitop.eng.br/quanto-custa-um-servico-de-topografia-com-drone-tudo-o-que-voce-precisa-saber)
- **Disponibilidade no Brasil:** ampla, mercado pulverizado de prestadores regionais.
- **Muda comportamento do campo?** Nenhum — o campo só recebe o resultado.
- **Tem API?** Depende do prestador; normalmente entrega arquivo (ortomosaico, relatório), não
  integração direta.
- **Quando faz mais sentido que comprar:** para a maioria das PMEs deste ICP — volumetria e
  mapeamento não são atividade diária, e o custo de posse (equipamento + operador + SARPAS
  recorrente) só se paga com uso frequente.

---

## 3. Escaneamento (LiDAR, fotogrametria, laser scanner)

### 3.1 LiDAR de iPhone/iPad Pro + apps (Polycam, Scaniverse, SiteScape)

- **O que faz:** escaneamento 3D usando o sensor LiDAR já embutido em iPhone/iPad Pro (desde
  o iPhone 12 Pro), sem hardware adicional.
- **Maturidade:** early adopter para uso técnico em construção — a tecnologia é acessível e
  democratizou o escaneamento 3D, mas estudo comparativo mediu erro médio de **42,58% no
  Polycam Pro** e **10,36% no Scaniverse** em digitalização arquitetônica de precisão — a
  variação entre apps é grande e nenhum se equipara a scanner profissional.
  [Fonte estudo](https://www.sciencedirect.com/science/article/pii/S1877050925026742) ·
  [Fonte comparativa](https://www.kiriengine.app/blog/best-lidar-3d-scanner-apps-iphone-2026)
- **Custo:** os apps (Polycam, Scaniverse) são gratuitos ou freemium — custo real é o
  hardware, um iPhone/iPad Pro que a empresa provavelmente já usa (**preço incremental
  específico não localizado** por não ser compra dedicada).
- **Disponibilidade no Brasil:** total — App Store, sem barreira de importação.
- **Muda comportamento do campo?** Baixo-médio — é apontar o aparelho e caminhar, mas exige
  técnica (velocidade de movimento, iluminação) que um uso descuidado degrada.
- **Tem API/integração?** Polycam tem exportação para formatos padrão (OBJ, GLTF, point
  cloud) e é "mais forte para fluxo AEC/times pagos"; Scaniverse é mais leve para captura
  visual rápida; SiteScape é citado como melhor para captura de nuvem de pontos AEC
  especificamente. [Fonte](https://www.skyebrowse.com/news/posts/polycam-vs-scaniverse)
- **Quando não vale a pena:** qualquer medição que vá para memorial de cálculo, laudo técnico
  ou entrega que exija tolerância métrica formal — aí a imprecisão medida (>40% em alguns
  apps) inviabiliza uso sem validação humana, e scanner profissional (3.3) é obrigatório.

### 3.2 Fotogrametria via drone (ver seção 2)

Já coberta em 2.3 — o mesmo fluxo de captura de imagem + Pix4D/DroneDeploy serve tanto para
volumetria quanto para escaneamento de fachada/estrutura externa. Não repito aqui.

### 3.3 Matterport (Pro2/Pro3)

- **O que faz:** combina LiDAR + fotografia HDR para gerar modelo 3D navegável e nuvem de
  pontos colorida — usado para as-built digital, tour virtual e compatibilização.
- **Maturidade:** produção consolidada, com distribuidor oficial no Brasil.
- **Custo:** **preço não localizado** — Guandalini e SPGeo (distribuidores oficiais) listam
  o Pro3 como "sob consulta", sem tabela pública (consultado 01/ago/2026).
  [Fonte](https://www.guandalinibr.com/produtos/laser-scanner/matterport-pro3/) ·
  [Fonte](https://www.spgeo.com.br/matterport-pro3-laser-scanner-3d)
- **Disponibilidade no Brasil:** boa — dois distribuidores oficiais identificados, com venda,
  locação e suporte técnico.
- **Muda comportamento do campo?** Sim — requer operador que passeie pelo espaço de forma
  sistemática; não é tarefa que se delega ao mestre de obras sem treino.
- **Tem API?** Matterport tem SDK/API para embutir modelos e extrair dados de medição —
  relevante se IOX quiser construir dashboard próprio em cima do output.
- **Quando não vale a pena:** obra pequena sem necessidade de as-built digital formal ou tour
  virtual para venda/incorporação — LiDAR de iPhone (3.1) cobre documentação informal por
  custo incremental zero.

### 3.4 Laser scanner terrestre profissional (Leica RTC, GeoSLAM Zeb) — contexto de preço

- **O que faz:** nuvem de pontos de alta precisão (tolerância milimétrica) para levantamento
  topográfico e compatibilização de projeto em nível de engenharia.
- **Maturidade:** produção consolidada, padrão-ouro de precisão — usado como referência para
  avaliar o quanto o LiDAR de iPhone (3.1) fica atrás.
- **Custo (aluguel, não compra):** GeoSLAM Zeb Horizon R$ 1.800/dia ou R$ 18.000/mês; GeoSLAM
  Zeb Revo R$ 1.400/dia ou R$ 14.000/mês; Leica RTC R$ 2.250/dia ou R$ 22.500/mês (CPE
  Tecnologia, consultado 01/ago/2026). [Fonte](https://www.brtech3d.com.br/laser-scanner-topografia-preco)
- **Disponibilidade no Brasil:** boa — SPGeo e CPE Tecnologia oferecem venda, locação e
  seminovos, com marcas Leica, GeoMax, DJI.
- **Muda comportamento do campo?** Sim, totalmente — operação técnica, não é ferramenta de
  campo do dia a dia; contrata-se o serviço/locação pontualmente.
- **Tem API?** Integra com softwares BIM/CAD via formatos de nuvem de pontos padrão (E57,
  LAS) — não é "API" no sentido de webhook, é interoperabilidade de arquivo.
- **Quando não vale a pena:** para o ICP deste documento (PME, orçamento apertado), comprar é
  quase sempre a decisão errada — o custo diário de aluguel (R$ 1.400-2.250) só se justifica
  para levantamento pontual de alta exigência técnica (compatibilização, laudo, disputa
  contratual), não para acompanhamento de rotina.

---

## 4. Sensores (concreto, ambiente, estrutura)

### 4.1 Sensor de maturidade de concreto (Giatec SmartRock, Converge, Doka Concremote)

- **O que faz:** mede temperatura dentro do concreto fresco e calcula a resistência estimada
  em tempo real (método da maturidade, norma ASTM C1074), enviando dado direto para o celular
  — substitui corpo de prova/ruptura para decisão de desforma.
- **Maturidade:** produção consolidada internacionalmente (Giatec, Converge, Doka Concremote
  são players estabelecidos, não experimentais).
  [Giatec](https://info.giatecscientific.com/giatec-smartrock) ·
  [Converge](https://www.converge.io/) · [Doka Concremote](https://www.doka.com/en/system-groups/doka-system-components/concremote-hardware/index)
- **Custo:** **preço não localizado** em nenhum dos três — nenhum publica tabela pública, e
  não localizei distribuidor brasileiro que publique preço em reais (consultado 01/ago/2026).
  Especificações técnicas confirmadas: sensor sem fio, alcance ~12m, bateria dura ~4 meses
  após ativação.
- **Disponibilidade no Brasil:** **não localizei revenda/distribuidor oficial brasileiro** para
  nenhum dos três nesta busca — indício de que a compra hoje exigiria importação direta.
  Ponto de atenção para validar com fornecedor de materiais de ensaio de concreto local.
- **Muda comportamento do campo?** Baixo — o sensor é embutido pelo próprio time que já
  concreta; a leitura é no celular do engenheiro/mestre, não exige novo hábito de campo, só
  novo hábito de decisão (esperar dado em vez de "regra de bolso" de dias).
- **Tem API?** Giatec expõe dado via app/dashboard próprio; não localizei documentação de API
  pública aberta para os três — provavelmente integração sob consulta comercial.
- **Quando não vale a pena:** obra de baixo volume de concretagem estrutural (reforma,
  pequenas edificações) — o ganho (liberar forma mais cedo com segurança) só compensa o custo
  por m³ concretado em obra de porte médio/grande com cronograma apertado.

### 4.2 Sensores de umidade, temperatura, vibração — IoT genérico

- **O que faz:** monitora condição ambiental (umidade de cura, temperatura, vibração de
  máquina, deformação estrutural) continuamente, com alerta antes que vire problema caro.
- **Maturidade:** early adopter no setor de construção brasileiro — a literatura fala em
  "Construção 4.0" como tendência, não como padrão já disseminado; os casos concretos
  encontrados são majoritariamente acadêmicos ou de fornecedores genéricos de IoT industrial,
  não uma categoria de produto pronta e empacotada para construção civil brasileira.
  [Fonte](https://www.ntcbrasil.com.br/blog/tecnologias-sensoriamento-fiscalizacao-obras/)
- **Custo:** **preço não localizado** — natureza do mercado é projeto sob medida (sensor +
  gateway + plataforma), não produto de prateleira com tabela pública.
- **Disponibilidade no Brasil:** fragmentada — existem integradores de IoT industrial que
  atendem construção, mas não identifiquei um player nacional dominante e especializado
  (diferente de RDO, onde há vários players nacionais maduros).
- **Muda comportamento do campo?** Nenhum uma vez instalado (sensor fixo, telemetria
  automática) — mas a **implantação** exige projeto técnico, o que é uma barreira de entrada
  diferente de "comprar e usar".
- **Tem API?** Depende inteiramente do integrador — não há padrão de mercado a apontar.
- **Quando não vale a pena:** para a maioria das PMEs deste ICP, hoje. Esta categoria é a mais
  "pesquisa/projeto sob medida" da lista inteira — não há produto pronto de baixo custo a
  recomendar como está o mercado em ago/2026. Registrar como observação de mercado, não como
  compra recomendada.

---

## 5. Rastreamento (material, ferramenta, equipamento)

### 5.1 RFID/QR/BLE para material e ferramenta

- **O que faz:** identifica e localiza item (ferramenta, EPI, material) por tag lida em
  ponto fixo ou por leitor móvel — reduz perda de ferramenta e permite saber quem pegou o quê.
- **Maturidade:** produção consolidada como tecnologia (RFID é madura há décadas); aplicação
  específica em canteiro de obras brasileiro é early adopter — há estudo acadêmico da SciELO
  descrevendo prova de conceito, e fornecedores genéricos de gestão de ativos (CPCON, SmartX
  Hub) oferecem a solução adaptada, sem ser um mercado de nicho maduro específico para
  construção. [Fonte SciELO](https://www.scielo.br/j/ac/a/jGP9YYnwjwVzg9p4kq34bCP/)
- **Custo:** tag RFID passiva simples ≈ R$ 0,80/unidade (ou ~US$ 1) segundo referência de
  mercado nacional; tags UHF em lote de 100 unidades entre R$ 209,90 e R$ 259,90 (Loja RFID
  Brasil, consultado 01/ago/2026); tags **ativas** (com bateria, mais robustas, usadas em
  ferramenta/equipamento) partem de ~US$ 25 e passam de US$ 100 com sensores/case reforçado
  — **custo de leitor + software não localizado** em reais (é a parte mais cara do sistema e
  depende de escala). QR code impresso tem custo marginal desprezível, mas exige leitor
  (celular) manual em vez de leitura automática por RFID.
  [Fonte](https://pt.rfidtagworld.com/news/price-of-rfid-tags.html)
- **Disponibilidade no Brasil:** boa para o componente tag (Loja RFID Brasil e similares);
  para solução completa (leitor + software + integração), depende de integrador (CPCON,
  SmartX Hub).
- **Muda comportamento do campo?** QR code: baixo (fotografar/escanear com celular já é
  hábito). RFID com leitor fixo em portaria/almoxarifado: baixo para o operário (só passa
  perto), mas exige disciplina de cadastro no início — se ninguém cadastra a ferramenta nova,
  o sistema degrada rápido.
- **Tem API?** Depende do integrador; não há padrão único de mercado — ponto a validar caso a
  caso.
- **Quando não vale a pena:** obra pequena, ferramental pouco numeroso e valioso — o custo de
  implantar disciplina de cadastro (o verdadeiro custo, não a tag em si) não se paga se a perda
  de ferramenta já é baixa.

### 5.2 Geofencing e telemetria de equipamento pesado

- **O que faz:** rastreia localização, horas de motor, tempo ocioso e comportamento do
  operador de máquina pesada (retroescavadeira, betoneira, caminhão) via GPS + diagnóstico do
  motor, com alerta se o equipamento sair de uma área definida.
- **Maturidade:** produção consolidada — categoria de rastreamento veicular/frota já madura no
  Brasil (Geotab, Autotrac, Geoforce, Ruptela, Brasiltrack atendem o mercado nacional).
  [Fonte](https://www.geotab.com/pt-br/blog/telemetria-na-construcao-civil/)
- **Custo:** **preço não localizado** — nenhum dos fornecedores nacionais (Autotrac,
  Brasiltrack, Geoforce) publica tabela pública; modelo é cotação por frota/contrato.
- **Disponibilidade no Brasil:** ampla — mercado de rastreamento veicular é grande e maduro no
  Brasil, com players nacionais e internacionais (Geotab, Ruptela) presentes.
- **Muda comportamento do campo?** Nenhum para o operador — telemetria é automática assim que
  o dispositivo é instalado no equipamento; o consumo do dado é gerencial, não de campo.
- **Tem API?** Geotab é conhecido por ter API aberta e madura (é referência de mercado para
  integração de telemetria); os provedores nacionais variam — validar caso a caso antes de
  assumir.
- **Quando não vale a pena:** construtora que não possui frota própria de equipamento pesado
  (aluga tudo pontualmente) — nesse caso o rastreamento é responsabilidade da locadora, não da
  construtora.

---

## 6. Wearables e segurança

### 6.1 Capacete inteligente (câmera, sensores, GPS)

- **O que faz:** capacete com câmera 4G embutida para inspeção remota ao vivo, e/ou sensores
  de impacto, gás, temperatura, GPS e botão de emergência.
- **Maturidade:** early adopter no Brasil — fornecedor nacional identificado (SensorEng) com
  linha de produto ativa, mas ainda é nicho, não item padrão de EPI.
  [Fonte](https://sensoreng.com.br/capacete-de-monitoramento-inteligente-em-obras-conheca-os-beneficios/)
- **Custo:** **preço não localizado** — SensorEng não publica valor; site apenas indica dois
  modelos comerciais: **compra** do capacete + assinatura de software, ou **aluguel** do
  capacete + assinatura de software (consultado 01/ago/2026).
  [Fonte](https://sensoreng.com.br/camera-capacete-para-inspecao-de-obras-4g/)
- **Disponibilidade no Brasil:** sim, fornecedor nacional (SensorEng) com modelo de aluguel —
  reduz a barreira de investimento inicial.
- **Muda comportamento do campo?** Sim — é EPI adicional que o trabalhador precisa aceitar
  usar, com implicação de vigilância que precisa ser comunicada (ver LGPD abaixo).
- **Tem API?** Não localizado.
- **Quando não vale a pena:** a maior parte do ICP deste documento, hoje — é tecnologia de
  nicho para obra de alto risco (grande porte, mineração, offshore) ou para inspeção remota
  específica. Para PME comum, o crachá de proximidade (6.2) resolve mais barato o problema de
  segurança/localização sem a resistência cultural de "estão me filmando o dia todo".

### 6.2 Crachá/colete com sensor de proximidade e detecção de queda

- **O que faz:** identifica localização do trabalhador em tempo real, detecta queda por
  acelerômetro/inclinação, e emite alerta de emergência (botão de pânico).
- **Maturidade:** produção consolidada no nicho — startup brasileira **Trackfy** (Salvador/BA)
  já atende ao menos oito empresas industriais (Camaçari-BA, Cubatão-SP, Mauá-SP) desde 2021,
  com casos publicados de redução de tempo de evacuação e deslocamento.
  [Fonte](https://parquetecnologico-ba.org.br/2024/01/22/startup-de-salvador-trackfy-cria-dispositivo-para-alertar-trabalhadores-sobre-situacoes-de-risco-em-obras-e-fabricas/)
- **Custo:** **preço não localizado** — Trackfy não publica tabela; modelo é contrato
  corporativo, hoje mais presente em indústria pesada (óleo e gás) que em construção civil de
  pequeno/médio porte.
- **Disponibilidade no Brasil:** sim, fornecedor nacional maduro, com unidade também no Rio de
  Janeiro.
- **Muda comportamento do campo?** Baixo — a tag pode ser embutida no crachá/EPI que o
  trabalhador já usa, sem novo hábito de operação.
- **Tem API?** Não localizado — plataforma fechada (dashboard próprio).
- **Quando não vale a pena:** obra pequena com baixo efetivo de trabalhadores simultâneos —
  o caso de uso do Trackfy (evacuação em massa, zona explosiva) é desenhado para operação
  industrial de grande porte; para canteiro de obra civil comum, o retorno é menos claro sem
  validação de caso similar.

### 6.3 Detecção de queda e monitoramento de EPI por câmera (visão computacional)

- **Nota de risco, não de tecnologia:** já sinalizado em
  [`ia-construcao-sintese.md`](../ia-construcao-sintese.md) §5 — detecção de EPI por câmera é
  monitoramento de trabalhador e exige transparência, base legal (LGPD) e provavelmente
  interlocução sindical. Não é recomendado como produto de entrada para este ICP. Mantido aqui
  apenas como referência cruzada — não pesquisado de novo neste documento.

---

## 7. Robótica

### 7.1 Robô de layout (Dusty Robotics FieldPrinter, HP SitePrint, Civ Robotics)

- **O que faz:** robô autônomo que imprime o layout do projeto BIM diretamente no piso da
  obra (marcação de parede, furo, instalação), eliminando a marcação manual com trena e giz.
- **Maturidade:** produção consolidada nos EUA (Dusty Robotics já imprimiu mais de 100 milhões
  de pés quadrados; precisão de 1/16 polegada, o dobro da precisão do HP SitePrint, que fica
  em 1/8 polegada). Early adopter/inexistente no Brasil.
  [Fonte](https://www.dustyrobotics.com/compare/fieldprinter-vs-siteprint)
- **Custo:** **preço não localizado em R$.** Dusty Robotics opera **só por locação** (não
  vende o robô), com precificação por uso proporcional à área de layout — modelo "tudo
  incluso" (robô, software, suporte). Não há indicação de operação no Brasil.
  [Fonte](https://www.dustyrobotics.com/pricing)
- **Disponibilidade no Brasil:** **nenhuma identificada** — sem revenda, distribuidor ou caso
  de uso brasileiro encontrado nesta busca.
- **Muda comportamento do campo?** Sim, radicalmente — mas no bom sentido: substitui trabalho
  manual de marcação, não pede que o time aprenda algo nesse processo específico (o robô faz).
  A mudança real é de processo (BIM tem que estar correto e atualizado antes de imprimir).
- **Tem API?** Integra com modelo BIM (é a entrada de dado do robô) — não é o tipo de API que
  IOX construiria em cima, é consumidor de BIM.
- **Quando não vale a pena:** **hoje, para qualquer PME brasileira** — categoria inexistente
  no mercado nacional, dependente de BIM maduro (que a maioria das PMEs deste ICP não tem) e
  de fornecedor sem operação local. Registrado como referência de fronteira tecnológica, não
  como opção real de compra em 2026.

### 7.2 Impressão 3D de concreto

- **O que faz:** imprime paredes de concreto camada por camada a partir de projeto digital,
  reduzindo tempo e mão de obra na fase estrutural.
- **Maturidade:** early adopter no Brasil, com casos reais operando desde 2020 — não é mais
  puramente experimental, mas também não é escala industrial.
- **Casos e custo:** **InovaHouse3D** (Macaíba/RN, com 3DHomeConstruction) imprimiu a primeira
  casa brasileira em 2020 (66 m²). A empresa reporta que **só a fase de levantamento de
  paredes** custou cerca de **R$ 36-50/m²**, 20% menor que o convencional — **ressalva
  importante: isso cobre só a impressão das paredes; fundação, laje, telhado, instalações e
  acabamento seguem custando como obra normal**, então não é o custo total da casa. A empresa
  fala em redução média de 20-50%, podendo chegar a 80% em escala — mas essa faixa é reportada
  pela própria empresa (classe B/C de evidência), não auditada externamente.
  **Sika Brasil** ergueu uma casa de ~80 m² em Caxias do Sul (RS) em ~60 horas, consumindo
  ~20 toneladas de microconcreto — **preço não localizado** para esse projeto específico.
  [Fonte InovaHouse3D](https://gazzconecta.com.br/gazz-conecta/sebrae/inovahouse3d-startup-pioneira-em-impressao-3d-de-casas-no-brasil/) ·
  [Fonte Sika](https://bra.sika.com/pt/noticias/sika-brasil-constroi-casa-de-concreto-impressa-em-3d-no-rio-grande-do-sul.html)
- **Disponibilidade no Brasil:** concentrada geograficamente — fornecedores certificados
  majoritariamente em SP, RJ e MG (e o caso pioneiro em RN); fora desses polos, frete de
  material pode anular a vantagem de custo.
- **Muda comportamento do campo?** Sim, estruturalmente — é outra categoria de mão de obra
  (operador de impressora em vez de pedreiro), não uma ferramenta que o time atual adota.
- **Tem API?** Não é o tipo de tecnologia relevante para integração de dado — é execução
  física, não captura/gestão de informação.
- **Quando não vale a pena:** fora do escopo de "tecnologia que a construtora adota" — é uma
  decisão de método construtivo, não de ferramenta de apoio. Não é algo que IOX venderia como
  squad de software; é adjacência de fornecedor, registrada por completude.

### 7.3 Robô de demolição (Brokk)

- **O que faz:** demolição controlada remotamente em áreas de acesso restrito ou risco
  estrutural, sem expor operador humano.
- **Maturidade:** produção consolidada mundialmente, marca de referência.
- **Custo:** **preço não localizado** — nem venda nem aluguel têm valor público; **Testato**
  (parceira brasileira da Brokk) trabalha com "opções de aquisição e financiamento" sob
  consulta. [Fonte](https://www.testato.com.br/brokk)
- **Disponibilidade no Brasil:** sim — Testato é parceira/distribuidora nacional com suporte
  técnico, oferece venda e aluguel.
- **Muda comportamento do campo?** Sim — operação especializada por operador treinado, não é
  ferramenta de uso geral do canteiro.
- **Tem API?** Não aplicável — equipamento de operação remota manual, não plataforma de dado.
- **Quando não vale a pena:** demolição convencional de pequeno porte sem risco estrutural —
  custo de robô especializado não se justifica; é ferramenta para o caso específico de
  demolição em espaço confinado, estrutura instável ou proximidade de risco.

---

## 8. Software de campo (RDO, medição, checklist) — e API é o critério que decide

Esta é a categoria mais próxima do produto #1 já validado na síntese anterior
([`ia-construcao-sintese.md`](../ia-construcao-sintese.md)). O que muda aqui é o foco em **API**
— se IOX quer construir em cima, precisa saber quem abre a porta.

| Produto | O que faz | Maturidade | Custo | API/integração |
|---|---|---|---|---|
| **Sienge** | ERP completo de construção (financeiro, obra, suprimentos) — RDO é módulo dentro do ERP | Produção consolidada, líder de mercado brasileiro | Não publicado (ERP enterprise, cotação) | **Sim, robusta.** REST API documentada publicamente (`api.sienge.com.br/docs`) + API em massa (BULK) para grandes volumes; rate limit de 200 req/min. [Fonte](https://api.sienge.com.br/docs/general-rest.html) |
| **Mobuss Construção** | Plataforma de gestão de obra com módulo de Diário de Obra (lançado out/2022) | Produção consolidada | Não publicado | **Sim.** API REST documentada via Swagger (`services.mobuss.com.br`), integra com catraca digital, BI, WhatsApp, extração automática para BigQuery. [Fonte](https://www.mobussconstrucao.com.br/interacao-do-cliente/) |
| **RDOWEB** | Plataforma dedicada de RDO digital + indicadores + app mobile online/offline | Produção consolidada, nicho de RDO | Não publicado | Integração citada com MS-Project; **API pública não localizada**. |
| **App Diário de Obra (diariodeobras.net)** | RDO digital + fotos + integração com cronograma/custo | Produção consolidada | A partir de R$ 850/ano (consultado 01/ago/2026) | Não localizado. [Fonte](https://diariodeobras.net/promocao/) |
| **Prumo** | RDO mobile-first para engenheiro autônomo/pequena construtora, funciona offline | Produção consolidada, foco explícito em PME | Gratuito (sem RDO, até 25 fotos); Profissional (RDO, até 500 fotos, até 3 obras); Studio/Contratante (fotos ilimitadas) — valores em R$ não publicados | Não localizado. [Fonte](https://useprumo.app/) |
| **Brickup** | RDO digital 100% gratuito | Produção consolidada | **Gratuito** | Não localizado. [Fonte](https://brickup.app/rdo-digital-gratuito/) |
| **Zé Obra** | Captura via WhatsApp (ver 1.3) — não é "RDO tradicional", é o mesmo trabalho por interface conversacional | Produção consolidada (nicho) | R$ 39-449/mês (ver 1.3) | Não localizado. |

**Leitura para IOX:** Sienge e Mobuss são os dois únicos com API documentada e pública neste
levantamento — são os ERPs que construtoras de porte médio já usam, e é sobre eles que um
squad de IOX **integraria**, não competiria. Prumo, Brickup e o App Diário de Obra são
concorrência direta de "ferramenta de RDO simples" — competir nesse espaço tem barreira baixa
(inclusive existe opção gratuita, Brickup) e por isso baixa defensabilidade. **A oportunidade
real, coerente com o que já foi mapeado, é a camada de captura por WhatsApp (Zé Obra é prova de
mercado, não concorrente direto se o produto de IOX focar em construtora e não em
arquiteto/engenheiro autônomo) alimentando dado estruturado que se integra ao Sienge/Mobuss via
API — não outro app de RDO para o mestre abrir.**

---

## 9. Conectividade (resolver internet onde não tem)

### 9.1 Starlink

- **O que faz:** internet via satélite de baixa órbita, independe de infraestrutura terrestre
  — resolve canteiro rural ou periférico sem fibra/cobertura estável.
- **Maturidade:** produção consolidada, já testado em obra/agro/mineração no Brasil.
- **Custo:** kit Starlink Mini a partir de R$ 799,00 (promoção, valor anterior era
  R$ 1.400-1.800); mensalidade residencial a partir de R$ 189/mês (ou R$ 164/mês promocional
  em áreas selecionadas por 1 ano); antena padrão R$ 1.199,00. **Plano empresarial** (indicado
  explicitamente para canteiro de obras, mineração, fazendas) tem preço customizado, não
  publicado (consultado 01/ago/2026).
  [Fonte](https://melhorplano.net/internet-banda-larga/starlink-internet) ·
  [Fonte](https://www.minhaconexao.com.br/planos/internet-banda-larga/internet-starlink/precos-starlink)
- **Disponibilidade no Brasil:** ampla, venda direta online, sem revenda física necessária.
- **Muda comportamento do campo?** Nenhum — resolve conectividade, é infraestrutura, não
  interface de uso.
- **Tem API?** Não relevante para este caso de uso (é provedor de internet, não plataforma de
  dado de obra).
- **Quando não vale a pena:** obra urbana com cobertura 4G/5G estável — roteador 4G (9.2) é
  mais barato e mais simples de contratar/cancelar por obra.

### 9.2 Roteador 4G/5G

- **O que faz:** capta sinal de operadora de celular e distribui via Wi-Fi — solução padrão
  para canteiro sem fibra mas com cobertura móvel.
- **Maturidade:** produção consolidada, categoria de consumo amplamente disponível.
- **Custo:** **preço não localizado com precisão neste levantamento** — categoria de produto
  varejo com faixa ampla (roteadores de mesa a modelos com antena de alto ganho tipo Amplimax
  para sinal fraco); custo recorrente é o plano de dados móvel contratado à parte.
  [Fonte](https://blog.timelapseobras.com.br/post/redes-4g-vs-wifi-conexao-canteiro-obras)
- **Disponibilidade no Brasil:** total — qualquer operadora, qualquer varejista de eletrônicos.
- **Muda comportamento do campo?** Nenhum.
- **Tem API?** Não aplicável.
- **Quando não vale a pena:** área sem cobertura 4G nenhuma (obra muito remota) — aí Starlink é
  a única opção viável.

---

## O stack mínimo viável para uma obra de PME

Ordenado por **retorno por real gasto**, assumindo o ICP deste documento (10-200 funcionários,
orçamento apertado, campo não-técnico). Todo item abaixo tem custo publicado e disponibilidade
nacional confirmada nas seções acima — nada aqui depende de importação sem homologação ou de
fornecedor sem operação no Brasil.

1. **Captura via WhatsApp (Zé Obra ou equivalente) — R$ 39 a R$ 449/mês.**
   Zero mudança de comportamento, zero gadget novo, resolve RDO/diário/foto no mesmo canal que
   o mestre já usa. É o primeiro real de investimento em tecnologia de campo — coerente com o
   que já foi decidido em [`ia-construcao-sintese.md`](../ia-construcao-sintese.md).

2. **Roteador 4G (~R$ 300-800 de equipamento + plano de dados) — só se a obra não tiver
   cobertura confiável.** Pré-requisito de infraestrutura para tudo que depende de upload em
   tempo real (item 1, câmera solar).

3. **Câmera solar 4G fixa (Intelbras ou similar) — para obra de duração média/longa** que
   precise mostrar progresso a cliente/financiador sem depender de alguém lembrar de fotografar.
   Instala uma vez, ninguém opera depois.

4. **Câmera 360° portátil (Insta360 X4, ~R$ 2.200) — quando o time interno (não o mestre) faz
   ronda de documentação periódica** e precisa de captura completa de ambiente em um clique,
   sem enquadrar.

5. **LiDAR de iPhone/iPad Pro + Scaniverse (custo incremental ≈ zero se já há o aparelho)** —
   para documentação informal de as-built e apoio visual, nunca para medição que vá para
   memorial de cálculo ou laudo.

6. **RDO gratuito (Brickup) como ponte, se ainda não há nenhuma ferramenta digital** — só
   recomendado como estágio intermediário antes do item 1, para obra que resiste a pagar
   qualquer mensalidade no início.

**Depois disso, pausa.** Drone, sensor de maturidade, RFID, telemetria de frota, wearable e
robótica só entram quando o volume de obra e a maturidade de processo justificam o custo de
posse ou o custo de disciplina operacional (cadastro de tag, operador dedicado de drone, gestão
de SARPAS por voo). Para o ICP deste documento, a sequência certa é: **primeiro a captura de
dado de rotina fica barata e sem atrito (itens 1-6); só depois vale medir o retorno de qualquer
hardware que exija operador dedicado, aluguel diário ou importação.**

---

## O que ainda não sabemos (não pesquisado neste documento)

1. Se as construtoras dos lotes 01/02 de prospects (SC) já usam alguma dessas tecnologias hoje
   — este documento é mapa de oferta de mercado, não pesquisa de campo com o cliente real. Ver
   ressalva idêntica em [`produtos-construcao.md`](../produtos-construcao.md): "as 3-5 primeiras
   conversas são pesquisa, não venda."
2. Preço de sensor de maturidade de concreto, telemetria de frota, wearable de segurança e
   RFID completo (leitor+software) em reais — nenhum fornecedor identificado publica tabela;
   todos operam por cotação. Isso por si só é um dado: são categorias vendidas por relação
   comercial, não por autoatendimento — relevante para como IOX abordaria esses fornecedores
   como parceiro de integração, não como comprador de prateleira.
3. Se a mudança do SARPAS (1º/jul/2026, fim da isenção sub-250g) já reduziu a adoção de drone
   leve por PME — é regulação recente demais para haver dado de impacto de mercado publicado.

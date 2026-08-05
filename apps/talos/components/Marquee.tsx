/**
 * FAIXA CORRIDA — assinatura tipográfica, técnica do Minh Pham.
 *
 * No minhpham.design as palavras (3D · VISUAL · MOTION · PRODUCT) atravessam a tela em
 * 116px e são a coisa que faz a página ser reconhecível. Aqui as palavras são os verbos
 * do que a máquina faz — a oferta inteira dita em uma linha, sem frase.
 *
 * CSS puro: `@keyframes` + `translateX`, sem JS e sem biblioteca. Roda no compositor,
 * não repinta nada, e sobrevive com o JavaScript desligado. Duas cópias do conteúdo
 * lado a lado e o deslocamento de exatamente -50% é o que faz o laço ser imperceptível.
 *
 * `mix-blend-mode` no texto vazado: o contorno bronze mistura com o que estiver atrás
 * em vez de ficar por cima como adesivo — é o que separa faixa corrida de banner.
 */
const VERBOS = [
  'responde',
  'registra',
  'confere',
  'calcula',
  'avisa',
  'arquiva',
  'integra',
  'cobra',
  'agenda',
  'emite',
];

export function Marquee() {
  const fita = [...VERBOS, ...VERBOS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-fita">
        {[0, 1].map((copia) => (
          <div className="marquee-grupo" key={copia}>
            {fita.map((v, i) => (
              <span key={`${copia}-${i}`} className="marquee-item">
                {v}
                <i className="marquee-ponto" />
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* Só isto é lido por leitor de tela — a faixa em si é decorativa e repetida. */}
      <span className="sr-only">
        A máquina responde, registra, confere, calcula, avisa, arquiva, integra, cobra,
        agenda e emite.
      </span>
    </div>
  );
}

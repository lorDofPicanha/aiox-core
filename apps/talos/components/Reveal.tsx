import type { ReactNode } from 'react';

/**
 * Marcador de entrada ao scroll. **Não anima nada por conta própria** — só carimba a
 * classe que o GSAP procura em ScrollFX.tsx.
 *
 * ⚠️ Duas versões anteriores morreram aqui. Vale registrar as duas:
 *
 * 1ª — `useReducedMotion()` trocando a árvore renderizada. Quebrava a hidratação: o
 *      servidor não vê a media query, monta um ramo, o cliente monta outro.
 *
 * 2ª — `motion.div` com `initial={{ opacity: 0 }}` + `whileInView`. Dois defeitos, um
 *      deles grave:
 *      · a §2 ficava com opacidade 0 PARA SEMPRE. Ela entra no viewport durante a
 *        hidratação, e com `once: true` o Motion marcava como já animada sem nunca ter
 *        animado. Medido, não suposto: `getComputedStyle` devolvia 0.00 depois de rolar.
 *      · `opacity: 0` ia no HTML do servidor. Sem JS — falha de rede, bloqueador, bot —
 *        a página inteira era invisível. Conteúdo que só existe se o JavaScript rodar é
 *        conteúdo que não existe para o Google nem para leitor de tela em modo texto.
 *
 * A forma atual não tem nenhum dos dois: o HTML sai completo e visível, e quem esconde
 * para depois revelar é o GSAP, em `useLayoutEffect`, já no cliente. Se o JS não rodar,
 * o pior caso é o site aparecer todo de uma vez — que é o comportamento certo.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className ? `reveal ${className}` : 'reveal'}
      style={style}
      data-atraso={delay || undefined}
    >
      {children}
    </div>
  );
}

/** Mesma entrada, escalonada entre os filhos diretos — para grades de card. */
export function RevealStagger({
  children,
  className,
  passo = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  passo?: number;
}) {
  return (
    <div className={className ? `reveal-grupo ${className}` : 'reveal-grupo'} data-passo={passo}>
      {children.map((filho, i) => (
        <div key={i} style={{ height: '100%' }}>
          {filho}
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** useLayoutEffect roda antes do paint (sem flash); no servidor não existe. */
const useEfeitoLayout = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Tudo que depende de scroll — GSAP ScrollTrigger.
 *
 * Três coisas, todas com função:
 *
 *  1. ENTRADA DAS SEÇÕES (`.reveal`, `.reveal-grupo`). Aqui em vez de no Motion por um
 *     motivo de robustez, não de gosto: o `gsap.from` aplica o estado inicial **em
 *     tempo de execução**, então o HTML entregue pelo servidor já vem visível. A versão
 *     com `initial={{opacity:0}}` do Motion mandava opacity 0 no HTML e deixava a página
 *     invisível sem JS — além de travar a §2 em 0 para sempre. Ver Reveal.tsx.
 *
 *  2. BARRA DE LEITURA. A página tem 7.300px; sem indicador o visitante não sabe se está
 *     no começo ou no fim, e isso é motivo documentado de abandono em página longa.
 *
 *  3. TRILHA DA §4. Os três passos são uma sequência no tempo. A linha que preenche com
 *     o scroll faz a sequência ser sentida, não só lida — é o caso em que a animação
 *     carrega a informação, que é a régua que o projeto usa para aceitar movimento.
 *
 * Sem pin e sem scrub no texto: sequestrar o scroll do leitor continua fora.
 * `prefers-reduced-motion` sai pela porta da frente — nada é escondido, nada anima.
 */
export function ScrollFX() {
  const barra = useRef<HTMLDivElement>(null);

  useEfeitoLayout(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll<HTMLElement>('.trilha-fill').forEach((el) => {
        el.style.transform = 'scaleX(1)';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ── 0. smooth scroll (lenis) ─────────────────────────────────────────────
       Três das sete referências aprovadas usam — minhpham, matvoyce e scout. Não é
       enfeite: a inércia é o que faz a página parecer objeto e não documento, e é
       metade da diferença de "craft" que se sente sem saber nomear.

       Precisa estar acoplado ao ScrollTrigger, senão os dois disputam a posição do
       scroll e os gatilhos disparam fora de lugar. `html { scroll-behavior: smooth }`
       do globals.css também tem que sair — as duas suavizações brigam entre si. */
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // ── 1. entrada das seções ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 18,
          duration: 0.6,
          delay: Number(el.dataset.atraso ?? 0),
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        });
      });

      /* Reveal por máscara — técnica do Minh Pham. O texto sobe POR DENTRO de um
         clip-path que abre de baixo para cima; a letra emerge de trás da linha em vez
         de aparecer com fade. `willChange` fica só durante a animação: deixar fixo em
         todo título força uma camada de composição por seção sem necessidade. */
      gsap.utils.toArray<HTMLElement>('.reveal-clip').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(105% 0% -10% 0%)', y: 26 },
          {
            clipPath: 'inset(-10% 0% -10% 0%)',
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onStart: () => { el.style.willChange = 'clip-path, transform'; },
            onComplete: () => { el.style.willChange = ''; },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-grupo').forEach((grupo) => {
        const filhos = Array.from(grupo.children) as HTMLElement[];
        gsap.from(filhos, {
          opacity: 0,
          y: 22,
          duration: 0.55,
          stagger: Number(grupo.dataset.passo ?? 0.08),
          ease: 'power2.out',
          scrollTrigger: { trigger: grupo, start: 'top 90%', once: true },
        });
      });

      // ── 2. barra de leitura ────────────────────────────────────────────────
      if (barra.current) {
        gsap.to(barra.current, {
          '--p': 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
      }

      // ── 3. trilha da §4 ────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>('.trilha-fill').forEach((linha) => {
        gsap.fromTo(
          linha,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: linha.closest('.trilha-passo') ?? linha,
              start: 'top 88%',
              end: 'top 42%',
              scrub: 0.4,
            },
          },
        );
      });
    });

    // As fontes assentam depois do primeiro layout e mudam a altura da página;
    // sem isto os gatilhos ficam calculados sobre posições que já não existem.
    const refazer = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refazer);
    window.addEventListener('load', refazer);

    return () => {
      window.removeEventListener('load', refazer);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return <div ref={barra} className="leitura" aria-hidden="true" />;
}

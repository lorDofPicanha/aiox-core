'use client';

import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/**
 * §1 HERO
 *
 * O objeto 3D é o autômato de bronze (ver TalosCore.tsx) — não é enfeite abstrato: é o
 * nome da marca renderizado em tempo real, dando as voltas que Talos dava em Creta.
 *
 * Sobre o movimento: a regra de conversão que continua valendo é a janela de 10s. A
 * headline entra em 0,5s, sem delay, com stagger de 30ms por palavra — está legível antes
 * de qualquer pessoa terminar de focar a tela. O que a régua antiga proibia (scroll-scrub
 * no texto, preloader, revelar em 3s) continua fora; entrada rápida não é isso.
 */

const TalosCore = dynamic(() => import('./TalosCore').then((m) => m.TalosCore), {
  ssr: false,
  loading: () => null,
});

const TITULO = 'O trabalho repetitivo da sua empresa não precisa de'.split(' ');

export function Hero() {
  return (
    <section
      style={{
        paddingTop: 'var(--s-16)',
        paddingBottom: 'var(--s-16)',
        overflow: 'hidden',
        minHeight: '94vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="tx-grid" aria-hidden="true" />
      <div className="tx-glow" aria-hidden="true" />

      {/* A cena ocupa o terço direito no desktop e o fundo inteiro no celular. */}
      <div className="hero-cena" aria-hidden="true">
        <TalosCore />
      </div>

      <div className="wrap" style={{ position: 'relative', width: '100%' }}>
        <motion.p
          className="t-label"
          style={{ marginBottom: 'var(--s-6)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
        >
          automação de processos · construção de sites
        </motion.p>

        {/* Largura recalibrada quando a escala subiu para 112px: a 19ch a headline
            quebrava em 4 linhas e "gente." caía em cima do objeto — bronze sobre bronze,
            justamente na palavra que carrega a promessa. 16ch resolve em 3 linhas com a
            coluna de texto inteira à esquerda da cena. */}
        <h1 className="t-display-xl" style={{ maxWidth: '16ch' }}>
          {TITULO.map((palavra, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block', marginRight: '0.26em' }}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: [0, 0, 0.2, 1] }}
            >
              {palavra}
            </motion.span>
          ))}
          <motion.span
            className="bronze"
            style={{ display: 'inline-block' }}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: TITULO.length * 0.03, ease: [0, 0, 0.2, 1] }}
          >
            gente.
          </motion.span>
        </h1>

        <motion.p
          className="t-body-l"
          style={{ marginTop: 'var(--s-6)', maxWidth: '46ch' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34, ease: [0, 0, 0.2, 1] }}
        >
          Eu construo as máquinas que fazem esse trabalho sozinhas — e a primeira delas
          é o seu site.
        </motion.p>

        <motion.div
          style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-8)', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44, ease: [0, 0, 0.2, 1] }}
        >
          <motion.a
            href="#demo"
            className="btn btn-primary"
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            mapear meu processo <ArrowRight size={17} strokeWidth={2.2} />
          </motion.a>
          <motion.a
            href="#comeco"
            className="btn btn-ghost"
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            por onde começa
          </motion.a>
        </motion.div>

        <motion.div
          style={{ marginTop: 'var(--s-16)' }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0, 0, 0.2, 1] }}
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Preview estático do que o demo entrega. Não simula processamento —
 * mostra o formato do resultado. O demo real e interativo vive na §3.
 */
function HeroPreview() {
  const steps = [
    { n: '01', label: 'pedido chega no e-mail' },
    { n: '02', label: 'alguém copia pra planilha' },
    { n: '03', label: 'alguém avisa o financeiro' },
  ];

  return (
    <div className="tx-card" style={{ padding: 'var(--s-6)', maxWidth: 780 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 'var(--s-4)',
          borderBottom: '1px solid var(--rule)',
          gap: 'var(--s-4)',
          flexWrap: 'wrap',
        }}
      >
        <span className="t-micro">exemplo · processo mapeado</span>
        <span className="t-micro" style={{ color: 'var(--bronze)' }}>
          3 de 3 etapas automatizáveis
        </span>
      </div>

      <ul style={{ listStyle: 'none', marginTop: 'var(--s-4)' }}>
        {steps.map((s, i) => (
          <motion.li
            key={s.n}
            className="linha-etapa"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.7 + i * 0.09, ease: [0, 0, 0.2, 1] }}
          >
            <span className="t-micro num">{s.n}</span>
            <span style={{ color: 'var(--text)', fontSize: 15 }}>{s.label}</span>
            <span className="selo selo-auto">automatizável</span>
          </motion.li>
        ))}
      </ul>

      <p className="t-body" style={{ marginTop: 'var(--s-4)', fontSize: 14 }}>
        Logo abaixo você descreve o processo da sua empresa e recebe esse mapa na hora.
      </p>
    </div>
  );
}

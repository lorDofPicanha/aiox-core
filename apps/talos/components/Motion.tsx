'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Configuração global do Motion.
 *
 * `reducedMotion="user"` faz o Motion neutralizar transform e opacity em quem tem
 * "reduzir movimento" ligado no sistema — sem que nenhum componente precise trocar de
 * árvore por causa disso, que é justamente o que quebrava a hidratação antes.
 */
export function Motion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

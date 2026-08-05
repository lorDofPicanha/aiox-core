import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Problema } from '@/components/Problema';
import { Demo } from '@/components/Demo';
import { ComoFunciona } from '@/components/ComoFunciona';
import { PorOndeComeca } from '@/components/PorOndeComeca';
import { Escada } from '@/components/Escada';
import { Marquee } from '@/components/Marquee';
import { CasosDeUso } from '@/components/CasosDeUso';
import { QuemFaz } from '@/components/QuemFaz';
import { Prova } from '@/components/Prova';
import { FAQ } from '@/components/FAQ';
import { Contato, Footer } from '@/components/Contato';
import { ScrollFX } from '@/components/ScrollFX';

/**
 * Ordem das seções — base em 03-wireframe/WIREFRAME.md.
 * Reconhecimento (§2) vem antes da prova (§3); amplitude (§6) só depois das duas.
 * Trocar a ordem quebra o argumento, não só o layout.
 *
 * Duas entraram em 27/Jul, vindas da rodada 2 de referências (REFERENCIAS-R2.md):
 *  · CasosDeUso — logo depois da Escada. A Escada dá as CATEGORIAS do que se automatiza;
 *    ninguém se reconhece numa categoria. Aqui o dono de metalúrgica lê o processo dele.
 *  · FAQ — depois da Prova e antes do Contato, que é onde a objeção aparece de verdade:
 *    a pessoa já quer, e está procurando motivo para não. Padrão do Iventions.
 */
export default function Home() {
  return (
    <>
      <ScrollFX />
      <Nav />
      <main>
        <Hero />
        <Problema />
        <Demo />
        <ComoFunciona />
        <PorOndeComeca />
        <Escada />
        {/* Respiro entre a amplitude (Escada) e o reconhecimento concreto (CasosDeUso).
            Nove seções seguidas com a mesma estrutura de cabeçalho + grade cansam; a
            faixa quebra o ritmo sem custar conteúdo. */}
        <Marquee />
        <CasosDeUso />
        <QuemFaz />
        <Prova />
        <FAQ />
        <Contato />
      </main>
      <Footer />
    </>
  );
}

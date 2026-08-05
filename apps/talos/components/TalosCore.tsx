'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * O AUTÔMATO — cena three.js do hero.
 *
 * Τάλως era o autômato de bronze de Hefesto: dava três voltas por dia ao redor de Creta,
 * sem parar, sem ninguém mandar. É literalmente a oferta do site — trabalho que acontece
 * sozinho. Por isso o objeto é um núcleo de bronze com anéis em ronda, não um blob abstrato.
 *
 * Decisões técnicas:
 *  - Environment montado com <Lightformer>, não com preset. Preset do drei baixa HDR de CDN;
 *    aqui o env map é gerado em runtime, sem rede e sem asset externo.
 *  - Bronze de verdade: metalness 1 + roughness baixa só rende se houver o que refletir.
 *    As três lightformers existem para isso — sem elas o metal fica preto.
 *  - dpr limitado a 1.5 e frameloop sempre ativo mas com geometria mínima: a cena inteira
 *    tem menos de 3k triângulos.
 */

const BRONZE = '#e9a23b';

function Nucleo() {
  const malha = useRef<THREE.Mesh>(null);
  const gaiola = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (malha.current) {
      malha.current.rotation.y += dt * 0.18;
      malha.current.rotation.x += dt * 0.06;
    }
    // a gaiola gira ao contrário: dá a leitura de duas peças independentes,
    // não de um objeto só com textura
    if (gaiola.current) {
      gaiola.current.rotation.y -= dt * 0.1;
      gaiola.current.rotation.z += dt * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={malha}>
        <icosahedronGeometry args={[1.15, 1]} />
        {/* roughness 0.22 deixava metade das facetas pretas: metalness 1 só devolve o que
            existe no env map, e o que existe fora das lightformers é vazio. 0.34 espalha
            o reflexo o bastante para o bronze ler como bronze em toda a volta. */}
        <meshStandardMaterial
          color={BRONZE}
          metalness={0.94}
          roughness={0.34}
          envMapIntensity={1.5}
          flatShading
        />
      </mesh>

      <mesh ref={gaiola} scale={1.62}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={BRONZE} wireframe transparent opacity={0.13} />
      </mesh>
    </group>
  );
}

/** As três voltas por dia. Cada anel numa inclinação e numa velocidade diferentes. */
function Ronda() {
  const anéis = useRef<THREE.Group>(null);
  const config = useMemo(
    () => [
      { r: 2.05, tubo: 0.008, inc: [1.35, 0.2, 0.1], vel: 0.32, op: 0.75 },
      { r: 2.45, tubo: 0.006, inc: [0.6, 0.9, -0.3], vel: -0.22, op: 0.5 },
      { r: 2.9, tubo: 0.005, inc: [1.9, -0.4, 0.55], vel: 0.14, op: 0.3 },
    ],
    [],
  );

  useFrame((estado) => {
    if (!anéis.current) return;
    const t = estado.clock.elapsedTime;
    anéis.current.children.forEach((filho, i) => {
      filho.rotation.z = t * config[i].vel;
    });
  });

  return (
    <group ref={anéis}>
      {config.map((c, i) => (
        <mesh key={i} rotation={c.inc as [number, number, number]}>
          <torusGeometry args={[c.r, c.tubo, 8, 128]} />
          <meshStandardMaterial
            color={BRONZE}
            metalness={0.9}
            roughness={0.3}
            transparent
            opacity={c.op}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Poeira de bronze. Existe para dar escala e profundidade ao vazio ao redor do núcleo. */
function Poeira({ quantidade = 260 }: { quantidade?: number }) {
  const pontos = useRef<THREE.Points>(null);

  const posicoes = useMemo(() => {
    const a = new Float32Array(quantidade * 3);
    for (let i = 0; i < quantidade; i++) {
      // distribuição em casca esférica: evita o aglomerado no centro que
      // um random cúbico sempre produz
      const raio = 2.6 + Math.random() * 3.4;
      const teta = Math.random() * Math.PI * 2;
      const fi = Math.acos(2 * Math.random() - 1);
      a[i * 3] = raio * Math.sin(fi) * Math.cos(teta);
      a[i * 3 + 1] = raio * Math.sin(fi) * Math.sin(teta) * 0.6;
      a[i * 3 + 2] = raio * Math.cos(fi);
    }
    return a;
  }, [quantidade]);

  useFrame((_, dt) => {
    if (pontos.current) pontos.current.rotation.y += dt * 0.035;
  });

  return (
    <points ref={pontos}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posicoes, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={BRONZE}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Parallax de câmera pelo ponteiro. Sutil de propósito — 0.35 de amplitude. */
function Parallax() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function TalosCore() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Sem isto o metal fica preto: metalness 1 só mostra o que há para refletir. */}
      <Environment resolution={192}>
        {/* key quente e grande — é a fonte do dourado */}
        <Lightformer intensity={4} color="#ffd8a0" position={[3.5, 3, 2]} scale={[9, 9, 1]} />
        {/* fill frio do lado oposto: sem ele metade do objeto some no fundo */}
        <Lightformer intensity={2} color="#8fb0ff" position={[-5, -0.5, -2]} scale={[8, 8, 1]} />
        {/* faixa inferior — o "chão" que dá o reflexo de baixo em qualquer metal real */}
        <Lightformer intensity={1.4} color="#ffffff" position={[0, -4.5, 1]} scale={[10, 3, 1]} />
        {/* anel de trás: cria a linha de luz que desenha a silhueta */}
        <Lightformer
          form="ring"
          intensity={3}
          color="#ffc27a"
          position={[0, 0, -5]}
          scale={[7, 7, 1]}
        />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#ffd8a0" />
      {/* rim light fria: separa a silhueta do fundo quase-preto */}
      <directionalLight position={[-5, -2, -4]} intensity={1.3} color="#6f8fd6" />

      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.5}>
        <Nucleo />
      </Float>
      <Ronda />
      <Poeira />
      <Parallax />
    </Canvas>
  );
}

import { Linkedin, Github } from 'lucide-react';
import { PERFIL } from '@/lib/perfil';
import { Reveal } from './Reveal';

/**
 * §7 QUEM FAZ
 *
 * Seção curta e obrigatória. O founder disse que não quer falar de si — e não precisa
 * falar de resultado. Mas precisa EXISTIR, com rosto e link verificável: o 4º fator de
 * credibilidade da NN/g é conexão com o resto da web, e todo participante do estudo disse
 * que pesquisaria o prestador antes de contratar. Anonimato custa mais que modéstia.
 *
 * Os links renderizam só se preenchidos em lib/perfil.ts — link para perfil vazio pontua
 * pior que link nenhum.
 */
export function QuemFaz() {
  const temLink = PERFIL.linkedin || PERFIL.github;

  return (
    <section id="quem">
      <div className="wrap">
        <Reveal>
        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: PERFIL.foto ? '96px 1fr' : '1fr',
            gap: 'var(--s-8)',
            alignItems: 'center',
            padding: 'var(--s-8)',
          }}
        >
          {PERFIL.foto && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={PERFIL.foto}
              alt={PERFIL.nome}
              width={96}
              height={96}
              style={{
                width: 96,
                height: 96,
                borderRadius: 'var(--r-full)',
                objectFit: 'cover',
                border: '1px solid var(--rule-2)',
              }}
            />
          )}

          <div>
            <p className="t-micro" style={{ marginBottom: 'var(--s-3)' }}>quem faz</p>

            <h2 className="t-title" style={{ marginBottom: 'var(--s-3)' }}>
              {PERFIL.nome}
            </h2>

            <p className="t-body" style={{ maxWidth: '58ch' }}>
              {PERFIL.bio}
            </p>

            {temLink && (
              <div style={{ display: 'flex', gap: 'var(--s-3)', marginTop: 'var(--s-6)', flexWrap: 'wrap' }}>
                {PERFIL.linkedin && (
                  <a
                    href={PERFIL.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    style={{ height: 40, padding: '0 16px', fontSize: 14 }}
                  >
                    <Linkedin size={16} strokeWidth={2} /> LinkedIn
                  </a>
                )}
                {PERFIL.github && (
                  <a
                    href={PERFIL.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    style={{ height: 40, padding: '0 16px', fontSize: 14 }}
                  >
                    <Github size={16} strokeWidth={2} /> GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SectionHead } from './SectionHead';
import { PERFIL, temWhatsapp, linkWhatsapp } from '@/lib/perfil';

/**
 * §9 CTA FINAL
 *
 * Três campos, não sete — formulário longo gera atrito (NN/g). O terceiro campo é o mais
 * valioso: qualifica e já alimenta a conversa de venda.
 *
 * ── COMO ESTÁ ENVIANDO HOJE ──────────────────────────────────────────────────
 * Não existe backend ainda. O envio monta a mensagem e abre o WhatsApp com tudo
 * preenchido — funciona de verdade, hoje, sem servidor. Sem número configurado em
 * lib/perfil.ts o formulário DIZ que não está configurado em vez de fingir que enviou:
 * botão que engole o lead em silêncio é pior que botão que não existe.
 *
 * ── PRÓXIMO PASSO (planejado no wireframe) ───────────────────────────────────
 * Este formulário deve passar a ser atendido pelo MESMO agente do demo da §3. É o que
 * fecha o argumento do site inteiro: o visitante vê a máquina funcionando na §3 e é
 * atendido por ela na §9 — demonstração e entrega viram o mesmo objeto, que é
 * literalmente o modelo de negócio. Trocar o `abrirWhatsapp` por um POST na rota do
 * agente é a única mudança necessária aqui.
 */
export function Contato() {
  const [nome, setNome] = useState('');
  const [zap, setZap] = useState('');
  const [dor, setDor] = useState('');
  const [erro, setErro] = useState('');

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!temWhatsapp()) {
      setErro(
        'O número de destino ainda não foi configurado neste site. Preencha PERFIL.whatsapp em lib/perfil.ts antes de publicar.',
      );
      return;
    }

    const msg = [
      `Oi! Sou ${nome.trim()}.`,
      dor.trim() && `O que mais consome tempo aqui: ${dor.trim()}`,
      zap.trim() && `Meu contato: ${zap.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(linkWhatsapp(msg), '_blank', 'noopener,noreferrer');
  };

  const pronto = nome.trim().length > 1 && dor.trim().length > 3;

  return (
    <section id="contato">
      <div className="wrap">
        <SectionHead
          label="contato"
          title={<>Me conta o que se repete na sua empresa.</>}
          lead="Não precisa saber o que quer construir. Descreve o que te consome tempo — o resto é comigo. Respondo eu, não um formulário."
        />

        <div className="grid-2">
          <form onSubmit={enviar} className="card" style={{ display: 'grid', gap: 'var(--s-4)' }}>
            <div>
              <label htmlFor="nome" className="t-micro" style={{ display: 'block', marginBottom: 'var(--s-2)' }}>
                seu nome
              </label>
              <input
                id="nome"
                className="field"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="zap" className="t-micro" style={{ display: 'block', marginBottom: 'var(--s-2)' }}>
                whatsapp
              </label>
              <input
                id="zap"
                className="field"
                value={zap}
                onChange={(e) => setZap(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label htmlFor="dor" className="t-micro" style={{ display: 'block', marginBottom: 'var(--s-2)' }}>
                o que mais consome tempo hoje?
              </label>
              <textarea
                id="dor"
                className="field"
                value={dor}
                onChange={(e) => setDor(e.target.value)}
                style={{ minHeight: 104 }}
                required
              />
            </div>

            {erro && (
              <p
                className="t-body"
                style={{ fontSize: 13, color: 'var(--negative)' }}
                role="alert"
              >
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!pronto}
              style={{ opacity: pronto ? 1 : 0.45, justifySelf: 'start' }}
            >
              enviar <ArrowRight size={17} strokeWidth={2.2} />
            </button>
          </form>

          <div style={{ display: 'grid', gap: 'var(--s-4)', alignContent: 'start' }}>
            <div className="card">
              <h3 className="t-title" style={{ marginBottom: 'var(--s-3)' }}>
                Ou chama direto
              </h3>
              <p className="t-body" style={{ marginBottom: 'var(--s-6)' }}>
                Se preferir pular o formulário, o WhatsApp é o mesmo lugar onde a conversa
                ia acabar de qualquer jeito.
              </p>

              {temWhatsapp() ? (
                <a
                  href={linkWhatsapp('Oi! Vim pelo site.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <MessageCircle size={17} strokeWidth={2} /> abrir WhatsApp
                </a>
              ) : (
                <p className="t-micro" style={{ color: 'var(--negative)' }}>
                  ⚠ número não configurado — ver lib/perfil.ts
                </p>
              )}
            </div>

            <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
              <p className="t-body" style={{ fontSize: 14 }}>
                Se você já mapeou o seu processo lá em cima, cola o resultado aqui na
                mensagem. A conversa começa três passos à frente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--rule)', padding: 'var(--s-12) 0' }}>
      <div
        className="wrap"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--s-6)',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-d)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>
            talos
          </p>
          <p className="t-body" style={{ fontSize: 13, marginTop: 2 }}>
            máquinas que fazem o trabalho repetitivo da sua empresa.
          </p>
        </div>

        <nav style={{ display: 'flex', gap: 'var(--s-6)', flexWrap: 'wrap' }}>
          <a href="#problema" className="nav-link" style={{ display: 'inline' }}>o problema</a>
          <a href="#demo" className="nav-link" style={{ display: 'inline' }}>ver rodando</a>
          <a href="#comeco" className="nav-link" style={{ display: 'inline' }}>por onde começa</a>
          {PERFIL.email && (
            <a href={`mailto:${PERFIL.email}`} className="nav-link" style={{ display: 'inline' }}>
              {PERFIL.email}
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}

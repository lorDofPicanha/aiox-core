import { SectionHead } from './SectionHead';
import { Reveal, RevealStagger } from './Reveal';

/**
 * §2 O PROBLEMA — reconhecimento
 *
 * O dono de PME não pensa "preciso de IA". Ele pensa "tô perdendo cliente no WhatsApp".
 * Por isso cada card é uma CENA concreta, com carimbo de quando/quantas vezes acontece —
 * não um benefício abstrato. Reconhecimento é o mecanismo de conversão aqui, não amplitude
 * (a amplitude fica na §6, depois da prova).
 */
const CENAS = [
  {
    carimbo: '22:14',
    titulo: 'Chega pedido fora do horário',
    corpo:
      'O cliente manda mensagem à noite. Ninguém vê até as oito da manhã seguinte — e às vezes ele já resolveu com outro.',
  },
  {
    carimbo: '3×',
    titulo: 'A mesma informação, três vezes',
    corpo:
      'Alguém lê no e-mail, digita no sistema e repete na planilha. Três chances de errar, zero de ganhar.',
  },
  {
    carimbo: 'toda segunda',
    titulo: 'A manhã que o relatório come',
    corpo:
      'Uma pessoa passa metade do dia montando à mão o número que a operação da semana inteira já produziu.',
  },
];

export function Problema() {
  return (
    <section id="problema">
      <div className="wrap">
        <SectionHead
          label="o problema"
          title={<>Você reconhece algum desses?</>}
        />

        <RevealStagger className="grid-3">
          {CENAS.map((c) => (
            <article key={c.carimbo} className="card card-hover" style={{ height: '100%' }}>
              <span className="selo selo-auto" style={{ display: 'inline-block', marginBottom: 'var(--s-6)' }}>
                {c.carimbo}
              </span>

              <h3 className="t-title" style={{ marginBottom: 'var(--s-3)' }}>
                {c.titulo}
              </h3>

              <p className="t-body">{c.corpo}</p>
            </article>
          ))}
        </RevealStagger>

        <Reveal delay={0.1}>
          <p
            className="t-body-l"
            style={{ marginTop: 'var(--s-12)', maxWidth: '46ch', color: 'var(--text)' }}
          >
            Nenhum desses é problema de tecnologia.{' '}
            <span className="bronze">São de processo — e processo se automatiza.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

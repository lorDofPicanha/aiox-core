import { Card } from "@/components/Card";
import { TopBar } from "@/components/TopBar";

/** Placeholder honesto para rotas que serão entregues em stories posteriores. */
export function ComingSoon({ title, story }: { title: string; story: string }) {
  return (
    <>
      <TopBar title={title} sub={`Entregue em ${story}`} />
      <div className="content">
        <Card title="Em construção">
          <p className="muted">
            Esta tela faz parte da Fase 1 e será construída na story <strong>{story}</strong>.
            A fundação (core + api-client tipado + tokens) já está ligada — ver Carteira.
          </p>
        </Card>
      </div>
    </>
  );
}

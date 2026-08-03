import { mapear } from "./mapear.js";

const SINAL = {
  automatizavel:{cls:"auto",rot:"sai da sua mão",ic:'<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'},
  parcial:{cls:"parcial",rot:"fica pela metade",ic:'<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor"/></svg>'},
  humana:{cls:"humana",rot:"fica com você",ic:'<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.4"/></svg>'},
  nao_lida:{cls:"naoli",rot:"não li",ic:'<svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'}
};
const q = (s,r=document)=>r.querySelector(s);
const esc = (s)=>String(s).replace(/[&<>"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const vg = (n)=>String(n).replace(".",",");

/* ── §4 abas ── */
document.querySelectorAll("[data-aba]").forEach((b)=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll("[data-aba]").forEach((o)=>o.setAttribute("aria-selected",String(o===b)));
    document.querySelectorAll(".painel-ramo").forEach((p)=>{p.hidden = p.id !== "pnl-"+b.dataset.aba;});
  });
});
/* ── §4 → §5: "esse é o meu" pré-preenche e rola ── */
document.querySelectorAll("[data-exemplo]").forEach((b)=>{
  b.addEventListener("click",()=>{
    const t = q("#proc"); if(!t) return;
    t.value = b.dataset.exemplo;
    rodar();
    q("#prova")?.scrollIntoView({behavior:"smooth",block:"start"});
    t.focus({preventScroll:true});
  });
});

/* ── §5 demo. Zero delay artificial, zero spinner: o tempo mostrado é o real. ── */
function rodar(){
  const t = q("#proc"); if(!t) return;
  const qtd = Math.max(1, parseInt(q("#freq")?.value || "5", 10));
  const porSemana = q("#periodo")?.value === "mes" ? qtd/4.33 : qtd;
  const r = mapear(t.value, porSemana);

  q("#etapas").innerHTML = r.etapas.map((e)=>{
    const s = SINAL[e.vereditoReal];
    return '<div class="etapa etapa--'+s.cls+'">'+
      '<span class="etapa-n">'+String(e.n).padStart(2,"0")+'</span>'+
      '<span><span class="etapa-txt">'+esc(e.texto)+'</span><span class="etapa-motivo">'+esc(e.motivo)+'</span></span>'+
      '<span class="etapa-sinal">'+s.ic+s.rot+'</span></div>';
  }).join("");

  q("#resumo").textContent =
    r.automatizaveis+" saem da sua mão · "+r.parciais+" pela metade · "+r.humanas+" ficam com você"+
    (r.naoLidas ? " · "+r.naoLidas+" não li" : "");
  q("#horas").textContent = vg(r.horasMes);
  const minExec = r.vezesPorSemana ? Math.round(r.minutosSemana / r.vezesPorSemana) : 0;
  q("#premissa").innerHTML =
    "A conta: "+minExec+" minutos por execução × "+vg(Math.round(r.vezesPorSemana*10)/10)+" vezes por semana × 4,33 semanas no mês. "+
    "Etapa que eu não li vale zero — somar seria chute. Parcial entra pela metade, porque a máquina redige e você confere.";
  q("#trace").innerHTML =
    '<p class="t-micro" style="margin-bottom:8px">a máquina por dentro</p>'+
    r.trace.map((x)=>'<div class="trace-l"><span>'+esc(x.op)+" — "+esc(x.detalhe)+'</span><b>'+vg(x.ms)+' ms</b></div>').join("")+
    '<div class="trace-l" style="border-top:1px solid var(--border);margin-top:8px;padding-top:6px"><span>total</span><b>'+vg(r.totalMs)+' ms</b></div>';

  /* furo de conversão nº 1: o mapa PERSISTE até a §12 e o card mostra que já foi anexado */
  try{ sessionStorage.setItem("talos-mapa", JSON.stringify({texto:t.value, horas:r.horasMes, passos:r.etapasDetectadas, auto:r.automatizaveis})); }catch(_){}
  pintarAnexo();
}
function pintarAnexo(){
  const el = q("#anexo"); if(!el) return;
  let m = null; try{ m = JSON.parse(sessionStorage.getItem("talos-mapa")||"null"); }catch(_){}
  if(!m){ el.hidden = true; return; }   /* sem mapa, o card não renderiza. Nunca pedir cópia manual. */
  el.hidden = false;
  el.querySelector("p").innerHTML =
    "Aquele que você fez ali em cima — <b>"+m.passos+" passos</b>, <b>"+m.auto+" saem da sua mão</b>, <b>"+vg(m.horas)+" h por mês</b>. "+
    'Você não precisa copiar nada. <a href="#prova" style="border-bottom:1px solid var(--border-strong)">editar</a>';
}
q("#btn-ver")?.addEventListener("click",rodar);
q("#btn-ex")?.addEventListener("click",()=>{
  q("#proc").value = "O cliente me chama no zap pedindo orçamento. Eu confiro o preço na tabela e monto a proposta. Depois eu registro na planilha de vendas. Aí eu aviso o vendedor. Na sexta eu fecho o relatório da semana na mão.";
  rodar();
});
q("#periodo")?.addEventListener("change",rodar);
pintarAnexo();

/* ── §2: duração da faixa = largura da track ÷ 40 px/s. Nunca copiar a duração da referência. ── */
const track = q(".faixa-track");
if(track){
  requestAnimationFrame(()=>{
    const d = Math.round(track.scrollWidth / 2 / 40);
    track.style.setProperty("--dur", d+"s");
  });
}

/* ── §6: o nó ativo do trilho acompanha o scroll (gesto conicorn 004 PROCESS) ── */
const passos = [...document.querySelectorAll(".passo")];
if(passos.length && "IntersectionObserver" in window){
  const io = new IntersectionObserver((es)=>{
    es.forEach((e)=>{ if(e.isIntersecting){ passos.forEach((p)=>p.classList.remove("passo--ativo")); e.target.classList.add("passo--ativo"); } });
  },{rootMargin:"-45% 0px -45% 0px"});
  passos.forEach((p)=>io.observe(p));
}

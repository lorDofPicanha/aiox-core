/**
 * ⚠️ PREENCHER ANTES DE PUBLICAR — dados da §7 e do rodapé.
 *
 * Nada aqui pode ser inventado por mim. Nome, tempo de estrada e links são fatos sobre
 * uma pessoa real; chutar qualquer um deles é exatamente a violação de confiança que o
 * projeto proíbe (CONTEXT.md §3).
 *
 * Sobre os links: campo vazio NÃO renderiza o botão. Isso é de propósito — a pesquisa da
 * NN/g coloca "conexão com o resto da web" como 4º fator de credibilidade, e link para
 * perfil vazio ou abandonado pontua PIOR que link nenhum. Só preencha quando o perfil
 * estiver apresentável.
 */
export const PERFIL = {
  /** Nome como você quer ser chamado pelo cliente. */
  nome: 'PREENCHER: nome',

  /** Uma linha, sem número que você não possa provar. */
  bio:
    'PREENCHER: uma linha sobre o que você constrói. Sem "+X anos de experiência" se você não quiser — o que sustenta a seção é o rosto e os links, não o currículo.',

  /** Caminho da foto em /public. Sem foto, a seção renderiza só o texto. */
  foto: '',

  /** URLs completas. Vazio = botão não aparece. */
  linkedin: '',
  github: '',

  /** Só dígitos, com DDI. Ex.: 5547999999999 */
  whatsapp: '',

  /** Aparece no rodapé. Deixe vazio se não quiser expor. */
  email: '',
} as const;

export const temWhatsapp = () => PERFIL.whatsapp.replace(/\D/g, '').length >= 12;

export const linkWhatsapp = (mensagem: string) =>
  `https://wa.me/${PERFIL.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;

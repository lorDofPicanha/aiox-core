import { connect } from 'framer-api';
import fs from 'node:fs';

const envText = fs.readFileSync('D:/AIOS/.env.local', 'utf8');
const env = Object.fromEntries(
  envText.split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

if (!env.FRAMER_API_KEY || !env.FRAMER_PROJECT_URL) {
  throw new Error('FRAMER_API_KEY e FRAMER_PROJECT_URL são obrigatórios em .env.local');
}

const translations = new Map([
  ['Get 3 months free on the Pro plan.', 'Ganhe 3 meses grátis no plano Pro.'],
  ['Start by creating your account using the link below:', 'Comece criando sua conta usando o link abaixo:'],
  ['Then apply the following code when upgrading to the Pro yearly plan to get 3 months free.', 'Depois, use o código abaixo ao fazer upgrade para o plano Pro anual e ganhe 3 meses grátis.'],
  ['Need help customizing this template?', 'Precisa de ajuda para personalizar este template?'],
  ['If you’d like help adapting this template to your project, I offer:', 'Se quiser ajuda para adaptar este template ao seu projeto, ofereço:'],
  ['If you\'d like help adapting this template to your project, I offer:', 'Se quiser ajuda para adaptar este template ao seu projeto, ofereço:'],
  ['• Template customization (full or partial)• Fully custom Framer website design and build • Logo design', '• Personalização de template (completa ou parcial) • Criação e desenvolvimento de site Framer sob medida • Criação de logotipo'],
  ['Interested? Get in touch:', 'Tem interesse? Entre em contato:'],
  ['CAPRAGIO DI MANZO', 'CARPACCIO DE FILÉ'],
  ['€6.00', '€6,00'],
  ['Thinly sliced raw beef with arugula, parmesan shavings, lemon, and olive oil.', 'Fatias finas de carne bovina crua com rúcula, lascas de parmesão, limão e azeite de oliva.'],
  ['Antipasti', 'Antepastos'],
  ['ANTIPASTI', 'ANTEPastos'.toUpperCase()],
  ['Created by Damir Cosic', 'Criado por Damir Cosic'],
  ['© 2026 Ristorante Framer Template', '© 2026 Template Ristorante do Framer'],
  ['NAV LINK', 'LINK DE NAVEGAÇÃO'],
  ['OUR MENU', 'NOSSO CARDÁPIO'],
  ['average rating on Tripadvisor', 'avaliação média no Tripadvisor'],
  ['Reserve a table', 'Reserve uma mesa'],
  ['We found this place while visiting the city and came back twice. The pasta was excellent, and the atmosphere felt warm and welcoming.', 'Encontramos este lugar enquanto visitávamos a cidade e voltamos duas vezes. A massa estava excelente e o ambiente era acolhedor e convidativo.'],
  ['Traditional Italian recipes cooked using classic methods', 'Receitas italianas tradicionais preparadas com métodos clássicos'],
  ['Name', 'Nome'],
  ['Email', 'E-mail'],
  ['Message', 'Mensagem'],
  ['Back to Home', 'Voltar ao início'],
  ['Submit', 'Enviar'],
  ['Thank you', 'Obrigado'],
  ['Something went wrong', 'Algo deu errado'],
  ['ITALIAN RESTAURANT', 'RESTAURANTE ITALIANO'],
  ['Tradition on Every Plate', 'Tradição em cada prato'],
  ['Authentic Italian dishes prepared with care, tradition, and a passion for simple, honest flavors.', 'Pratos italianos autênticos, preparados com cuidado, tradição e paixão por sabores simples e honestos.'],
  ['Tradition Since 1992', 'Tradição desde 1992'],
  ['Inspired by generations of Italian cooking, we celebrate classic flavors and a welcoming dining experience. Located at the heart of the city, we’re a favorite stop for locals and travelers alike.', 'Inspirados por gerações de culinária italiana, celebramos sabores clássicos e uma experiência acolhedora. No coração da cidade, somos uma parada querida por moradores e viajantes.'],
  ['Book your table in advance and enjoy authentic Italian cuisine in a relaxed, welcoming atmosphere.', 'Reserve sua mesa com antecedência e aproveite a autêntica culinária italiana em um ambiente descontraído e acolhedor.'],
  ['RESERVE A TABLE', 'RESERVE UMA MESA'],
  ['Contact us', 'Fale conosco'],
  ['Have a question or planning a visit? Get in touch and our team will be happy to assist you.', 'Tem alguma dúvida ou está planejando uma visita? Fale conosco; nossa equipe terá prazer em ajudar.'],
  ['Message Sent', 'Mensagem enviada'],
  ['We’ve received your message and will get back to you as soon as possible. We look forward to welcoming you.', 'Recebemos sua mensagem e retornaremos o mais breve possível. Será um prazer receber você.'],
]);

const framer = await connect(env.FRAMER_PROJECT_URL, env.FRAMER_API_KEY);
const nodes = await framer.getNodesWithType('TextNode');
let updated = 0;
const matched = new Map();

for (const node of nodes) {
  const current = node.name;
  const next = translations.get(current);
  if (!next || next === current) continue;
  if (typeof node.setText !== 'function') {
    throw new Error(`TextNode ${node.id} não expõe setText()`);
  }
  await node.setText(next);
  updated += 1;
  matched.set(current, (matched.get(current) ?? 0) + 1);
}

const verifyNodes = await framer.getNodesWithType('TextNode');
const remainingEnglish = verifyNodes
  .map((node) => node.name)
  .filter((name) => translations.has(name));

console.log(JSON.stringify({
  connected: true,
  textNodes: nodes.length,
  updated,
  matched: Object.fromEntries(matched),
  remainingEnglishCount: remainingEnglish.length,
  published: false,
}));

await framer.disconnect();

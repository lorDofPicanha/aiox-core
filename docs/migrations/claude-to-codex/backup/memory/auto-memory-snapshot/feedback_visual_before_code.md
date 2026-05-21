---
name: Visual Before Code Enforcement
description: Workflow obrigatório para qualquer story/task com front-end — design antes de código
type: feedback
---

NUNCA implementar front-end/UI diretamente com @dev. Seguir workflow obrigatório:

1. @design-chief (routing) → escolhe especialista certo
2. @ux (*wireframe high) → estrutura + UX + spec
3. @design-system (*tokenize + *build) → tokens + componentes atômicos
4. @dev (implementa funcionalidade SOBRE os componentes prontos)
5. @design-chief (*critique) → revisão final de qualidade visual

**Why:** Outputs de páginas/landing pages ficaram com visual de infoproduto genérico quando @dev criou HTML direto sem passar pelo design squad. 25 Mind Clones experts confirmaram problemas graves de design (Julie Zhuo, Don Norman, John Maeda).

**How to apply:** Qualquer task que envolva criação ou redesign de UI/front-end DEVE ativar o design squad primeiro. Se o usuário pedir para criar uma página, PERGUNTE se quer ativar o workflow Visual Before Code antes de começar a codar.

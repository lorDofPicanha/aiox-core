---
name: Meta System User App Role Fix
description: Quando System User token gera "Atribua uma função do app" / "Nenhuma permissão disponível" — fix é adicionar SU como Admin do app em developers.facebook.com (NÃO basta atribuir asset no BM).
type: feedback
originSessionId: 60020527-c949-4341-81da-1aa3cc54a729
---
# Meta SU "Atribua função do app" → Fix em developers.facebook.com

**Rule:** Quando gerar System User token Meta dá erro "Nenhuma permissão disponível — Atribua uma função do app ao usuário do sistema", o fix NÃO é em business.facebook.com. É em **developers.facebook.com → App Roles → Roles → Add Admins → System Users tab**.

**Why:** Meta exige que System User seja Admin do app NO LADO DE DEV (não só asset assignment no BM). Se app está em outro BM, ou só foi linkado sem role assignment, dropdown de apps fica vazio quando user vai gerar token.

Confirmado funcional em Tocks 04/Mai (e Bretda em sessão anterior). Fluxo:

1. `developers.facebook.com → My Apps → pick app`
2. Sidebar esquerdo: **App Roles** → **Roles**
3. Aba **Administrators** → botão **"Add Admins"**
4. Dialog tem 2 abas: "People" + "System Users" → escolhe **System Users**
5. Adiciona o SU do BM target → confirma 2FA se pedir → Save
6. Volta `business.facebook.com → BM target → System Users → SU → Generate Token` → app aparece no dropdown ✓

**How to apply:**
- Antes de prescrever caminhos longos (cross-BM share, Connect existing app), checar SE o problema é só falta de App Role no SU
- O fix em dev.facebook.com é mais rápido (~30s) que reconfigurar BM
- Se app NÃO está no BM target, esse fix sozinho não resolve — precisa também adicionar o app como asset no BM (mas isso é o passo cosmético; o real bloqueador é o App Role)

**Trap:** doc oficial Meta CAPI (`developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/`) usa o termo "install the app" pro SU, mas não documenta o caminho UI exato. Reconstruí de primeiros princípios.

**Sintoma exato Meta UI:**
```
Nenhuma permissão disponível
Atribua uma função do app ao usuário do sistema ou selecione outro app para continuar.
```

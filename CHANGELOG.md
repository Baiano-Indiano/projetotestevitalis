# Changelog — Vitalis

Documentação incremental das alterações do projeto. Cada entrada descreve o
que mudou, por quê e quais arquivos foram tocados, para facilitar revisão de
código no GitHub.

Formato: [Data] — Título
- **Contexto:** motivo da mudança
- **Mudanças:** o que foi feito
- **Arquivos:** caminhos afetados

---

## [2026-07-01] — Commits exigem descrição detalhada por arquivo

- **Contexto:** commits curtos dificultavam a revisão no GitHub; o usuário
  pediu que cada commit descreva em detalhe o que mudou.
- **Mudanças:**
  - `.gitmessage`: template expandido com seções obrigatórias
    (Motivo, Alterações por arquivo, Impacto) e exemplo detalhado.
  - `.githooks/commit-msg`: passa a exigir corpo com ≥200 caracteres,
    ≥3 linhas úteis e ao menos uma referência a caminho de arquivo
    (`src/`, `.tsx`, `.ts`, `.css`, `.md`, `.json`).
  - `CONTRIBUTING.md`: novo formato documentado com exemplo completo
    e regras aplicadas pelo hook.
- **Impacto:** commits ficam auto-explicativos; revisão no GitHub
  passa a mostrar motivo, escopo por arquivo e impacto esperado.
- **Arquivos:** `.gitmessage`, `.githooks/commit-msg`, `CONTRIBUTING.md`.

---

## [2026-07-01] — Padrão de commits + hook de validação

- **Contexto:** facilitar análise no GitHub exigindo que todo commit traga o
  motivo da mudança, no formato Conventional Commits.
- **Mudanças:**
  - Template `.gitmessage` com guia de tipos e exemplo.
  - Hook `.githooks/commit-msg` que valida assunto (`tipo(escopo): resumo`,
    ≤72 chars) e exige corpo com o "porquê".
  - `CONTRIBUTING.md` com instruções de ativação
    (`git config core.hooksPath .githooks`).
- **Arquivos:** `.gitmessage`, `.githooks/commit-msg`, `CONTRIBUTING.md`.

---

## [2026-07-01] — Sincronização de papel por rota (hook `useResolvedPapel`)

- **Contexto:** o seletor de perfil piscava com o valor antigo ao trocar de
  rota e outros componentes ainda liam `papel` direto do store, gerando
  labels incorretos ("Tutor" no painel da equipe e vice-versa).
- **Mudanças:**
  - Criado hook `useResolvedPapel()` que resolve o papel de forma síncrona a
    partir da rota (fora de `/painel` → `tutor`; dentro → `papel` do store
    com fallback `recepcao`).
  - `RoleSwitcher` passa a usar o hook como fonte de verdade e sincroniza o
    store via `useEffect`.
  - `EquipeShell` e `_equipe.painel.index` migrados para o hook, eliminando
    leituras diretas de `papel`.
- **Arquivos:**
  - `src/hooks/use-resolved-papel.ts` (novo)
  - `src/components/RoleSwitcher.tsx`
  - `src/components/EquipeShell.tsx`
  - `src/routes/_equipe.painel.index.tsx`

---

## Como manter este arquivo

A cada alteração significativa, adicione uma nova entrada no topo seguindo o
formato acima. Commits automáticos do Lovable sincronizam este arquivo com o
GitHub conectado ao projeto, permitindo revisão histórica do código.

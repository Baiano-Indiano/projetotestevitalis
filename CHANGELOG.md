# Changelog — Vitalis

Documentação incremental das alterações do projeto. Cada entrada descreve o
que mudou, por quê e quais arquivos foram tocados, para facilitar revisão de
código no GitHub.

Formato: [Data] — Título
- **Contexto:** motivo da mudança
- **Mudanças:** o que foi feito
- **Arquivos:** caminhos afetados

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

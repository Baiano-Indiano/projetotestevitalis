# Contribuindo

## Padrão de commits (Conventional Commits + descrição detalhada)

Toda mensagem de commit deve seguir:

```
<tipo>(<escopo>): <resumo curto no imperativo>

Motivo: <por que a mudança foi feita>

Alterações:
- <caminho/do/arquivo.tsx>: <o que mudou nele, em detalhe>
- <outro/arquivo.ts>: <o que mudou nele>

Impacto: <UX, performance, segurança, etc.>
```

Tipos: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`.

### Regras aplicadas pelo hook `commit-msg`

- Assunto no formato `tipo(escopo): resumo`, ≤72 caracteres.
- Corpo com ≥200 caracteres e ≥3 linhas úteis.
- Corpo DEVE citar pelo menos um caminho de arquivo alterado.
- Descrições genéricas como "ajustes" ou "fix bug" são rejeitadas —
  liste **cada** arquivo tocado e o que mudou nele.

### Exemplo válido

```
fix(role-switcher): sincroniza papel com a rota atual

Motivo: o seletor piscava com o valor antigo ao navegar entre portal
e painel, exibindo "Tutor" em telas da equipe.

Alterações:
- src/hooks/use-resolved-papel.ts: novo hook que deriva o papel do
  pathname (fora de /painel -> tutor; dentro -> store com fallback).
- src/components/RoleSwitcher.tsx: consome useResolvedPapel e
  sincroniza o store via useEffect.
- src/components/EquipeShell.tsx: remove leitura direta de `papel`
  e passa a usar o hook.

Impacto: elimina flash de label incorreto; nenhum impacto de perf.
```

## Ativar validação automática (uma vez, após clonar do GitHub)

```bash
git config core.hooksPath .githooks
git config commit.template .gitmessage
chmod +x .githooks/commit-msg
```

Depois disso, `git commit` abre o editor com o template do `.gitmessage`
e o hook rejeita commits sem descrição detalhada.

## Changelog

Além do commit, adicione uma entrada no topo de [`CHANGELOG.md`](./CHANGELOG.md)
com o mesmo nível de detalhe (motivo, arquivos, impacto).

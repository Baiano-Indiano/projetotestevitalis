# Contribuindo

## Padrão de commits (Conventional Commits + motivo)

Toda mensagem de commit deve seguir:

```
<tipo>(<escopo>): <resumo curto no imperativo>

<corpo explicando O PORQUÊ da mudança>
```

Tipos: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`.

Exemplo:

```
fix(role-switcher): sincroniza papel com a rota atual

O seletor piscava com o valor antigo ao navegar entre portal e painel.
Agora o hook useResolvedPapel deriva o papel direto do pathname,
evitando estados intermediários.
```

## Ativar validação automática (uma vez, após clonar do GitHub)

```bash
git config core.hooksPath .githooks
git config commit.template .gitmessage
chmod +x .githooks/commit-msg
```

Depois disso:

- `git commit` abre o editor já com o template do `.gitmessage`.
- O hook `commit-msg` rejeita commits fora do padrão ou sem corpo/motivo.

## Changelog

Além do commit, adicione uma entrada no topo de [`CHANGELOG.md`](./CHANGELOG.md)
descrevendo contexto, mudanças e arquivos afetados — isso facilita a revisão
histórica direto no GitHub.

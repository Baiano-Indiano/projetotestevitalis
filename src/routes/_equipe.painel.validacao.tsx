import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useVitalisStore } from "@/data/store";
import { AlertTriangle } from "lucide-react";
import { nomeEspecialidade } from "@/config/municipio";
import { tempoEsperaTexto } from "@/lib/triagem";
import { cn } from "@/lib/utils";
import { PrioridadePill } from "@/components/StatusPill";

export const Route = createFileRoute("/_equipe/painel/validacao")({
  head: () => ({ meta: [{ title: "Validação clínica. Vitalis Belém" }] }),
  component: ValidacaoLayout,
});

function ValidacaoLayout() {
  const { triagens } = useVitalisStore();
  const params = useParams({ strict: false }) as { id?: string };
  const selectedId = params.id;

  const lista = [...triagens].sort((a, b) => {
    const af = a.redFlags.length > 0 ? 1 : 0;
    const bf = b.redFlags.length > 0 ? 1 : 0;
    if (af !== bf) return bf - af;
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-soft">
            Segurança clínica
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-text-strong">
            Validação de triagens
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O Vitalis orienta. Você decide o encaminhamento final.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-xl border border-border bg-surface">
          <div className="border-b border-border p-3 text-xs font-semibold uppercase tracking-wide text-text-soft">
            Fila ({lista.length})
          </div>
          <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
            {lista.map((t) => {
              const urg = t.redFlags.length > 0 || t.status === "urgencia";
              const active = selectedId === t.id;
              return (
                <li key={t.id}>
                  <Link
                    to="/painel/validacao/$id"
                    params={{ id: t.id }}
                    className={cn(
                      "block px-4 py-3 transition-colors hover:bg-muted/60",
                      active && "bg-primary-50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate text-sm font-medium text-text-strong">
                          {urg && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />}
                          {t.animal.nome}
                          <span className="font-mono text-[11px] text-text-soft">{t.protocolo}</span>
                        </p>
                        <p className="truncate text-xs text-text-soft">
                          {t.tutor.nome} · {t.canal === "online" ? "Online" : "Móvel"}
                        </p>
                      </div>
                      <PrioridadePill prioridade={t.prioridade} />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t.sugestao === "urgencia" ? "Urgência" : nomeEspecialidade(t.sugestao)}
                      </span>
                      <span className="text-text-soft">{tempoEsperaTexto(t.criadoEm)}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

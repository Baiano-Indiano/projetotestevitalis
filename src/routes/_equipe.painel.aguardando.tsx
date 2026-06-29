import { createFileRoute, Link } from "@tanstack/react-router";
import { useVitalisStore } from "@/data/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, AlertTriangle, PawPrint, Cat, ChevronRight } from "lucide-react";
import { tempoEsperaTexto } from "@/lib/triagem";
import { nomeEspecialidade } from "@/config/municipio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/aguardando")({
  head: () => ({ meta: [{ title: "Pacientes Aguardando. Vitalis Belém" }] }),
  component: Aguardando,
});

function Aguardando() {
  const { triagens } = useVitalisStore();
  const fila = triagens.filter((t) => t.status === "pendente" || t.status === "urgencia");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
        Pacientes Aguardando
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fila presencial e online em tempo real. Ordenada por prioridade clínica.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar paciente ou tutor..." />
        </div>
        <Button variant="outline" size="sm">Todas espécies</Button>
        <Button variant="outline" size="sm">Todas prioridades</Button>
      </div>

      <ul className="mt-5 space-y-3">
        {fila.map((t) => {
          const urg = t.status === "urgencia" || t.prioridade === "alta";
          const Icone = t.animal.especie === "gato" ? Cat : PawPrint;
          return (
            <li key={t.id}>
              <Link
                to="/painel/validacao/$id"
                params={{ id: t.id }}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-surface p-4 shadow-sm transition-all hover:shadow-md",
                  urg ? "border-destructive/30 bg-destructive-50/30" : "border-border",
                )}
              >
                <span className={cn(
                  "grid h-12 w-12 shrink-0 place-items-center rounded-full",
                  urg ? "bg-destructive-50 text-destructive" : "bg-primary-50 text-primary",
                )}>
                  <Icone className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-text-strong">
                      {t.animal.nome} <span className="font-normal text-text-soft">({t.animal.especie === "cao" ? "Cão" : "Gato"})</span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-text-soft">
                      <Clock className="h-3 w-3" /> Chegou há {tempoEsperaTexto(t.criadoEm)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {t.etapas.observacoes || "Triagem em fila"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      urg ? "bg-destructive text-destructive-foreground" : t.prioridade === "media" ? "bg-warning text-white" : "bg-success text-white",
                    )}>
                      {urg ? "Urgente" : t.prioridade === "media" ? "Recomendado" : "Simples"}
                    </span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-text-strong">
                      {t.sugestao === "urgencia" ? "Urgência" : nomeEspecialidade(t.sugestao as never)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-text-soft" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

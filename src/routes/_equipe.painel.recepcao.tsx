import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useVitalisStore } from "@/data/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusPill, PrioridadePill } from "@/components/StatusPill";
import { tempoEsperaTexto } from "@/lib/triagem";
import { AlertTriangle, Search, Stethoscope, Users, UserCheck } from "lucide-react";
import { nomeEspecialidade } from "@/config/municipio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_equipe/painel/recepcao")({
  head: () => ({ meta: [{ title: "Recepção. Vitalis Belém" }] }),
  component: Recepcao,
});

type Filtro = "todas" | "pendentes" | "urgencias" | "validadas";

function Recepcao() {
  const { triagens } = useVitalisStore();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    let l = [...triagens];
    if (filtro === "pendentes") l = l.filter((t) => t.status === "pendente");
    if (filtro === "urgencias") l = l.filter((t) => t.status === "urgencia" || t.redFlags.length > 0);
    if (filtro === "validadas") l = l.filter((t) => t.status === "validada");
    if (busca) {
      const q = busca.toLowerCase();
      l = l.filter(
        (t) =>
          t.animal.nome.toLowerCase().includes(q) ||
          t.tutor.nome.toLowerCase().includes(q) ||
          t.protocolo.toLowerCase().includes(q),
      );
    }
    // Red-flags sempre no topo, depois por data
    return l.sort((a, b) => {
      const af = a.redFlags.length > 0 ? 1 : 0;
      const bf = b.redFlags.length > 0 ? 1 : 0;
      if (af !== bf) return bf - af;
      return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
    });
  }, [triagens, filtro, busca]);

  const counts = {
    todas: triagens.length,
    pendentes: triagens.filter((t) => t.status === "pendente").length,
    urgencias: triagens.filter((t) => t.status === "urgencia" || t.redFlags.length > 0).length,
    validadas: triagens.filter((t) => t.status === "validada").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-soft">
            Painel da equipe
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-text-strong">
            Recepção
          </h1>
        </div>
        <Button asChild>
          <Link to="/painel/validacao">Ir para validação</Link>
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Triagens online" value={counts.pendentes + counts.urgencias} Icon={Stethoscope} tone="primary" />
        <Stat label="Pacientes aguardando" value={counts.pendentes} Icon={Users} />
        <Stat label="Veterinários disponíveis" value={4} Icon={UserCheck} tone="success" />
        <Stat label="Em atendimento" value={2} Icon={Stethoscope} />
      </div>

      <Card className="border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex items-center gap-1">
            {(["todas", "pendentes", "urgencias", "validadas"] as Filtro[]).map((k) => (
              <button
                key={k}
                onClick={() => setFiltro(k)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  filtro === k
                    ? "bg-primary-50 text-primary-800"
                    : "text-muted-foreground hover:bg-muted hover:text-text-strong",
                )}
              >
                {labelFiltro(k)}{" "}
                <span className="ml-1 font-mono text-xs text-text-soft">{counts[k]}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-soft" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar animal, tutor ou protocolo"
              className="pl-8"
            />
          </div>
        </div>

        {lista.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-display text-base font-semibold text-text-strong">
              Nada por aqui ainda
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Quando triagens chegarem, elas aparecem aqui priorizadas por urgência.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Sugestão</TableHead>
                <TableHead>Espera</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((t) => {
                const urg = t.redFlags.length > 0 || t.status === "urgencia";
                return (
                  <TableRow key={t.id} asChild className="cursor-pointer">
                    <Link to="/painel/validacao/$id" params={{ id: t.id }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {urg && <AlertTriangle className="h-4 w-4 text-destructive" aria-label="Red flag" />}
                          <div>
                            <p className="font-medium text-text-strong">{t.animal.nome}</p>
                            <p className="text-xs text-text-soft">
                              {t.animal.especie === "cao" ? "Cão" : t.animal.especie === "gato" ? "Gato" : "Outro"} ·{" "}
                              {t.animal.raca} · {t.animal.idade}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-text-strong">{t.tutor.nome}</p>
                        <p className="text-xs text-text-soft">{t.tutor.telefone}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {t.canal === "online" ? "Online" : "Unidade móvel"}
                        </span>
                        <p className="font-mono text-[11px] text-text-soft">{t.protocolo}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-text-strong">
                          {t.sugestao === "urgencia" ? "Urgência" : nomeEspecialidade(t.sugestao)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tempoEsperaTexto(t.criadoEm)}</TableCell>
                      <TableCell><PrioridadePill prioridade={t.prioridade} /></TableCell>
                      <TableCell>
                        <StatusPill
                          status={
                            t.status === "urgencia"
                              ? "urgencia"
                              : t.status === "validada"
                                ? "validada"
                                : t.status === "redirecionada"
                                  ? "redirecionada"
                                  : "aguardando"
                          }
                        />
                      </TableCell>
                    </Link>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

function labelFiltro(k: Filtro) {
  return k === "todas" ? "Todas" : k === "pendentes" ? "Pendentes" : k === "urgencias" ? "Urgências" : "Validadas";
}

function Stat({
  label,
  value,
  Icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  tone?: "neutral" | "primary" | "success";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary-50 text-primary-800"
      : tone === "success"
        ? "bg-success-50 text-success-700"
        : "bg-muted text-text-strong";
  return (
    <Card className="border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-text-soft">{label}</p>
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", cls)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-text-strong">{value}</p>
    </Card>
  );
}

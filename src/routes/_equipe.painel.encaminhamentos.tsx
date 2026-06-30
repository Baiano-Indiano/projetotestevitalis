import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  GitBranchPlus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PawPrint,
  Cat,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { municipio } from "@/config/municipio";
import { useStore } from "@/data/store";
import type { Triagem } from "@/data/types";

export const Route = createFileRoute("/_equipe/painel/encaminhamentos")({
  head: () => ({ meta: [{ title: "Encaminhamentos. Vitalis Belém" }] }),
  component: Encaminhamentos,
});

type StatusEnc = "pendente" | "aceito";

interface Encaminhamento {
  id: string;
  protocolo: string;
  paciente: string;
  especie: "cao" | "gato" | "outro";
  tutor: string;
  origemId: string;
  destinoId: string;
  especialidade: string;
  motivo: string;
  prioridade: "normal" | "alta" | "urgente";
  status: StatusEnc;
  criadoEm: string;
  vetSolicitante: string;
}

function nomeEspecialidade(id: string) {
  return municipio.especialidades.find((e) => e.id === id)?.nome ?? "Urgência";
}

function fromTriagem(t: Triagem): Encaminhamento {
  const origemId = t.unidadeId ?? municipio.unidades[0]?.id ?? "";
  const isUrg = t.status === "urgencia" || t.sugestao === "urgencia";
  const destino =
    municipio.unidades.find((u) => (isUrg ? u.tipo === "hospital" : u.id !== origemId)) ??
    municipio.unidades.find((u) => u.id !== origemId) ??
    municipio.unidades[0];
  const prioridade: Encaminhamento["prioridade"] = isUrg
    ? "urgente"
    : t.prioridade === "alta"
      ? "alta"
      : "normal";
  return {
    id: t.id,
    protocolo: t.protocolo,
    paciente: t.animal.nome,
    especie: t.animal.especie,
    tutor: t.tutor.nome,
    origemId,
    destinoId: destino?.id ?? origemId,
    especialidade: nomeEspecialidade(String(t.sugestao)),
    motivo:
      t.etapas.observacoes?.trim() ||
      (t.redFlags.length
        ? `Sinais de alerta: ${t.redFlags.join(", ")}`
        : `Encaminhamento gerado a partir da triagem ${t.protocolo}.`),
    prioridade,
    status: t.status === "redirecionada" ? "aceito" : "pendente",
    criadoEm: t.criadoEm,
    vetSolicitante: "Equipe de triagem",
  };
}

function Encaminhamentos() {
  const triagens = useStore((s) => s.triagens);
  const lista = useMemo(
    () =>
      triagens
        .filter((t) => t.status === "urgencia" || t.status === "redirecionada")
        .map(fromTriagem),
    [triagens],
  );

  const [busca, setBusca] = useState("");
  const [statusF, setStatusF] = useState<string>("todos");
  const [destinoF, setDestinoF] = useState<string>("todos");
  const [detalhe, setDetalhe] = useState<Encaminhamento | null>(null);

  const filtrada = useMemo(() => {
    return lista.filter((e) => {
      if (statusF !== "todos" && e.status !== statusF) return false;
      if (destinoF !== "todos" && e.destinoId !== destinoF) return false;
      if (busca) {
        const q = busca.toLowerCase();
        if (
          !e.paciente.toLowerCase().includes(q) &&
          !e.tutor.toLowerCase().includes(q) &&
          !e.protocolo.toLowerCase().includes(q) &&
          !e.especialidade.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [lista, busca, statusF, destinoF]);

  const stats = [
    {
      Icon: GitBranchPlus,
      label: "Total ativos",
      valor: lista.length,
      bg: "bg-primary-50 text-primary",
    },
    {
      Icon: Clock,
      label: "Pendentes",
      valor: lista.filter((e) => e.status === "pendente").length,
      bg: "bg-warning-50 text-warning-700",
    },
    {
      Icon: CheckCircle2,
      label: "Aceitos",
      valor: lista.filter((e) => e.status === "aceito").length,
      bg: "bg-success-50 text-success-700",
    },
    {
      Icon: AlertTriangle,
      label: "Urgentes abertos",
      valor: lista.filter(
        (e) => e.prioridade === "urgente" && e.status === "pendente",
      ).length,
      bg: "bg-destructive-50 text-destructive",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
          Equipe
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
          Encaminhamentos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pacientes redirecionados ou marcados como urgência pela triagem clínica.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icone = s.Icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl",
                    s.bg,
                  )}
                >
                  <Icone className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                  {s.label}
                </p>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-text-strong">
                {s.valor}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar protocolo, paciente, tutor ou especialidade..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aceito">Aceito</SelectItem>
            </SelectContent>
          </Select>
          <Select value={destinoF} onValueChange={setDestinoF}>
            <SelectTrigger className="w-[220px]">
              <Building2 className="mr-1.5 h-3.5 w-3.5" />
              <SelectValue placeholder="Destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as unidades</SelectItem>
              {municipio.unidades.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              <tr>
                <th className="px-4 py-3">Protocolo & Paciente</th>
                <th className="px-4 py-3">Origem → Destino</th>
                <th className="px-4 py-3">Especialidade</th>
                <th className="px-4 py-3">Prioridade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtrada.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Nenhum encaminhamento ativo. Quando uma triagem for marcada como urgência ou redirecionada, ela aparecerá aqui automaticamente.
                  </td>
                </tr>
              ) : (
                filtrada.map((e) => {
                  const Icone = e.especie === "gato" ? Cat : PawPrint;
                  const origem = municipio.unidades.find(
                    (u) => u.id === e.origemId,
                  );
                  const destino = municipio.unidades.find(
                    (u) => u.id === e.destinoId,
                  );
                  return (
                    <tr key={e.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-50 text-primary">
                            <Icone className="h-4 w-4" />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-mono text-[11px] text-text-soft">
                              {e.protocolo}
                            </span>
                            <span className="font-semibold text-text-strong">
                              {e.paciente}
                              <span className="ml-1 text-xs font-normal text-text-soft">
                                · {e.tutor}
                              </span>
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-text-soft">
                          <span className="font-medium text-text-strong">
                            {origem?.nome ?? "—"}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-medium text-text-strong">
                            {destino?.nome ?? "—"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-strong">
                        {e.especialidade}
                      </td>
                      <td className="px-4 py-3">
                        <PrioridadePill p={e.prioridade} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill s={e.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDetalhe(e)}
                        >
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetalheDialog
        encaminhamento={detalhe}
        onClose={() => setDetalhe(null)}
      />
    </div>
  );
}

function StatusPill({ s }: { s: StatusEnc }) {
  const map: Record<StatusEnc, { c: string; d: string; label: string }> = {
    pendente: {
      c: "bg-warning-50 text-warning-700",
      d: "bg-warning",
      label: "Pendente",
    },
    aceito: {
      c: "bg-success-50 text-success-700",
      d: "bg-success",
      label: "Aceito",
    },
  };
  const cfg = map[s];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        cfg.c,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.d)} /> {cfg.label}
    </span>
  );
}

function PrioridadePill({ p }: { p: Encaminhamento["prioridade"] }) {
  const map = {
    normal: "bg-muted text-text-soft",
    alta: "bg-warning-50 text-warning-700",
    urgente: "bg-destructive-50 text-destructive",
  } as const;
  const label = { normal: "Normal", alta: "Alta", urgente: "Urgente" }[p];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        map[p],
      )}
    >
      {label}
    </span>
  );
}

function DetalheDialog({
  encaminhamento,
  onClose,
}: {
  encaminhamento: Encaminhamento | null;
  onClose: () => void;
}) {
  if (!encaminhamento) return null;
  const e = encaminhamento;
  const origem = municipio.unidades.find((u) => u.id === e.origemId);
  const destino = municipio.unidades.find((u) => u.id === e.destinoId);
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{e.protocolo}</DialogTitle>
          <DialogDescription>
            Detalhes do encaminhamento gerado pela triagem clínica.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Paciente</span>
            <span className="font-semibold text-text-strong">
              {e.paciente} · {e.tutor}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Especialidade</span>
            <span className="font-medium text-text-strong">{e.especialidade}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Origem</span>
            <span className="font-medium text-text-strong">{origem?.nome}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Destino</span>
            <span className="font-medium text-text-strong">{destino?.nome}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Criado em</span>
            <span className="font-medium text-text-strong">
              {fmt.format(new Date(e.criadoEm))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Prioridade</span>
            <PrioridadePill p={e.prioridade} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Status</span>
            <StatusPill s={e.status} />
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              Motivo
            </p>
            <p className="mt-1 text-text-strong">{e.motivo}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { municipio } from "@/config/municipio";

export const Route = createFileRoute("/_equipe/painel/encaminhamentos")({
  head: () => ({ meta: [{ title: "Encaminhamentos. Vitalis Belém" }] }),
  component: Encaminhamentos,
});

type StatusEnc =
  | "pendente"
  | "aceito"
  | "recusado"
  | "concluido";

interface Encaminhamento {
  id: string;
  protocolo: string;
  paciente: string;
  especie: "cao" | "gato";
  tutor: string;
  origemId: string;
  destinoId: string;
  especialidade: string;
  motivo: string;
  prioridade: "normal" | "alta" | "urgente";
  status: StatusEnc;
  criadoEm: string; // ISO
  vetSolicitante: string;
}

const seed: Encaminhamento[] = [
  {
    id: "enc-1",
    protocolo: "EN-2026-000118",
    paciente: "Rex",
    especie: "cao",
    tutor: "Maria Silva",
    origemId: municipio.unidades[1]?.id ?? "u1",
    destinoId: municipio.unidades[0]?.id ?? "u0",
    especialidade: "Ortopedia",
    motivo: "Suspeita de fratura em membro posterior após queda.",
    prioridade: "urgente",
    status: "pendente",
    criadoEm: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    vetSolicitante: "Dra. Ana Mendes",
  },
  {
    id: "enc-2",
    protocolo: "EN-2026-000117",
    paciente: "Luna",
    especie: "gato",
    tutor: "João Souza",
    origemId: municipio.unidades[0]?.id ?? "u0",
    destinoId: municipio.unidades[1]?.id ?? "u1",
    especialidade: "Nefrologia",
    motivo: "Acompanhamento de DRC estágio 2 para clínica geral.",
    prioridade: "normal",
    status: "aceito",
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    vetSolicitante: "Dr. Marcos Souza",
  },
  {
    id: "enc-3",
    protocolo: "EN-2026-000116",
    paciente: "Thor",
    especie: "cao",
    tutor: "Ana Oliveira",
    origemId: municipio.unidades[1]?.id ?? "u1",
    destinoId: municipio.unidades[0]?.id ?? "u0",
    especialidade: "Cardiologia",
    motivo: "Sopro grau IV identificado em consulta de rotina.",
    prioridade: "alta",
    status: "concluido",
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    vetSolicitante: "Dra. Juliana Pires",
  },
  {
    id: "enc-4",
    protocolo: "EN-2026-000115",
    paciente: "Bidu",
    especie: "cao",
    tutor: "Carlos Mendes",
    origemId: municipio.unidades[0]?.id ?? "u0",
    destinoId: municipio.unidades[1]?.id ?? "u1",
    especialidade: "Dermatologia",
    motivo: "Lesão crônica refratária ao tratamento inicial.",
    prioridade: "normal",
    status: "recusado",
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    vetSolicitante: "Dr. Ricardo Silva",
  },
];

function Encaminhamentos() {
  const [lista, setLista] = useState<Encaminhamento[]>(seed);
  const [busca, setBusca] = useState("");
  const [statusF, setStatusF] = useState<string>("todos");
  const [destinoF, setDestinoF] = useState<string>("todos");
  const [novoOpen, setNovoOpen] = useState(false);
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
      label: "Total no mês",
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
      label: "Concluídos",
      valor: lista.filter((e) => e.status === "concluido").length,
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

  function atualizarStatus(id: string, status: StatusEnc) {
    setLista((l) => l.map((e) => (e.id === id ? { ...e, status } : e)));
    setDetalhe((d) => (d && d.id === id ? { ...d, status } : d));
    toast.success(`Encaminhamento ${status}.`);
  }

  function criar(novo: Omit<Encaminhamento, "id" | "protocolo" | "criadoEm" | "status">) {
    const ano = new Date().getFullYear();
    const seq = String(lista.length + 119).padStart(6, "0");
    const e: Encaminhamento = {
      ...novo,
      id: crypto.randomUUID(),
      protocolo: `EN-${ano}-${seq}`,
      criadoEm: new Date().toISOString(),
      status: "pendente",
    };
    setLista((l) => [e, ...l]);
    setNovoOpen(false);
    toast.success(`Encaminhamento ${e.protocolo} criado.`);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
            Equipe
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Encaminhamentos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Casos transferidos entre unidades e especialidades com rastreabilidade
            completa.
          </p>
        </div>
        <Button onClick={() => setNovoOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo encaminhamento
        </Button>
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
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="recusado">Recusado</SelectItem>
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
                    Nenhum encaminhamento encontrado para os filtros aplicados.
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
        onStatus={atualizarStatus}
      />
      <NovoDialog
        open={novoOpen}
        onOpenChange={setNovoOpen}
        onCriar={criar}
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
      c: "bg-primary-50 text-primary-800",
      d: "bg-primary",
      label: "Aceito",
    },
    concluido: {
      c: "bg-success-50 text-success-700",
      d: "bg-success",
      label: "Concluído",
    },
    recusado: {
      c: "bg-destructive-50 text-destructive",
      d: "bg-destructive",
      label: "Recusado",
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
  onStatus,
}: {
  encaminhamento: Encaminhamento | null;
  onClose: () => void;
  onStatus: (id: string, status: StatusEnc) => void;
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
            Detalhes do encaminhamento e ações disponíveis.
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
            <span className="font-medium text-text-strong">
              {e.especialidade}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Origem</span>
            <span className="font-medium text-text-strong">{origem?.nome}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Destino</span>
            <span className="font-medium text-text-strong">
              {destino?.nome}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-soft">Solicitante</span>
            <span className="font-medium text-text-strong">
              {e.vetSolicitante}
            </span>
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
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              Motivo
            </p>
            <p className="mt-1 text-text-strong">{e.motivo}</p>
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <div className="flex flex-wrap gap-2">
            {e.status === "pendente" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onStatus(e.id, "recusado")}
                >
                  Recusar
                </Button>
                <Button onClick={() => onStatus(e.id, "aceito")}>Aceitar</Button>
              </>
            )}
            {e.status === "aceito" && (
              <Button onClick={() => onStatus(e.id, "concluido")}>
                Marcar como concluído
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NovoDialog({
  open,
  onOpenChange,
  onCriar,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCriar: (
    novo: Omit<Encaminhamento, "id" | "protocolo" | "criadoEm" | "status">,
  ) => void;
}) {
  const [paciente, setPaciente] = useState("");
  const [tutor, setTutor] = useState("");
  const [especie, setEspecie] = useState<"cao" | "gato">("cao");
  const [origemId, setOrigemId] = useState(municipio.unidades[0]?.id ?? "");
  const [destinoId, setDestinoId] = useState(municipio.unidades[1]?.id ?? municipio.unidades[0]?.id ?? "");
  const [especialidade, setEspecialidade] = useState<string>(
    municipio.especialidades[0]?.nome ?? "Clínico Geral",
  );
  const [prioridade, setPrioridade] = useState<"normal" | "alta" | "urgente">(
    "normal",
  );
  const [motivo, setMotivo] = useState("");
  const [vetSolicitante, setVetSolicitante] = useState("");

  function reset() {
    setPaciente("");
    setTutor("");
    setEspecie("cao");
    setMotivo("");
    setVetSolicitante("");
    setPrioridade("normal");
  }

  function enviar() {
    if (!paciente || !tutor || !motivo || !vetSolicitante) {
      toast.error("Preencha paciente, tutor, motivo e veterinário solicitante.");
      return;
    }
    if (origemId === destinoId) {
      toast.error("Origem e destino devem ser diferentes.");
      return;
    }
    onCriar({
      paciente,
      tutor,
      especie,
      origemId,
      destinoId,
      especialidade,
      prioridade,
      motivo,
      vetSolicitante,
    });
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Novo encaminhamento</DialogTitle>
          <DialogDescription>
            Transfira um caso entre unidades ou especialidades com rastreabilidade.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                Paciente
              </label>
              <Input value={paciente} onChange={(e) => setPaciente(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                Tutor
              </label>
              <Input value={tutor} onChange={(e) => setTutor(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                Espécie
              </label>
              <Select value={especie} onValueChange={(v) => setEspecie(v as "cao" | "gato")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cao">Cão</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                Prioridade
              </label>
              <Select value={prioridade} onValueChange={(v) => setPrioridade(v as typeof prioridade)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                Origem
              </label>
              <Select value={origemId} onValueChange={setOrigemId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {municipio.unidades.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
                Destino
              </label>
              <Select value={destinoId} onValueChange={setDestinoId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {municipio.unidades.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              Especialidade
            </label>
            <Select value={especialidade} onValueChange={setEspecialidade}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {municipio.especialidades.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              Veterinário solicitante
            </label>
            <Input
              value={vetSolicitante}
              onChange={(e) => setVetSolicitante(e.target.value)}
              placeholder="Ex.: Dra. Ana Mendes"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-text-soft">
              Motivo do encaminhamento
            </label>
            <Textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o quadro clínico e a justificativa..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={enviar}>Criar encaminhamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

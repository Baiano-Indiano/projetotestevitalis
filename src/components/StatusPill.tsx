import { cn } from "@/lib/utils";
import { AlertTriangle, Check, Clock, RotateCcw, CircleDot, CalendarClock } from "lucide-react";

export type StatusKey =
  | "aguardando"
  | "atendimento"
  | "urgencia"
  | "validada"
  | "redirecionada"
  | "agendada";

const map: Record<
  StatusKey,
  { label: string; cls: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  aguardando: {
    label: "Aguardando",
    cls: "bg-primary-50 text-primary-800 border-primary-100",
    Icon: Clock,
  },
  atendimento: {
    label: "Em atendimento",
    cls: "bg-primary text-primary-foreground border-primary",
    Icon: CircleDot,
  },
  urgencia: {
    label: "Urgência",
    cls: "bg-destructive-50 text-destructive-700 border-destructive/30",
    Icon: AlertTriangle,
  },
  validada: {
    label: "Validada",
    cls: "bg-success-50 text-success-700 border-success/30",
    Icon: Check,
  },
  redirecionada: {
    label: "Redirecionada",
    cls: "bg-warning-50 text-warning-700 border-warning/30",
    Icon: RotateCcw,
  },
  agendada: {
    label: "Agendada",
    cls: "bg-primary-50 text-primary-800 border-primary-100",
    Icon: CalendarClock,
  },
};

export function StatusPill({ status, className }: { status: StatusKey; className?: string }) {
  const { label, cls, Icon } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

const prioridadeCls: Record<string, string> = {
  alta: "bg-destructive-50 text-destructive-700 border-destructive/30",
  media: "bg-warning-50 text-warning-700 border-warning/30",
  baixa: "bg-muted text-muted-foreground border-border",
};

export function PrioridadePill({ prioridade }: { prioridade: "alta" | "media" | "baixa" }) {
  const label = prioridade === "alta" ? "Alta" : prioridade === "media" ? "Média" : "Baixa";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        prioridadeCls[prioridade],
      )}
    >
      {label}
    </span>
  );
}

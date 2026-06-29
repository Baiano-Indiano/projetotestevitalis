import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  Users,
  Wifi,
  Stethoscope,
  UserSquare2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useVitalisStore } from "@/data/store";

export const Route = createFileRoute("/_equipe/painel/")({
  head: () => ({ meta: [{ title: "Painel da Recepção. Vitalis Belém" }] }),
  component: PainelRecepcao,
});

function PainelRecepcao() {
  const { triagens } = useVitalisStore();
  const pendentes = triagens.filter((t) => t.status === "pendente" || t.status === "urgencia").length;
  const triagensHoje = triagens.length + 22;

  const data = new Date();
  const dataFmt = data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const horaFmt = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const stats = [
    { label: "Pacientes Aguardando", valor: pendentes, cor: "text-primary" },
    { label: "Triagens Online (hoje)", valor: triagensHoje, cor: "text-success-700" },
    { label: "Veterinários Disponíveis", valor: 5, cor: "text-primary" },
    { label: "Em Atendimento", valor: 8, cor: "text-destructive" },
    { label: "Agendamentos do Dia", valor: 45, cor: "text-primary" },
  ];

  const modulos: { to: string; titulo: string; desc: string; Icon: typeof LayoutGrid; badge?: string; tone?: "primary" | "success" | "muted" }[] = [
    { to: "/painel/aguardando", titulo: "Pacientes Aguardando", desc: "Fila presencial e online", Icon: Users, badge: `${pendentes} na fila`, tone: "primary" },
    { to: "/painel/triagens", titulo: "Triagens Online", desc: "Análise de pré atendimento", Icon: Wifi, badge: "5", tone: "success" },
    { to: "/painel/veterinarios", titulo: "Veterinários", desc: "Status de disponibilidade", Icon: Stethoscope, badge: "5 ativos", tone: "muted" },
    { to: "/painel/em-atendimento", titulo: "Em Atendimento", desc: "Acompanhar fluxo atual", Icon: UserSquare2, badge: "8", tone: "primary" },
    { to: "/painel/agenda", titulo: "Agendamentos", desc: "Gestão da agenda clínica e retornos programados", Icon: CalendarDays },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-strong md:text-4xl">
            Painel da Recepção
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bem vindo(a) ao sistema de gestão hospitalar.
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium capitalize text-primary-700">{dataFmt} às {horaFmt}</p>
          <p className="text-xs text-text-soft">Recepção: Ana Silva</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-soft">{s.label}</p>
            <p className={`mt-3 font-display text-3xl font-bold ${s.cor}`}>{s.valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m) => {
          const Icone = m.Icon;
          return (
            <Link
              key={m.to}
              to={m.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Icone className="h-5 w-5" />
                </span>
                {m.badge && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    {m.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text-strong">{m.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-text-soft transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
